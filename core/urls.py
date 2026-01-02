"""
URLs de l'application core
Configuration des routes API
"""

from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    # ==================== CONTACT ====================
    path('contact/', views.create_contact_message, name='contact-create'),
    path('contact/list/', views.get_contact_messages, name='contact-list'),
    
    # ==================== GALERIE ====================
    path('gallery/', views.gallery_list, name='gallery-list'),
    path('gallery/<int:pk>/', views.gallery_detail, name='gallery-detail'),
    
    # ==================== ACTUALITÉS ====================
    path('news/', views.news_list, name='news-list'),
    path('news/<slug:slug>/', views.news_detail, name='news-detail'),
    
    # ==================== HEALTH CHECK ====================
    path('health/', views.health_check, name='health-check'),
]