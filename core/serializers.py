"""
Serializers pour l'API REST
Gestion de la conversion entre JSON et modèles Django
"""

import base64
import uuid

from django.core.files.base import ContentFile

from rest_framework import serializers
from .models import ContactMessage, GalleryImage, NewsArticle, NewsImage


class Base64ImageField(serializers.ImageField):
    """
    Champ ImageField acceptant une data URL base64 (data:image/...).
    Utilisé par les endpoints admin pour la création/édition d'images.
    """

    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            try:
                header, b64 = data.split(',', 1)
                mime = header[5:header.find(';')]
                ext = {
                    'image/png': 'png',
                    'image/jpeg': 'jpg',
                    'image/webp': 'webp',
                    'image/gif': 'gif',
                }.get(mime, 'png')
                return ContentFile(base64.b64decode(b64), name=f'{uuid.uuid4().hex}.{ext}')
            except Exception:
                raise serializers.ValidationError(
                    "Image invalide : données base64 corrompues."
                )
        return super().to_internal_value(data)


class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle ContactMessage.
    """
    
    class Meta:
        model = ContactMessage
        fields = ['id', 'nom', 'email', 'message', 'date', 'lu', 'traite']
        read_only_fields = ['id', 'date', 'lu', 'traite']
    
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
    
    image = Base64ImageField(required=False, allow_null=True)
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


class NewsImageSerializer(serializers.ModelSerializer):
    """
    Serializer pour les images supplémentaires d'un article.
    """
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = NewsImage
        fields = ['id', 'image', 'image_url', 'caption', 'order']
        read_only_fields = ['id', 'image_url']

    def get_image_url(self, obj):
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
    additional_images = serializers.SerializerMethodField()
    
    class Meta:
        model = NewsArticle
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'image',
            'image_url',
            'additional_images',
            'category',
            'category_display',
            'author',
            'published_date',
            'is_featured',
            'views_count'
        ]
        read_only_fields = ['id', 'slug', 'published_date', 'views_count', 'image_url', 'additional_images']
    
    def get_image_url(self, obj):
        """Retourne l'URL complète de l'image"""
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_additional_images(self, obj):
        request = self.context.get('request')
        imgs = obj.additional_images.all()
        return NewsImageSerializer(imgs, many=True, context={"request": request}).data


class NewsArticleDetailSerializer(serializers.ModelSerializer):
    """
    Serializer pour le détail d'un article (version complète).
    Utilisé pour afficher un article complet.
    """
    
    image_url = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    additional_images = serializers.SerializerMethodField()
    
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
            'additional_images',
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
            'image_url',
            'additional_images'
        ]
    
    def get_image_url(self, obj):
        """Retourne l'URL complète de l'image"""
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_additional_images(self, obj):
        request = self.context.get('request')
        imgs = obj.additional_images.all()
        return NewsImageSerializer(imgs, many=True, context={"request": request}).data


class NewsArticleAdminSerializer(serializers.ModelSerializer):
    """
    Serializer complet pour l'administration des articles.
    Gère la création, la mise à jour et les toggles (publié, à la une).
    Accepte jusqu'à 4 images supplémentaires (base64) par article,
    en plus de l'image principale (soit 5 images au total).
    """

    image = Base64ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    additional_images = serializers.SerializerMethodField()
    additional_images_data = serializers.ListField(
        child=Base64ImageField(),
        required=False,
        write_only=True,
        allow_empty=True
    )
    remove_additional_images = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True,
        allow_empty=True
    )

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
            'additional_images',
            'additional_images_data',
            'remove_additional_images',
            'category',
            'category_display',
            'author',
            'published_date',
            'created_at',
            'updated_at',
            'is_published',
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
            'image_url',
            'additional_images',
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

    def get_additional_images(self, obj):
        request = self.context.get('request')
        imgs = obj.additional_images.all()
        return NewsImageSerializer(imgs, many=True, context={"request": request}).data

    def validate(self, attrs):
        data = attrs.get('additional_images_data') or []
        if len(data) > 4:
            raise serializers.ValidationError(
                {"additional_images_data": "Maximum 4 images supplémentaires par article (5 au total avec l'image principale)."}
            )
        return attrs

    def create(self, validated_data):
        additional = validated_data.pop('additional_images_data', [])
        remove_ids = validated_data.pop('remove_additional_images', [])
        article = super().create(validated_data)
        self._save_additional_images(article, additional)
        return article

    def update(self, instance, validated_data):
        additional = validated_data.pop('additional_images_data', [])
        remove_ids = validated_data.pop('remove_additional_images', [])
        instance = super().update(instance, validated_data)
        if remove_ids:
            instance.additional_images.filter(id__in=remove_ids).delete()
        self._save_additional_images(instance, additional)
        return instance

    def _save_additional_images(self, article, additional):
        existing_total = article.additional_images.count()
        remaining_slots = 4 - existing_total
        for i, img in enumerate(additional[:max(remaining_slots, 0)]):
            NewsImage.objects.create(
                article=article,
                image=img,
                order=existing_total + i
            )