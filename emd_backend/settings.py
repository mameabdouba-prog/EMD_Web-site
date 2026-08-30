"""
Django settings for emd_backend project.
Production: Render + PostgreSQL + Cloudinary
Frontend: Vercel
"""

from pathlib import Path
import dj_database_url
from decouple import config, Csv


# ============================================================
# BASE
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config(
    "SECRET_KEY",
    default="django-insecure-change-this-in-production"
)

DEBUG = config(
    "DJANGO_DEBUG",
    default=False,
    cast=bool
)

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default="localhost,127.0.0.1,gs-emd.onrender.com",
    cast=Csv()
)


# ============================================================
# APPLICATIONS
# ============================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Application
    "core.apps.CoreConfig",

    # Third-party
    "rest_framework",
    "corsheaders",

    # Cloudinary
    "cloudinary_storage",
    "cloudinary",
]


# ============================================================
# MIDDLEWARE
# ============================================================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",

    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ============================================================
# URL / WSGI
# ============================================================

ROOT_URLCONF = "emd_backend.urls"

WSGI_APPLICATION = "emd_backend.wsgi.application"


# ============================================================
# TEMPLATES
# ============================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ============================================================
# DATABASE
# ============================================================

DATABASE_URL = config(
    "DATABASE_URL",
    default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
)

DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=600
    )
}


# ============================================================
# PASSWORD VALIDATION
# ============================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
        "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.MinimumLengthValidator"
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.CommonPasswordValidator"
    },
    {
        "NAME":
        "django.contrib.auth.password_validation.NumericPasswordValidator"
    },
]


# ============================================================
# INTERNATIONALIZATION
# ============================================================

LANGUAGE_CODE = "fr-fr"

TIME_ZONE = "Africa/Dakar"

USE_I18N = True

USE_TZ = True


# ============================================================
# STATIC FILES
# ============================================================

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"


# ============================================================
# MEDIA FILES
# ============================================================

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"


# ============================================================
# DEFAULT PRIMARY KEY
# ============================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ============================================================
# CLOUDINARY
# ============================================================

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": config(
        "CLOUDINARY_CLOUD_NAME",
        default=""
    ),

    "API_KEY": config(
        "CLOUDINARY_API_KEY",
        default=""
    ),

    "API_SECRET": config(
        "CLOUDINARY_API_SECRET",
        default=""
    ),
}


# ============================================================
# DJANGO STORAGE
# ============================================================

STORAGES = {
    "default": {
        "BACKEND":
        "cloudinary_storage.storage.MediaCloudinaryStorage",
    },

    "staticfiles": {
        "BACKEND":
        "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


# ============================================================
# CORS
# ============================================================

CORS_ALLOWED_ORIGINS = [
    "https://gs-emd.com",
    "https://www.gs-emd.com",
]

# Développement local
if DEBUG:
    CORS_ALLOWED_ORIGINS += [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]


# ============================================================
# CSRF
# ============================================================

CSRF_TRUSTED_ORIGINS = [
    "https://gs-emd.com",
    "https://www.gs-emd.com",
]

if DEBUG:
    CSRF_TRUSTED_ORIGINS += [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]


# ============================================================
# DJANGO REST FRAMEWORK
# ============================================================

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],

    "DEFAULT_AUTHENTICATION_CLASSES": [],
}


# ============================================================
# EMAIL - GMAIL SMTP
# ============================================================

EMAIL_BACKEND = config(
    "EMAIL_BACKEND",
    default="core.mail_backend.InsecureSMTPSSLEmailBackend"
)

EMAIL_HOST = config(
    "EMAIL_HOST",
    default="mail.gs-emd.com"
)

EMAIL_PORT = config(
    "EMAIL_PORT",
    default=465,
    cast=int
)

EMAIL_USE_TLS = config(
    "EMAIL_USE_TLS",
    default=False,
    cast=bool
)

EMAIL_USE_SSL = config(
    "EMAIL_USE_SSL",
    default=True,
    cast=bool
)

EMAIL_HOST_USER = config(
    "EMAIL_HOST_USER",
    default=""
)

EMAIL_HOST_PASSWORD = config(
    "EMAIL_HOST_PASSWORD",
    default=""
)

DEFAULT_FROM_EMAIL = (
    f"Site EMD <{config('EMAIL_HOST_USER', default='')}>"
)

EMAIL_RECEIVER = config(
    "EMAIL_RECEIVER",
    default=""
)

EMAIL_FAIL_SILENTLY = False


# ============================================================
# WEB PUSH NOTIFICATIONS (VAPID)
# ============================================================

VAPID_PUBLIC_KEY = config(
    "VAPID_PUBLIC_KEY",
    default=""
)

VAPID_PRIVATE_KEY = config(
    "VAPID_PRIVATE_KEY",
    default=""
)

VAPID_ADMIN_EMAIL = config(
    "VAPID_ADMIN_EMAIL",
    default="contact@gs-emd.com"
)


# ============================================================
# ADMIN API AUTHENTICATION
# ============================================================

ADMIN_API_USERNAME = config(
    "ADMIN_API_USERNAME",
    default="admin"
)

ADMIN_PASSWORD = config(
    "ADMIN_PASSWORD",
    default=""
)

ADMIN_API_PASSWORD_HASH = config(
    "ADMIN_API_PASSWORD_HASH",
    default=""
)

ADMIN_TOKEN_MAX_AGE = config(
    "ADMIN_TOKEN_MAX_AGE",
    default=28800,
    cast=int
)


# ============================================================
# PRODUCTION SECURITY
# ============================================================

if not DEBUG:

    SECURE_PROXY_SSL_HEADER = (
        "HTTP_X_FORWARDED_PROTO",
        "https"
    )

    SECURE_SSL_REDIRECT = False

    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SECURE = True