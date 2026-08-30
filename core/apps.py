import os
from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    verbose_name = 'Gestion EMD'

    def ready(self):
        import core.signals
        # Provisionnement du superuser DÉSACTIVÉ par défaut.
        # Effectuer une requête DB à chaque démarrage de worker ralentit le boot
        # et réinitialise le mot de passe admin. Créer le superuser une seule fois
        # via `python manage.py create_admin` au déploiement, ou activer
        # explicitement le provisioning ici avec EMD_AUTO_SUPERUSER=1.
        if os.environ.get('EMD_AUTO_SUPERUSER') == '1':
            self.ensure_superuser()

    def ensure_superuser(self):
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            username = os.environ.get('ADMIN_USERNAME', 'admin')
            email = os.environ.get('ADMIN_EMAIL', 'admin@gs-emd.com')
            password = os.environ.get('ADMIN_PASSWORD', 'admin123')

            user = User.objects.filter(username=username).first()
            if user:
                user.set_password(password)
                user.is_superuser = True
                user.is_staff = True
                user.is_active = True
                user.save()
            else:
                User.objects.create_superuser(username=username, email=email, password=password)
        except Exception:
            # Ignorer si la base n'est pas encore migrée lors d'un command de management initial
            pass
