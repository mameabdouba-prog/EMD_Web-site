"""
URL configuration for emd_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from core import views

urlpatterns = [
    # Routes d'accès direct pour la connexion admin API (évite le conflit avec Django admin)
    path('admin/login/', views.admin_login, name='root-admin-login-slash'),
    path('admin/login', views.admin_login, name='root-admin-login-noslash'),
    path('admin/admin/login/', views.admin_login, name='root-admin-admin-login-slash'),
    path('admin/admin/login', views.admin_login, name='root-admin-admin-login-noslash'),
    path('api/admin/login/', views.admin_login, name='root-api-admin-login-slash'),
    path('api/admin/login', views.admin_login, name='root-api-admin-login-noslash'),

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