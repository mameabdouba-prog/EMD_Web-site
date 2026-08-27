"""
Commande Django pour créer ou réinitialiser le superuser admin au déploiement.
Usage: python manage.py create_admin
Variables d'environnement lues:
  ADMIN_USERNAME  (défaut: admin)
  ADMIN_EMAIL     (défaut: admin@gs-emd.com)
  ADMIN_PASSWORD  (défaut: admin123)
"""

import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Crée ou réinitialise le mot de passe du superuser admin"

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.environ.get('ADMIN_USERNAME', 'admin')
        email    = os.environ.get('ADMIN_EMAIL', 'admin@gs-emd.com')
        password = os.environ.get('ADMIN_PASSWORD', 'admin123')

        user = User.objects.filter(username=username).first()
        if user:
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f"Superuser '{username}' mis à jour avec le nouveau mot de passe.")
            )
        else:
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(
                self.style.SUCCESS(f"Superuser '{username}' créé avec succès.")
            )
