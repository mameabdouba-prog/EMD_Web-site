"""
Vues API pour l'application EMD
Gestion des endpoints REST
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.mail import EmailMessage
import logging

from .models import ContactMessage, GalleryImage, NewsArticle
from .serializers import (
    ContactMessageSerializer,
    GalleryImageSerializer,
    NewsArticleListSerializer,
    NewsArticleDetailSerializer
)

logger = logging.getLogger(__name__)

# ==================== CONTACT ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def create_contact_message(request):
    """
    Crée un message de contact
    + envoie un email à l'administrateur
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

    except Exception as e:
        logger.error(f"Erreur envoi email : {str(e)}")

        return Response(
            {
                "success": True,
                "message": (
                    "Message enregistré avec succès, "
                    "mais l'email n'a pas pu être envoyé."
                ),
                "mail_error": str(e),
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

# ==================== CONTACT (ADMIN) ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_contact_messages(request):
    """Récupérer les messages de contact"""

    messages = ContactMessage.objects.all().order_by('-date')

    lu_param = request.query_params.get('lu')
    if lu_param is not None:
        messages = messages.filter(lu=lu_param.lower() == 'true')

    limit_param = request.query_params.get('limit')
    if limit_param:
        messages = messages[:int(limit_param)]

    serializer = ContactMessageSerializer(messages, many=True)

    return Response(
        {
            "success": True,
            "count": messages.count(),
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
        images = images[:int(limit)]

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
            "count": images.count(),
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
        articles = articles[:int(limit)]

    serializer = NewsArticleListSerializer(
        articles,
        many=True,
        context={"request": request}
    )

    return Response(
        {
            "success": True,
            "count": articles.count(),
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

# ==================== HEALTH CHECK ====================

@api_view(['GET'])
def health_check(request):
    return Response(
        {
            "status": "ok",
            "message": "API EMD opérationnelle",
            "version": "2.0.0",
            "features": ["contact", "gallery", "news"]
        },
        status=status.HTTP_200_OK
    )
