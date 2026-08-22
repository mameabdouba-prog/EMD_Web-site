"""
Django settings for emd_backend project.
Tous les secrets sont lus depuis l'environnement ou le fichier .env
(jamais codés en dur dans le code source).
"""

from pathlib import Path
from decouple import config, Csv

# ===================== BASE =====================
BASE_DIR = Path(__file__).resolve().parent.parent

# Génère une clé aléatoire si absente (dev uniquement) :
#   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
SECRET_KEY = config(
    'SECRET_KEY',
    default='dev-only-insecure-key-do-not-use-in-production'
)

DEBUG = config('DEBUG', default=False, cast=bool)

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
]

# ===================== MIDDLEWARE =====================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

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
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
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

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===================== CORS =====================
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173',
    cast=Csv()
)

# Pas de cookies cross-origin nécessaires : on désactive les credentials CORS.
CORS_ALLOW_CREDENTIALS = False

# ===================== DRF =====================
REST_FRAMEWORK = {
    # Par défaut : tout est protégé. Les endpoints publics sont annotés
    # explicitement avec @permission_classes([AllowAny]).
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        # Limite globale pour les visiteurs anonymes
        'anon': '120/hour',
        # Limite stricte pour le formulaire de contact (anti-spam)
        'contact': '10/hour',
        # Limite sur les tentatives de connexion admin (anti brute-force)
        'admin_login': '10/hour',
    },
}

# ===================== SÉCURITÉ HTTP =====================
# En-têtes appliqués même en développement ; renforcés derrière HTTPS.
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
X_FRAME_OPTIONS = 'DENY'

SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

if not DEBUG:
    # Ces réglages supposent un déploiement derrière HTTPS / reverse proxy.
    SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = config('SECURE_HSTS_SECONDS', default=31536000, cast=int)
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

# ===================== ADMIN API (dashboard React) =====================
# Identifiant du compte administrateur de l'API.
ADMIN_API_USERNAME = config('ADMIN_API_USERNAME', default='admin')
# Hash PBKDF2 du mot de passe admin (générer via :
#   python manage.py shell -c "from django.contrib.auth.hashers import make_password; print(make_password('VOTRE_MOT_DE_PASSE'))"
# ). Si vide, la connexion admin est désactivée.
ADMIN_API_PASSWORD_HASH = config('ADMIN_API_PASSWORD_HASH', default='')
# Durée de validité du token admin émis (en secondes).
ADMIN_TOKEN_MAX_AGE = config('ADMIN_TOKEN_MAX_AGE', default=3600 * 8, cast=int)

# ===================== EMAIL (SMTP) =====================
EMAIL_BACKEND = config(
    'EMAIL_BACKEND',
    default='django.core.mail.backends.smtp.EmailBackend'
)

EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)

EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')

DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='Site EMD <no-reply@emd.sn>')

# Email qui reçoit les messages du formulaire
EMAIL_RECEIVER = config('EMAIL_RECEIVER', default='dabakhba08@gmail.com')

EMAIL_FAIL_SILENTLY = False
