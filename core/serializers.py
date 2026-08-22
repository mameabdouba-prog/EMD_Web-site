"""
Serializers pour l'API REST
Gestion de la conversion entre JSON et modèles Django
"""

from rest_framework import serializers
from .models import ContactMessage, GalleryImage, NewsArticle


class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle ContactMessage.
    """
    
    class Meta:
        model = ContactMessage
        fields = ['id', 'nom', 'email', 'message', 'date', 'lu', 'traite', 'notes']
        read_only_fields = ['id', 'date']
    
    def validate_nom(self, value):
        """Validation du champ nom"""
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError(
                "Le nom doit contenir au moins 2 caractères."
            )
        if not value.replace(' ', '').isalpha():
            raise serializers.ValidationError(
                "Le nom ne doit contenir que des lettres et des espaces."
            )
        return value
    
    def validate_email(self, value):
        """Validation du champ email"""
        return value.lower().strip()
    
    def validate_message(self, value):
        """Validation du champ message"""
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError(
                "Le message doit contenir au moins 10 caractères."
            )
        if len(value) > 5000:
            raise serializers.ValidationError(
                "Le message ne peut pas dépasser 5000 caractères."
            )
        return value


class GalleryImageSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle GalleryImage.
    Gère les images de la galerie avec leurs métadonnées.
    """
    
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField()
    cycle_display = serializers.CharField(source='get_cycle_display', read_only=True)
    
    class Meta:
        model = GalleryImage
        fields = [
            'id',
            'title',
            'description',
            'image',
            'image_url',
            'cycle',
            'cycle_display',
            'date_uploaded',
            'is_featured',
            'is_active',
            'order'
        ]
        read_only_fields = ['id', 'date_uploaded', 'image_url', 'cycle_display']
    
    def get_image_url(self, obj):
        """Retourne l'URL complète de l'image"""
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class NewsArticleListSerializer(serializers.ModelSerializer):
    """
    Serializer pour la liste des articles (version courte).
    Utilisé pour afficher la liste des actualités.
    """
    
    image_url = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = NewsArticle
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'image',
            'image_url',
            'category',
            'category_display',
            'author',
            'published_date',
            'is_featured',
            'views_count'
        ]
        read_only_fields = ['id', 'slug', 'published_date', 'views_count', 'image_url']
    
    def get_image_url(self, obj):
        """Retourne l'URL complète de l'image"""
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class NewsArticleDetailSerializer(serializers.ModelSerializer):
    """
    Serializer pour le détail d'un article (version complète).
    Utilisé pour afficher un article complet.
    """
    image_url = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = NewsArticle
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'content',
            'image',
            'image_url',
            'category',
            'category_display',
            'author',
            'published_date',
            'created_at',
            'updated_at',
            'is_featured',
            'views_count'
        ]
        read_only_fields = [
            'id', 
            'slug', 
            'published_date', 
            'created_at', 
            'updated_at', 
            'views_count',
            'image_url'
        ]
    
    def get_image_url(self, obj):
        """Retourne l'URL complète de l'image"""
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class AdminNewsArticleSerializer(serializers.ModelSerializer):
    """
    Serializer complet pour le dashboard admin :
    inclut les articles non publiés et le champ is_published.
    """

    image_url = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = NewsArticle
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'content',
            'image',
            'image_url',
            'category',
            'category_display',
            'author',
            'published_date',
            'is_published',
            'is_featured',
            'views_count'
        ]
        read_only_fields = [
            'id',
            'slug',
            'published_date',
            'views_count',
            'image_url',
            'category_display'
        ]

    def get_image_url(self, obj):
        """Retourne l'URL complète de l'image"""
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def validate_title(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError(
                "Le titre doit contenir au moins 3 caractères."
            )
        return value

    def validate_excerpt(self, value):
        value = value.strip()
        if len(value) > 300:
            raise serializers.ValidationError(
                "Le résumé ne peut pas dépasser 300 caractères."
            )
        return value