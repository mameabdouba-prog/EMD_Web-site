#!/usr/bin/env bash
# Script de build pour Render

set -o errexit  # Arrête le script si une commande échoue

pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Crée le superuser admin s'il n'existe pas déjà
python manage.py create_admin
