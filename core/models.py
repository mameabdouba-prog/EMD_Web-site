"""
Modèles de données pour l'application EMD
Groupe Scolaire El Hadji Malick Dieye
"""

from django.db import models
from django.core.validators import EmailValidator
from django.utils.text import slugify
from django.utils import timezone


class ContactMessage(models.Model):
    """
    Modèle pour stocker les messages de contact reçus via le formulaire du site web.
    """
    
    nom = models.CharField(
        max_length=200,
        verbose_name="Nom complet",
        help_text="Nom et prénom de la personne"
    )
    
    email = models.EmailField(
        validators=[EmailValidator()],
        verbose_name="Adresse email",
        help_text="Email de contact pour la réponse"
    )
    
    message = models.TextField(
        verbose_name="Message",
        help_text="Contenu du message envoyé"
    )
    
    date = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de réception",
        help_text="Date et heure de réception du message"
    )
    
    lu = models.BooleanField(
        default=False,
        verbose_name="Message lu",
        help_text="Indique si le message a été lu par l'administrateur"
    )
    
    traite = models.BooleanField(
        default=False,
        verbose_name="Message traité",
        help_text="Indique si le message a été traité/répondu"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Notes internes",
        help_text="Notes pour l'équipe administrative"
    )

    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ['-date']
        indexes = [
            models.Index(fields=['-date']),
            models.Index(fields=['lu']),
        ]

    def __str__(self):
        return f"{self.nom} - {self.email} ({self.date.strftime('%d/%m/%Y %H:%M')})"


class GalleryImage(models.Model):
    """
    Modèle pour stocker les images de la galerie
    Photos des activités, événements et infrastructures de l'école
    """
    
    CYCLE_CHOICES = [
        ('prescolaire', 'Préscolaire'),
        ('elementaire', 'Élémentaire'),
        ('secondaire', 'Secondaire'),
        ('general', 'Général'),
        ('evenement', 'Événement'),
        ('infrastructure', 'Infrastructure'),
    ]
    
    title = models.CharField(
        max_length=200,
        verbose_name="Titre",
        help_text="Titre descriptif de l'image"
    )
    
    description = models.TextField(
        blank=True,
        verbose_name="Description",
        help_text="Description détaillée de l'image"
    )
    
    image = models.ImageField(
        upload_to='gallery/%Y/%m/',
        verbose_name="Image",
        help_text="Image de la galerie (JPG, PNG)"
    )
    
    cycle = models.CharField(
        max_length=50,
        choices=CYCLE_CHOICES,
        default='general',
        verbose_name="Catégorie",
        help_text="Catégorie de l'image"
    )
    
    date_uploaded = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'ajout",
        help_text="Date d'ajout de l'image"
    )
    
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Image mise en avant",
        help_text="Afficher cette image en priorité"
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
        help_text="Afficher cette image dans la galerie"
    )
    
    order = models.IntegerField(
        default=0,
        verbose_name="Ordre d'affichage",
        help_text="Ordre d'affichage (plus petit = en premier)"
    )

    class Meta:
        verbose_name = "Image de galerie"
        verbose_name_plural = "Images de galerie"
        ordering = ['order', '-date_uploaded']
        indexes = [
            models.Index(fields=['cycle', '-date_uploaded']),
            models.Index(fields=['is_active', 'is_featured']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_cycle_display()})"


class NewsImage(models.Model):
    """
    Image supplémentaire liée à un article d'actualité.
    Chaque article peut contenir jusqu'à 5 images (1 principale + 4 supplémentaires).
    """

    article = models.ForeignKey(
        'NewsArticle',
        on_delete=models.CASCADE,
        related_name='additional_images',
        verbose_name="Article"
    )

    image = models.ImageField(
        upload_to='news/%Y/%m/',
        verbose_name="Image",
        help_text="Image supplémentaire de l'article"
    )

    caption = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Légende",
        help_text="Légende facultative de l'image"
    )

    order = models.IntegerField(
        default=0,
        verbose_name="Ordre d'affichage",
        help_text="Ordre d'affichage (plus petit = en premier)"
    )

    class Meta:
        verbose_name = "Image d'article"
        verbose_name_plural = "Images d'articles"
        ordering = ['order', 'id']

    def __str__(self):
        return f"Image de « {self.article.title} »"


class NewsArticle(models.Model):
    """
    Modèle pour stocker les articles d'actualités de l'école
    Événements, annonces, réussites des élèves, etc.
    """
    
    CATEGORY_CHOICES = [
        ('annonce', 'Annonce'),
        ('evenement', 'Événement'),
        ('reussite', 'Réussite'),
        ('activite', 'Activité'),
        ('information', 'Information'),
    ]
    
    title = models.CharField(
        max_length=200,
        verbose_name="Titre",
        help_text="Titre de l'article"
    )
    
    slug = models.SlugField(
        max_length=250,
        unique=True,
        blank=True,
        verbose_name="Slug",
        help_text="URL de l'article (généré automatiquement)"
    )
    
    excerpt = models.TextField(
        max_length=300,
        verbose_name="Résumé",
        help_text="Résumé court de l'article (300 caractères max)"
    )
    
    content = models.TextField(
        verbose_name="Contenu",
        help_text="Contenu complet de l'article"
    )
    
    image = models.ImageField(
        upload_to='news/%Y/%m/',
        blank=True,
        null=True,
        verbose_name="Image principale",
        help_text="Image d'illustration de l'article"
    )
    
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='information',
        verbose_name="Catégorie",
        help_text="Catégorie de l'article"
    )
    
    author = models.CharField(
        max_length=100,
        default="Administration EMD",
        verbose_name="Auteur",
        help_text="Auteur de l'article"
    )
    
    published_date = models.DateTimeField(
        default=timezone.now,
        verbose_name="Date de publication",
        help_text="Date et heure de publication"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Dernière modification"
    )
    
    is_published = models.BooleanField(
        default=True,
        verbose_name="Publié",
        help_text="Afficher cet article sur le site"
    )
    
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Article mis en avant",
        help_text="Afficher cet article en priorité"
    )
    
    views_count = models.IntegerField(
        default=0,
        verbose_name="Nombre de vues",
        help_text="Nombre de fois que l'article a été consulté"
    )

    class Meta:
        verbose_name = "Article d'actualité"
        verbose_name_plural = "Articles d'actualité"
        ordering = ['-published_date']
        indexes = [
            models.Index(fields=['-published_date']),
            models.Index(fields=['is_published', 'is_featured']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return f"{self.title} ({self.published_date.strftime('%d/%m/%Y')})"
    
    def save(self, *args, **kwargs):
        """Génère automatiquement le slug si non fourni"""
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while NewsArticle.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    def increment_views(self):
        """Incrémente le compteur de vues"""
        self.views_count += 1
        self.save(update_fields=['views_count'])


class PushSubscription(models.Model):
    """
    Abonnement Web Push d'un navigateur/utilisateur pour recevoir des
    notifications (ex : publication d'une nouvelle actualité).
    """

    endpoint = models.URLField(
        max_length=500,
        unique=True,
        verbose_name="Endpoint",
        help_text="URL d'abonnement renvoyée par le service push du navigateur"
    )

    p256dh = models.CharField(
        max_length=255,
        verbose_name="Clé p256dh",
        help_text="Clé publique de chiffrement renvoyée par le navigateur"
    )

    auth = models.CharField(
        max_length=255,
        verbose_name="Clé auth",
        help_text="Secret d'authentification renvoyé par le navigateur"
    )

    user_agent = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name="Navigateur",
        help_text="User-Agent du navigateur au moment de l'abonnement"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'abonnement"
    )

    last_error = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name="Dernière erreur",
        help_text="Dernière erreur d'envoi (utile pour repérer les abonnements expirés)"
    )

    class Meta:
        verbose_name = "Abonnement push"
        verbose_name_plural = "Abonnements push"
        ordering = ['-created_at']

    def __str__(self):
        return f"PushSubscription ({self.created_at.strftime('%d/%m/%Y %H:%M')})"