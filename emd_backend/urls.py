"""
URL configuration for emd_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from core import views

urlpatterns = [
    # Routes d'accès direct pour l'API admin (évite le conflit avec Django admin).
    # Certains bundles frontend déployés utilisent <host>/admin/... au lieu de
    # <host>/api/admin/... : ces alias garantissent que les deux fonctionnent.
    path('admin/login/', views.admin_login, name='root-admin-login-slash'),
    path('admin/login', views.admin_login, name='root-admin-login-noslash'),
    path('admin/admin/login/', views.admin_login, name='root-admin-admin-login-slash'),
    path('admin/admin/login', views.admin_login, name='root-admin-admin-login-noslash'),
    path('api/admin/login/', views.admin_login, name='root-api-admin-login-slash'),
    path('api/admin/login', views.admin_login, name='root-api-admin-login-noslash'),

    path('admin/contact/', views.create_contact_message, name='root-admin-contact-create'),
    path('admin/contact/list/', views.get_contact_messages, name='root-admin-contact-list'),
    path('admin/news/', views.admin_news, name='root-admin-news'),
    path('admin/news/<int:pk>/', views.admin_news_detail, name='root-admin-news-detail'),
    path('admin/gallery/', views.admin_gallery, name='root-admin-gallery'),
    path('admin/gallery/<int:pk>/', views.admin_gallery_detail, name='root-admin-gallery-detail'),
    path('admin/messages/', views.admin_messages, name='root-admin-messages'),
    path('admin/messages/<int:pk>/', views.admin_message_detail, name='root-admin-message-detail'),

    # Variantes "double préfixe" (admin/admin/...) : le bundle frontend actuellement
    # déployé est compilé avec baseURL <host>/admin ET des chemins déjà préfixés
    # /admin/... Ceux-ci tombaient dans Django admin (302 login / CSRF 403).
    path('admin/admin/news/', views.admin_news, name='root-admin-admin-news'),
    path('admin/admin/news/<int:pk>/', views.admin_news_detail, name='root-admin-admin-news-detail'),
    path('admin/admin/gallery/', views.admin_gallery, name='root-admin-admin-gallery'),
    path('admin/admin/gallery/<int:pk>/', views.admin_gallery_detail, name='root-admin-admin-gallery-detail'),
    path('admin/admin/messages/', views.admin_messages, name='root-admin-admin-messages'),
    path('admin/admin/messages/<int:pk>/', views.admin_message_detail, name='root-admin-admin-message-detail'),

    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]

# Servir les fichiers media et static en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Personnalisation de l'interface d'administration
admin.site.site_header = "Groupe Scolaire EMD - Administration"
admin.site.site_title = "EMD Admin Portal"
admin.site.index_title = "Bienvenue dans l'espace d'administration"