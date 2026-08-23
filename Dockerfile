# ── Backend EMD ── Django + Gunicorn ───────────────────────────────────────
FROM python:3.12-slim

# Empêche Python de créer des .pyc et active les logs en temps réel
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Dépendances système minimales (pour psycopg2-binary)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Installer les dépendances Python en premier (cache Docker optimisé)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p staticfiles media

# Collecter les fichiers statiques (WhiteNoise les servira)
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Lancer Gunicorn (module wsgi du projet emd_backend)
CMD ["gunicorn", "emd_backend.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--timeout", "120"]
