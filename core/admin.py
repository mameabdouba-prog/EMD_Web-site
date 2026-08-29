"""
Configuration de l'interface d'administration Django
pour l'application EMD
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import ContactMessage, GalleryImage, NewsArticle, NewsImage

# ==================== CONTACT MESSAGE ====================

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """Administration pour ContactMessage"""
    
    list_display = [
        'id', 'nom', 'email', 'apercu_message_admin',
        'date_formattee', 'statut_lu', 'statut_traite'
    ]
    
    list_filter = ['lu', 'traite', 'date']
    search_fields = ['nom', 'email', 'message']
    readonly_fields = ['date', 'date_formattee']
    date_hierarchy = 'date'
    list_per_page = 25
    ordering = ['-date']
    
    actions = ['marquer_comme_lu', 'marquer_comme_non_lu', 'marquer_comme_traite']
    
    fieldsets = (
        ('Informations du contact', {'fields': ('nom', 'email')}),
        ('Message', {'fields': ('message',), 'classes': ('wide',)}),
        ('Statut et suivi', {'fields': ('lu', 'traite', 'notes'), 'classes': ('wide',)}),
        ('Informations système', {'fields': ('date', 'date_formattee'), 'classes': ('collapse',)}),
    )
    
    def apercu_message_admin(self, obj):
        return obj.message[:80] + '...' if len(obj.message) > 80 else obj.message
    apercu_message_admin.short_description = 'Aperçu du message'
    
    def date_formattee(self, obj):
        return obj.date.strftime('%d/%m/%Y à %H:%M')
    date_formattee.short_description = 'Date de réception'
    
    def statut_lu(self, obj):
        color = '#28a745' if obj.lu else '#dc3545'
        text = '✓ Lu' if obj.lu else '✗ Non lu'
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, text
        )
    statut_lu.short_description = 'Statut lecture'
    
    def statut_traite(self, obj):
        if obj.traite:
            return format_html('<span style="background-color: #007bff; color: white; padding: 3px 10px; border-radius: 3px;">✓ Traité</span>')
        return format_html('<span style="background-color: #ffc107; color: #000; padding: 3px 10px; border-radius: 3px;">⏳ En attente</span>')
    statut_traite.short_description = 'Statut traitement'
    
    def marquer_comme_lu(self, request, queryset):
        updated = queryset.update(lu=True)
        self.message_user(request, f'{updated} message(s) marqué(s) comme lu(s).')
    marquer_comme_lu.short_description = "✓ Marquer comme lu"
    
    def marquer_comme_non_lu(self, request, queryset):
        updated = queryset.update(lu=False)
        self.message_user(request, f'{updated} message(s) marqué(s) comme non lu(s).')
    marquer_comme_non_lu.short_description = "✗ Marquer comme non lu"
    
    def marquer_comme_traite(self, request, queryset):
        updated = queryset.update(traite=True, lu=True)
        self.message_user(request, f'{updated} message(s) marqué(s) comme traité(s).')
    marquer_comme_traite.short_description = "✓ Marquer comme traité"


# ==================== GALLERY IMAGE ====================

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    """Administration pour GalleryImage"""
    
    list_display = [
        'id', 'image_preview', 'title', 'cycle',
        'is_featured', 'is_active', 'order', 'date_uploaded'
    ]
    
    list_filter = ['cycle', 'is_featured', 'is_active', 'date_uploaded']
    search_fields = ['title', 'description']
    readonly_fields = ['date_uploaded', 'image_preview_large']
    date_hierarchy = 'date_uploaded'
    list_per_page = 20
    ordering = ['order', '-date_uploaded']
    
    list_editable = ['is_featured', 'is_active', 'order']
    
    actions = ['marquer_featured', 'retirer_featured', 'activer', 'desactiver']
    
    fieldsets = (
        ('Informations principales', {'fields': ('title', 'description', 'cycle')}),
        ('Image', {'fields': ('image', 'image_preview_large'), 'classes': ('wide',)}),
        ('Paramètres d\'affichage', {'fields': ('is_featured', 'is_active', 'order')}),
        ('Métadonnées', {'fields': ('date_uploaded',), 'classes': ('collapse',)}),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 150px; height: auto; object-fit: contain; border-radius: 5px;" />', obj.image.url)
        return "Pas d'image"
    image_preview.short_description = 'Aperçu'
    
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 600px; height: auto; object-fit: contain; border-radius: 5px;" />', obj.image.url)
        return "Pas d'image"
    image_preview_large.short_description = 'Aperçu de l\'image'
    
    def marquer_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} image(s) marquée(s) comme mise(s) en avant.')
    marquer_featured.short_description = "★ Marquer comme mis en avant"
    
    def retirer_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} image(s) retirée(s) de la mise en avant.')
    retirer_featured.short_description = "Retirer la mise en avant"
    
    def activer(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} image(s) activée(s).')
    activer.short_description = "✓ Activer"
    
    def desactiver(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} image(s) désactivée(s).')
    desactiver.short_description = "✗ Désactiver"


# ==================== NEWS ARTICLE ====================
class NewsImageInline(admin.TabularInline):
    """Images supplémentaires d'un article."""
    model = NewsImage
    extra = 0
    fields = ['image', 'caption', 'order']
    readonly_fields = []


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    """Administration pour NewsArticle"""

    inlines = [NewsImageInline]

    list_display = [
        'id', 'image_preview', 'title', 'category',
        'author', 'is_published', 'is_featured', 'published_date', 'views_count', 'apercu_content'
    ]

    list_filter = ['category', 'is_published', 'is_featured', 'published_date']
    search_fields = ['title', 'content', 'author']
    readonly_fields = ['created_at', 'updated_at', 'views_count', 'image_preview_large']
    date_hierarchy = 'published_date'
    list_per_page = 20
    ordering = ['-published_date']

    prepopulated_fields = {'slug': ('title',)}

    actions = ['publier', 'depublier', 'marquer_featured', 'retirer_featured']

    fieldsets = (
        ('Contenu principal', {'fields': ('title', 'slug', 'category', 'author')}),
        ('Contenu', {'fields': ('content',), 'classes': ('wide',)}),
        ('Image', {'fields': ('image', 'image_preview_large')}),
        ('Paramètres de publication', {'fields': ('is_published', 'is_featured', 'published_date')}),
        ('Statistiques et métadonnées', {'fields': ('views_count', 'created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

    # Aperçu du contenu pour éviter que list_display s'étire
    def apercu_content(self, obj):
        if obj.content:
            return obj.content[:75] + '...' if len(obj.content) > 75 else obj.content
        return ""
    apercu_content.short_description = 'Contenu'

    # Aperçu de l'image dans list_display
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 100px; height: auto; object-fit: contain; border-radius: 5px;" />',
                obj.image.url
            )
        return "Pas d'image"
    image_preview.short_description = 'Aperçu'

    # Aperçu de l'image en grand dans le formulaire
    def image_preview_large(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 300px; border-radius: 5px;" />',
                obj.image.url
            )
        return "Pas d'image"
    image_preview_large.short_description = 'Aperçu de l\'image'

    def publier(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f'{updated} article(s) publié(s).')
    publier.short_description = "✓ Publier"

    def depublier(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f'{updated} article(s) dépublié(s).')
    depublier.short_description = "✗ Dépublier"

    def marquer_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} article(s) marqué(s) comme mis en avant.')
    marquer_featured.short_description = "★ Marquer comme mis en avant"

    def retirer_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} article(s) retiré(s) de la mise en avant.')
    retirer_featured.short_description = "Retirer la mise en avant"



# ==================== PERSONNALISATION DU SITE ADMIN ====================

admin.site.site_header = "Groupe Scolaire EMD - Administration"
admin.site.site_title = "Administration EMD"
admin.site.index_title = "Tableau de bord"
