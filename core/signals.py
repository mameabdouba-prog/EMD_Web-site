from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import GalleryImage

@receiver(post_save, sender=GalleryImage)
def activate_gallery_image(sender, instance, created, **kwargs):
    """
    Quand une image est ajoutée ou modifiée dans l'admin :
    - active par défaut si elle n'était pas active
    - peut appliquer d'autres règles si nécessaire
    """
    if created and not instance.is_active:
        instance.is_active = True
        instance.save(update_fields=['is_active'])
