@echo off
title EMD - Serveur Backend (Django)
cd /d "%~dp0"
echo ============================================
echo   Groupe Scolaire EMD - API Django
echo   http://localhost:8000
echo   Laissez cette fenetre ouverte.
echo ============================================
python manage.py runserver 8000 --noreload
pause
