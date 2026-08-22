# -*- coding: utf-8 -*-
"""
Initialisation de la base avec le contenu du site.
Usage : python manage.py shell -c "exec(open('seed_data.py', encoding='utf-8').read())"
"""
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from django.core.files import File
from django.conf import settings
from core.models import NewsArticle, GalleryImage

ASSETS = Path(settings.BASE_DIR) / 'src' / 'assets'
MEDIA_NEWS = Path(settings.MEDIA_ROOT) / 'seed' / 'news'
MEDIA_GAL = Path(settings.MEDIA_ROOT) / 'seed' / 'gallery'
MEDIA_NEWS.mkdir(parents=True, exist_ok=True)
MEDIA_GAL.mkdir(parents=True, exist_ok=True)

def copy_asset(name, dest_dir):
    src = ASSETS / name
    if not src.exists():
        return None
    dest = dest_dir / name
    shutil.copy2(src, dest)
    return dest

# ---------- ACTUALITES ----------
news_items = [
    {
        'title': "Inscriptions 2026-2027 : les inscriptions sont ouvertes",
        'category': 'annonce',
        'featured': True,
        'image': 'general-1.jpeg',
        'excerpt': "Le Groupe Scolaire El Hadji Malick Dieye ouvre ses inscriptions pour l'annee scolaire 2026-2027, du prescolaire au lycee. Places limitees.",
        'content': (
            "La direction du Groupe Scolaire El Hadji Malick Dieye informe les parents d'eleves que les inscriptions pour l'annee scolaire 2026-2027 sont desormais ouvertes.\n\n"
            "Les inscriptions concernent tous les niveaux :\n"
            "- Prescolaire (petite, moyenne et grande section)\n"
            "- Elementaire (du CI au CM2)\n"
            "- Secondaire (de la 6e a la 3e)\n\n"
            "Pieces a fournir : copie de l'acte de naissance, carnet de vaccination, deux photos d'identite, bulletin de l'annee precedente pour les transferts.\n\n"
            "Pour tout renseignement, veuillez contacter le secretariat aux horaires d'ouverture ou passer directement a l'etablissement."
        ),
    },
    {
        'title': "Ceremonie de fin d'annee : celebration des laureats",
        'category': 'evenement',
        'featured': False,
        'image': 'evenement-1.jpeg',
        'excerpt': "L'ensemble de la communaute educative a celebre les laureats de l'annee lors d'une ceremonie solennelle en presence des familles.",
        'content': (
            "C'est dans une ambiance festive et emue que le Groupe Scolaire El Hadji Malick Dieye a organise sa ceremonie de fin d'annee.\n\n"
            "Les eleves ayant obtenu les meilleures moyennes ont recu des prix d'excellence devant leurs parents, leurs enseignants et l'ensemble du personnel.\n\n"
            "La direction remercie chaleureusement toutes les familles pour leur confiance et leur presence, ainsi que les enseignants pour leur engagement constant."
        ),
    },
    {
        'title': "Excellents resultats aux examens nationaux",
        'category': 'reussite',
        'featured': True,
        'image': 'secondaire-1.jpeg',
        'excerpt': "Nos eleves ont brillé aux examens nationaux avec un taux de reussite remarquable au CFEE et à l'entree en sixieme.",
        'content': (
            "Le Groupe Scolaire El Hadji Malick Dieye est fier d'annoncer d'excellents resultats aux examens nationaux de cette annee.\n\n"
            "Ces resultats sont le fruit du travail serieux des eleves, de l'accompagnement rigoureux des enseignants et de l'implication des parents.\n\n"
            "Felicitations a tous nos laureats ! Que ces succes soient une source d'inspiration pour les promotions futures."
        ),
    },
    {
        'title': "Journee culturelle : celebration du patrimoine senegalais",
        'category': 'activite',
        'featured': False,
        'image': 'back.jpeg',
        'excerpt': "Defile, poesie, theatre et danse traditionnelle : les eleves ont fait vivre la culture senegalaise lors de la journee culturelle annuelle.",
        'content': (
            "La journee culturelle annuelle du Groupe Scolaire El Hadji Malick Dieye a ete un veritable festival de couleurs et de talents.\n\n"
            "Au programme : defile en tenue traditionnelle, recits de poesie, sketches en wolof et en francais, danse sabar et exposition de travaux d'eleves.\n\n"
            "Cette manifestation renforce l'education aux valeurs culturelles et patriotiques, pilier de notre projet educatif."
        ),
    },
    {
        'title': "Amelioration des infrastructures de l'ecole",
        'category': 'information',
        'featured': False,
        'image': 'infrastructure-1.jpeg',
        'excerpt': "Nouvelles salles de classe rehabilitees, bibliotheque enrichie et connexion internet : le cadre d'apprentissage s'ameliore chaque annee.",
        'content': (
            "Dans sa volonte d'offrir un environnement favorable a la reussite des eleves, la direction a lance plusieurs travaux d'amelioration des infrastructures.\n\n"
            "Au programme de cette annee : rehabilitation des salles de classe, enrichissement du fonds documentaire de la bibliotheque et amelioration de la cour de recreation.\n\n"
            "Ces investissements traduisent l'engagement de l'etablissement a offrir un cadre moderne et confortable a ses eleves."
        ),
    },
]

created_news = 0
for i, item in enumerate(news_items):
    if NewsArticle.objects.filter(title=item['title']).exists():
        continue
    img_path = copy_asset(item['image'], MEDIA_NEWS) if item.get('image') else None
    article = NewsArticle(
        title=item['title'],
        excerpt=item['excerpt'][:300],
        content=item['content'],
        category=item['category'],
        author="Administration EMD",
        published_date=datetime.now() - timedelta(days=7 * (len(news_items) - i)),
        is_published=True,
        is_featured=item['featured'],
    )
    if img_path:
        with open(img_path, 'rb') as f:
            article.image.save(item['image'], File(f), save=False)
    article.save()
    created_news += 1

# ---------- GALERIE ----------
gallery_items = [
    ("prescolaire1.jpeg", "Espace d'eveil du prescolaire", "Les tout-petits s'epanouissent dans un environnement securise et stimulant.", 'prescolaire'),
    ("elementaire-1.jpeg", "Classe de l'elementaire", "Un apprentissage solide des fondamentaux dans un cadre adapte.", 'elementaire'),
    ("secondaire-1.jpeg", "Cours au secondaire", "Des enseignements structures pour preparer la reussite aux examens.", 'secondaire'),
    ("general-1.jpeg", "La cour de l'ecole", "Un espace de vie et de jeu pour tous les eleves.", 'general'),
    ("infrastructure-1.jpeg", "Nos infrastructures", "Des batiments entretenus pour le confort et la securite des eleves.", 'infrastructure'),
    ("evenement-1.jpeg", "Evenements de l'ecole", "Ceremonies, journees culturelles et moments forts de la vie scolaire.", 'evenement'),
    ("background.jpeg", "Vie scolaire", "L'ambiance conviviale qui regne au sein de notre etablissement.", 'general'),
]

created_gal = 0
for i, (name, title, desc, cycle) in enumerate(gallery_items):
    if GalleryImage.objects.filter(title=title).exists():
        continue
    img_path = copy_asset(name, MEDIA_GAL)
    if not img_path:
        continue
    img_obj = GalleryImage(
        title=title,
        description=desc,
        cycle=cycle,
        is_active=True,
        is_featured=(i < 2),
        order=i,
    )
    with open(img_path, 'rb') as f:
        img_obj.image.save(name, File(f), save=False)
    img_obj.save()
    created_gal += 1

print(f"OK : {created_news} articles crees, {created_gal} photos ajoutees.")
print(f"Total : {NewsArticle.objects.count()} articles, {GalleryImage.objects.count()} photos.")
