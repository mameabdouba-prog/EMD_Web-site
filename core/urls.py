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
    
    # ==================== ADMIN ====================
    path('admin/login/', views.admin_login, name='admin-login'),
    path('admin/login', views.admin_login, name='admin-login-noslash'),
    path('admin/news/', views.admin_news, name='admin-news'),
    path('admin/news/<int:pk>/', views.admin_news_detail, name='admin-news-detail'),
    path('admin/gallery/', views.admin_gallery, name='admin-gallery'),
    path('admin/gallery/batch/', views.admin_gallery_batch, name='admin-gallery-batch'),
    path('admin/gallery/<int:pk>/', views.admin_gallery_detail, name='admin-gallery-detail'),
    path('admin/messages/', views.admin_messages, name='admin-messages'),
    path('admin/messages/<int:pk>/', views.admin_message_detail, name='admin-message-detail'),
    
    # ==================== WEB PUSH ====================
    path('push/subscribe/', views.push_subscribe, name='push-subscribe'),
    path('push/unsubscribe/', views.push_unsubscribe, name='push-unsubscribe'),
    path('admin/push/test/', views.push_test, name='push-test'),
    
    # ==================== HEALTH CHECK ====================
    path('health/', views.health_check, name='health-check'),
]