"""
Vues API pour l'application EMD
Gestion des endpoints REST

Sécurité :
- Endpoints publics explicitement annotés @permission_classes([AllowAny])
- Tout autre endpoint exige une authentification (voir settings DRF)
- La liste des messages de contact est protégée par token admin signé
- Rate limiting anti-spam sur le contact et anti brute-force sur le login admin
"""

from rest_framework import status
from rest_framework.decorators import (
    api_view, permission_classes, throttle_classes
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.mail import EmailMessage
from django.contrib.auth.hashers import check_password
from django.core import signing
from django.core.files.base import ContentFile
import base64
import uuid
import logging

from .models import ContactMessage, GalleryImage, NewsArticle
from .serializers import (
    ContactMessageSerializer,
    GalleryImageSerializer,
    NewsArticleListSerializer,
    NewsArticleDetailSerializer,
    AdminNewsArticleSerializer
)

logger = logging.getLogger(__name__)

ADMIN_TOKEN_SALT = 'emd.admin.token.v1'


class ContactThrottle(AnonRateThrottle):
    """Anti-spam du formulaire de contact."""
    scope = 'contact'


class AdminLoginThrottle(AnonRateThrottle):
    """Anti brute-force de la connexion administrateur."""
    scope = 'admin_login'


def _safe_int(value, fallback):
    """Convertit un paramètre de requête en entier sans lever d'exception."""
    try:
        return max(1, min(int(value), 200))
    except (TypeError, ValueError):
        return fallback


def _issue_admin_token(username):
    """
    Émet un token signé (HMAC basé sur la SECRET_KEY serveur) avec expiration.
    Impossible à falsifier côté client.
    """
    return signing.dumps(
        {'role': 'admin', 'user': username},
        salt=ADMIN_TOKEN_SALT,
    )


def _validate_admin_token(request):
    """Vérifie le header Authorization: Bearer <token signé>."""
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return False
    try:
        data = signing.loads(
            auth[7:],
            salt=ADMIN_TOKEN_SALT,
            max_age=getattr(settings, 'ADMIN_TOKEN_MAX_AGE', 60 * 60 * 8),
        )
        return data.get('role') == 'admin'
    except (signing.BadSignature, signing.SignatureExpired):
        return False


def _admin_unauthorized():
    """Réponse standard pour un endpoint admin accessible sans token valide."""
    return Response(
        {"success": False, "message": "Authentification requise."},
        status=status.HTTP_401_UNAUTHORIZED,
    )


# Taille maximale d'une image envoyée en base64 (~5 Mo après encodage)
MAX_BASE64_IMAGE_SIZE = 6_000_000
ALLOWED_IMAGE_EXTENSIONS = {'jpeg', 'jpg', 'png', 'webp', 'gif'}


def _decode_base64_image(data):
    """
    Décode une image envoyée sous forme de data URL base64
    ('data:image/jpeg;base64,...') en fichier uploadable Django.
    Retourne None si le format est invalide ou non autorisé.
    """
    if not isinstance(data, str) or not data.startswith('data:image'):
        return None
    if len(data) > MAX_BASE64_IMAGE_SIZE:
        return None
    try:
        header, b64_data = data.split(';base64,', 1)
        ext = header.split('/')[-1].lower().split('+')[0]
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            return None
        decoded = base64.b64decode(b64_data, validate=True)
        if not decoded:
            return None
        return ContentFile(decoded, name=f"emd_{uuid.uuid4().hex[:12]}.{ext}")
    except Exception:
        logger.warning("Échec du décodage d'une image base64")
        return None


def _strip_image_fields(data):
    """
    Retire les champs image du payload avant validation par le serializer :
    les images sont gérées séparément (upload base64 -> ContentFile).
    """
    cleaned = {}
    for key, value in data.items():
        if key in ('image', 'image_url'):
            continue
        cleaned[key] = value
    return cleaned


# ==================== ADMIN AUTH ====================

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AdminLoginThrottle])
def admin_login(request):
    """
    Authentifie l'administrateur du dashboard React et renvoie un token signé.
    Le mot de passe n'est jamais stocké côté client : il est comparé au hash
    PBKDF2 défini dans l'environnement serveur (ADMIN_API_PASSWORD_HASH).
    """
    username = str(request.data.get('username', '')).strip()
    password = str(request.data.get('password', ''))

    expected_username = getattr(settings, 'ADMIN_API_USERNAME', '')
    expected_hash = getattr(settings, 'ADMIN_API_PASSWORD_HASH', '')

    # Compte admin non configuré côté serveur -> refus (pas d'indice)
    if not expected_hash:
        logger.warning(
            "Tentative de login admin alors que ADMIN_API_PASSWORD_HASH "
            "n'est pas configuré."
        )
        return Response(
            {"success": False, "message": "Identifiants incorrects."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Identifiant exact + vérification du mot de passe via hash PBKDF2
    # (comparaison en temps constant).
    username_ok = username == expected_username
    password_ok = check_password(password, expected_hash)

    if username_ok and password_ok:
        token = _issue_admin_token(expected_username)
        max_age = getattr(settings, 'ADMIN_TOKEN_MAX_AGE', 60 * 60 * 8)
        logger.info("Connexion administrateur réussie")
        return Response(
            {
                "success": True,
                "token": token,
                "expires_in": max_age,
                "session": {
                    "user": {
                        "name": "Administrateur EMD",
                        "role": "Super Admin",
                        "email": expected_username if '@' in expected_username else "admin@emd.sn",
                    }
                },
            },
            status=status.HTTP_200_OK,
        )

    logger.warning("Échec de connexion admin pour l'identifiant '%s'", username[:64])
    return Response(
        {"success": False, "message": "Identifiants incorrects."},
        status=status.HTTP_401_UNAUTHORIZED,
    )


# ==================== CONTACT ====================

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([ContactThrottle])
def create_contact_message(request):
    """
    Crée un message de contact + envoie un email à l'administrateur.
    Débit limité (scope 'contact') pour prévenir le spam.
    """

    serializer = ContactMessageSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {
                "success": False,
                "message": "Erreur de validation",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Sauvegarde du message
    message_instance = serializer.save()

    # ==================== ENVOI EMAIL ====================
    try:
        email = EmailMessage(
            subject=f"[CONTACT EMD] Message de {message_instance.nom}",
            body=(
                "Nouveau message reçu depuis le site EMD\n\n"
                f"Nom : {message_instance.nom}\n"
                f"Email : {message_instance.email}\n\n"
                "Message :\n"
                f"{message_instance.message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.EMAIL_RECEIVER],
            reply_to=[message_instance.email],
        )

        email.send(fail_silently=False)

        logger.info("Email envoyé avec succès")

    except Exception:
        # Détail de l'erreur journalisé côté serveur uniquement :
        # aucune trace technique renvoyée au client.
        logger.exception("Erreur envoi email")

        return Response(
            {
                "success": True,
                "message": (
                    "Message enregistré avec succès, "
                    "mais l'email n'a pas pu être envoyé."
                ),
                "data": {
                    "id": message_instance.id,
                    "nom": message_instance.nom,
                    "email": message_instance.email,
                    "date": message_instance.date
                }
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        {
            "success": True,
            "message": (
                "Votre message a été envoyé avec succès. "
                "Nous vous contacterons très bientôt."
            ),
            "data": {
                "id": message_instance.id,
                "nom": message_instance.nom,
                "email": message_instance.email,
                "date": message_instance.date
            }
        },
        status=status.HTTP_201_CREATED
    )

# ==================== CONTACT (ADMIN - PROTÉGÉ) ====================

@api_view(['GET'])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle])
def get_contact_messages(request):
    """
    Récupérer les messages de contact.
    ENDPOINT PROTÉGÉ : exige Authorization: Bearer <token admin signé>.
    La validation du token est effectuée manuellement ci-dessous.
    """
    if not _validate_admin_token(request):
        return Response(
            {"success": False, "message": "Authentification requise."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    messages = ContactMessage.objects.all().order_by('-date')

    lu_param = request.query_params.get('lu')
    if lu_param is not None:
        messages = messages.filter(lu=lu_param.lower() == 'true')

    limit_param = request.query_params.get('limit')
    if limit_param:
        messages = messages[:_safe_int(limit_param, 100)]

    serializer = ContactMessageSerializer(messages[:200], many=True)

    return Response(
        {
            "success": True,
            "count": len(serializer.data),
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )

# ==================== GALERIE ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def gallery_list(request):
    images = GalleryImage.objects.filter(is_active=True)

    cycle = request.query_params.get('cycle')
    if cycle:
        images = images.filter(cycle=cycle)

    featured = request.query_params.get('featured')
    if featured is not None:
        images = images.filter(is_featured=featured.lower() == 'true')

    limit = request.query_params.get('limit')
    if limit:
        images = images[:_safe_int(limit, 50)]

    serializer = GalleryImageSerializer(
        images,
        many=True,
        context={"request": request}
    )

    # Ajouter l'URL complète de chaque image
    data = []
    for item in serializer.data:
        item['image_url'] = request.build_absolute_uri(item['image'])
        data.append(item)

    return Response(
        {
            "success": True,
            "count": len(data),
            "data": data
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def gallery_detail(request, pk):
    image = get_object_or_404(GalleryImage, pk=pk, is_active=True)
    serializer = GalleryImageSerializer(image, context={"request": request})

    data = serializer.data
    data['image_url'] = request.build_absolute_uri(image.image.url)

    return Response(
        {
            "success": True,
            "data": data
        },
        status=status.HTTP_200_OK
    )


# ==================== ACTUALITÉS ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def news_list(request):
    articles = NewsArticle.objects.filter(is_published=True)

    category = request.query_params.get('category')
    if category:
        articles = articles.filter(category=category)

    featured = request.query_params.get('featured')
    if featured is not None:
        articles = articles.filter(is_featured=featured.lower() == 'true')

    limit = request.query_params.get('limit')
    if limit:
        articles = articles[:_safe_int(limit, 50)]

    serializer = NewsArticleListSerializer(
        articles,
        many=True,
        context={"request": request}
    )

    return Response(
        {
            "success": True,
            "count": len(serializer.data),
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
@permission_classes([AllowAny])
def news_detail(request, slug):
    article = get_object_or_404(
        NewsArticle,
        slug=slug,
        is_published=True
    )
    article.increment_views()

    serializer = NewsArticleDetailSerializer(
        article,
        context={"request": request}
    )

    return Response(
        {
            "success": True,
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )

# ==================== ADMIN : ACTUALITÉS (PROTÉGÉ) ====================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def admin_news(request):
    """
    GET  : liste de TOUS les articles (publiés ou non) pour le dashboard.
    POST : création d'un article. Image acceptée en data URL base64.
    ENDPOINT PROTÉGÉ par token admin signé.
    """
    if not _validate_admin_token(request):
        return _admin_unauthorized()

    if request.method == 'GET':
        articles = NewsArticle.objects.all()
        serializer = AdminNewsArticleSerializer(
            articles, many=True, context={"request": request}
        )
        return Response(
            {"success": True, "count": len(serializer.data), "data": serializer.data},
            status=status.HTTP_200_OK
        )

    # POST - création
    serializer = AdminNewsArticleSerializer(
        data=_strip_image_fields(request.data), context={"request": request}
    )
    if not serializer.is_valid():
        return Response(
            {"success": False, "message": "Erreur de validation", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    article = serializer.save()

    image_file = _decode_base64_image(
        request.data.get('image') or request.data.get('image_url')
    )
    if image_file:
        article.image.save(image_file.name, image_file, save=True)

    logger.info("Article créé : %s", article.slug)
    return Response(
        {
            "success": True,
            "message": "Article créé avec succès.",
            "data": AdminNewsArticleSerializer(article, context={"request": request}).data
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['PATCH', 'DELETE'])
@permission_classes([AllowAny])
def admin_news_detail(request, pk):
    """
    PATCH  : modification partielle d'un article (titre, contenu,
             is_published, is_featured...). Image en base64 acceptée.
    DELETE : suppression définitive de l'article.
    ENDPOINT PROTÉGÉ par token admin signé.
    """
    if not _validate_admin_token(request):
        return _admin_unauthorized()

    article = get_object_or_404(NewsArticle, pk=pk)

    if request.method == 'DELETE':
        if article.image:
            article.image.delete(save=False)
        article.delete()
        logger.info("Article supprimé : id=%s", pk)
        return Response(
            {"success": True, "message": "Article supprimé."},
            status=status.HTTP_200_OK
        )

    # PATCH
    serializer = AdminNewsArticleSerializer(
        article,
        data=_strip_image_fields(request.data),
        partial=True,
        context={"request": request}
    )
    if not serializer.is_valid():
        return Response(
            {"success": False, "message": "Erreur de validation", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    updated = serializer.save()

    image_file = _decode_base64_image(
        request.data.get('image') or request.data.get('image_url')
    )
    if image_file:
        updated.image.save(image_file.name, image_file, save=True)

    return Response(
        {
            "success": True,
            "message": "Article mis à jour.",
            "data": AdminNewsArticleSerializer(updated, context={"request": request}).data
        },
        status=status.HTTP_200_OK
    )


# ==================== ADMIN : GALERIE (PROTÉGÉ) ====================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def admin_gallery(request):
    """
    GET  : liste de TOUTES les images (actives ou non) pour le dashboard.
    POST : ajout d'une image. Fichier requis (data URL base64).
    ENDPOINT PROTÉGÉ par token admin signé.
    """
    if not _validate_admin_token(request):
        return _admin_unauthorized()

    if request.method == 'GET':
        images = GalleryImage.objects.all()
        cycle = request.query_params.get('cycle')
        if cycle:
            images = images.filter(cycle=cycle)
        serializer = GalleryImageSerializer(
            images, many=True, context={"request": request}
        )
        return Response(
            {"success": True, "count": len(serializer.data), "data": serializer.data},
            status=status.HTTP_200_OK
        )

    # POST - création
    image_file = _decode_base64_image(request.data.get('image'))
    if image_file is None:
        return Response(
            {"success": False, "message": "Une image valide est requise."},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = GalleryImageSerializer(
        data=_strip_image_fields(request.data), context={"request": request}
    )
    if not serializer.is_valid():
        return Response(
            {"success": False, "message": "Erreur de validation", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    gallery_image = serializer.save()
    gallery_image.image.save(image_file.name, image_file, save=True)

    logger.info("Image de galerie créée : id=%s", gallery_image.id)
    return Response(
        {
            "success": True,
            "message": "Image ajoutée avec succès.",
            "data": GalleryImageSerializer(gallery_image, context={"request": request}).data
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['PATCH', 'DELETE'])
@permission_classes([AllowAny])
def admin_gallery_detail(request, pk):
    """
    PATCH  : modification partielle (title, description, cycle,
             is_active, is_featured, order, image).
    DELETE : suppression définitive de l'image.
    ENDPOINT PROTÉGÉ par token admin signé.
    """
    if not _validate_admin_token(request):
        return _admin_unauthorized()

    gallery_image = get_object_or_404(GalleryImage, pk=pk)

    if request.method == 'DELETE':
        if gallery_image.image:
            gallery_image.image.delete(save=False)
        gallery_image.delete()
        logger.info("Image de galerie supprimée : id=%s", pk)
        return Response(
            {"success": True, "message": "Image supprimée."},
            status=status.HTTP_200_OK
        )

    # PATCH
    serializer = GalleryImageSerializer(
        gallery_image,
        data=_strip_image_fields(request.data),
        partial=True,
        context={"request": request}
    )
    if not serializer.is_valid():
        return Response(
            {"success": False, "message": "Erreur de validation", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    updated = serializer.save()

    image_file = _decode_base64_image(request.data.get('image'))
    if image_file:
        updated.image.save(image_file.name, image_file, save=True)

    return Response(
        {
            "success": True,
            "message": "Image mise à jour.",
            "data": GalleryImageSerializer(updated, context={"request": request}).data
        },
        status=status.HTTP_200_OK
    )


# ==================== ADMIN : MESSAGES (PROTÉGÉ) ====================

@api_view(['PATCH', 'DELETE'])
@permission_classes([AllowAny])
def admin_message_detail(request, pk):
    """
    PATCH  : marquer lu/traite, enregistrer des notes internes.
    DELETE : supprimer le message.
    ENDPOINT PROTÉGÉ par token admin signé.
    """
    if not _validate_admin_token(request):
        return _admin_unauthorized()

    message_instance = get_object_or_404(ContactMessage, pk=pk)

    if request.method == 'DELETE':
        message_instance.delete()
        logger.info("Message de contact supprimé : id=%s", pk)
        return Response(
            {"success": True, "message": "Message supprimé."},
            status=status.HTTP_200_OK
        )

    # PATCH - champs autorisés explicitement
    if 'lu' in request.data:
        message_instance.lu = bool(request.data['lu'])
    if 'traite' in request.data:
        message_instance.traite = bool(request.data['traite'])
    if 'notes' in request.data:
        notes = str(request.data['notes'] or '').strip()
        message_instance.notes = notes[:5000] if notes else None

    message_instance.save()

    return Response(
        {
            "success": True,
            "message": "Message mis à jour.",
            "data": ContactMessageSerializer(message_instance).data
        },
        status=status.HTTP_200_OK
    )


# ==================== HEALTH CHECK ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response(
        {
            "status": "ok",
            "message": "API EMD opérationnelle",
            "version": "2.1.0",
            "features": ["contact", "gallery", "news"]
        },
        status=status.HTTP_200_OK
    )
