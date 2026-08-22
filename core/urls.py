"""
URLs de l'application core
Configuration des routes API
"""

from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    # ==================== ADMIN AUTH ====================
    path('admin/login/', views.admin_login, name='admin-login'),

    # ==================== ADMIN CRUD (token requis) ====================
    path('admin/news/', views.admin_news, name='admin-news'),
    path('admin/news/<int:pk>/', views.admin_news_detail, name='admin-news-detail'),
    path('admin/gallery/', views.admin_gallery, name='admin-gallery'),
    path('admin/gallery/<int:pk>/', views.admin_gallery_detail, name='admin-gallery-detail'),
    path('admin/messages/<int:pk>/', views.admin_message_detail, name='admin-message-detail'),

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