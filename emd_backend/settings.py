"""
Django settings for emd_backend project.
Configured for local dev (SQLite) and Render production (PostgreSQL).
"""

from pathlib import Path
import os
import dj_database_url
from decouple import config, Csv

# ===================== BASE =====================
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-this-in-production')

DEBUG = config('DJANGO_DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

# ===================== APPS =====================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core.apps.CoreConfig',

    # Third-party
    'rest_framework',
    'corsheaders',
    'cloudinary_storage',
    'cloudinary',
]

# ===================== MIDDLEWARE =====================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Whitenoise pour les fichiers statiques
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ===================== URL / WSGI =====================
ROOT_URLCONF = 'emd_backend.urls'
WSGI_APPLICATION = 'emd_backend.wsgi.application'

# ===================== TEMPLATES =====================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ===================== DATABASE =====================
# En local : utilise .env avec DATABASE_URL=sqlite:///db.sqlite3
# Sur Render : utilise l'URL PostgreSQL fournie automatiquement
DATABASE_URL = config('DATABASE_URL', default=f'sqlite:///{BASE_DIR}/db.sqlite3')

DATABASES = {
    'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)
}

# ===================== PASSWORD VALIDATION =====================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ===================== I18N =====================
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Dakar'
USE_I18N = True
USE_TZ = True

# ===================== STATIC / MEDIA =====================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===================== CLOUDINARY =====================
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME', default=''),
    'API_KEY': config('CLOUDINARY_API_KEY', default=''),
    'API_SECRET': config('CLOUDINARY_API_SECRET', default=''),
}

# Utiliser Cloudinary pour stocker les fichiers médias (images)
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# ===================== CORS =====================
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='https://www.gs-emd.com,https://gs-emd.com,https://emd-frontend.pages.dev,http://localhost:5173,http://localhost:3000,http://localhost:8000',
    cast=Csv()
)

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# ===================== DRF =====================
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

# ===================== EMAIL (GMAIL SMTP) =====================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = f'Site EMD <{config("EMAIL_HOST_USER", default="")}>'
EMAIL_RECEIVER = config('EMAIL_RECEIVER', default='')
EMAIL_FAIL_SILENTLY = False

# ===================== ADMIN API AUTHENTICATION =====================
# Identifiants pour le dashboard admin
# Générer le hash du mot de passe :
#   python manage.py shell -c "from django.contrib.auth.hashers import make_password; print(make_password('MOT_DE_PASSE'))"
ADMIN_API_USERNAME = config('ADMIN_API_USERNAME', default='admin')
ADMIN_PASSWORD = config('ADMIN_PASSWORD', default='admin123')
ADMIN_API_PASSWORD_HASH = config('ADMIN_API_PASSWORD_HASH', default='pbkdf2_sha256$720000$DZ8KqGHmg1gJ$l3RhQBd52D8Z8X/Y8l3RhQBd52D8Z8X/Y8l3RhQBd52D8=')  # "admin" par défaut
ADMIN_TOKEN_MAX_AGE = config('ADMIN_TOKEN_MAX_AGE', default=28800, cast=int)  # 8 heures

# ===================== SÉCURITÉ PRODUCTION =====================
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = False  # Désactivé car SSL est géré en amont par le proxy Render (évite les 301 sur preflight OPTIONS)
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
