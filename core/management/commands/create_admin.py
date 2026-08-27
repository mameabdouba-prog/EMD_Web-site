"""
Commande Django pour créer automatiquement le superuser admin au déploiement.
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
    help = "Crée le superuser admin s'il n'existe pas déjà"

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.environ.get('ADMIN_USERNAME', 'admin')
        email    = os.environ.get('ADMIN_EMAIL', 'admin@gs-emd.com')
        password = os.environ.get('ADMIN_PASSWORD', 'admin123')

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f"Superuser '{username}' existe déjà — aucun changement.")
            )
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(
            self.style.SUCCESS(f"Superuser '{username}' créé avec succès.")
        )
