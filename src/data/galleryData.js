/**
 * DONNÉES DE LA GALERIE - IMAGES LOCALES
 * 
 * Ce fichier contient toutes les images de la galerie qui sont stockées
 * dans le dossier src/assets/
 * 
 * STRUCTURE D'UNE IMAGE :
 * {
 *   id: numéro unique,
 *   title: "Titre descriptif",
 *   description: "Description détaillée",
 *   image: chemin vers l'image dans assets,
 *   cycle: catégorie (prescolaire, elementaire, secondaire, etc.),
 *   is_featured: true/false (image mise en avant avec étoile),
 *   is_active: true/false (afficher ou cacher l'image)
 * }
 */

// ============================================
// ÉTAPE 1 : IMPORTER VOS IMAGES
// ============================================
// Remplacez ces lignes par vos vraies images dans assets/

// Images du PRÉSCOLAIRE (enfants 3-5 ans)
import prescolaire1 from '../assets/prescolaire1.jpeg'; // Classe de petite section je dois mettre prescolaire 1
import prescolaire2 from '../assets/prescolaire1.jpeg'; // Activité de dessin
import prescolaire3 from '../assets/prescolaire1.jpeg'; // Récréation préscolaire

// Images de l'ÉLÉMENTAIRE (CP à CM2)
import elementaire1 from '../assets/elementaire-1.jpeg'; // Classe de CM2 la je dois mettre elementaire 1
import elementaire2 from '../assets/elementaire-1.jpeg'; // Cours de mathématiques
import elementaire3 from '../assets/elementaire-1.jpeg'; // Bibliothèque

// Images du SECONDAIRE (6ème à Terminale)
import secondaire1 from '../assets/secondaire-1.jpeg'; // Laboratoire de sciences
import secondaire2 from '../assets/secondaire-1.jpeg'; // Salle informatique
import secondaire3 from '../assets/secondaire-1.jpeg'; // Cours de chimie

// Images d'ÉVÉNEMENTS (cérémonies, fêtes, sorties)
import evenement1 from '../assets/evenement-1.jpeg'; // Cérémonie de remise des diplômes
import evenement2 from '../assets/evenement-1.jpeg'; // Fête de fin d'année
import evenement3 from '../assets/evenement-1.jpeg'; // Sortie pédagogique

// Images des INFRASTRUCTURES (bâtiments, équipements)
import infrastructure1 from '../assets/infrastructure-1.jpeg'; // Façade de l'école
import infrastructure2 from '../assets/infrastructure-1.jpeg'; // Cour de récréation
import infrastructure3 from '../assets/infrastructure-1.jpeg'; // Salle de classe équipée

// Images GÉNÉRALES (équipe, vie quotidienne)
import general1 from '../assets/general-1.jpeg'; // Équipe pédagogique
import general2 from '../assets/general-1.jpeg'; // Entrée de l'école
import general3 from '../assets/general-1.jpeg'; // Cantine


// ============================================
// ÉTAPE 2 : TABLEAU DE TOUTES LES IMAGES
// ============================================
export const galleryImages = [
  
  // ========== PRÉSCOLAIRE (3-5 ans) ==========
  {
    id: 1, // Numéro unique pour cette image
    title: "Classe de Petite Section", // Titre qui s'affiche
    description: "Nos tout-petits découvrent les joies de l'apprentissage dans un environnement coloré et stimulant.", // Description détaillée
    image: prescolaire1, // Image importée ci-dessus
    cycle: 'prescolaire', // Catégorie : doit être 'prescolaire', 'elementaire', 'secondaire', 'evenement', 'infrastructure', ou 'general'
    cycle_display: 'Préscolaire', // Nom affiché de la catégorie
    is_featured: true, // true = affiche l'étoile "★ Mise en avant"
    is_active: true, // true = visible dans la galerie, false = cachée
    order: 1 // Ordre d'affichage (plus petit = affiché en premier)
  },
  {
    id: 2,
    title: "Activité de Dessin",
    description: "Les enfants développent leur créativité à travers des activités artistiques encadrées.",
    image: prescolaire2,
    cycle: 'prescolaire',
    cycle_display: 'Préscolaire',
    is_featured: false, // Pas mise en avant
    is_active: true,
    order: 2
  },
  {
    id: 3,
    title: "Récréation au Préscolaire",
    description: "Moment de détente et de socialisation pour nos petits élèves dans notre espace de jeux sécurisé.",
    image: prescolaire3,
    cycle: 'prescolaire',
    cycle_display: 'Préscolaire',
    is_featured: false,
    is_active: true,
    order: 3
  },

  // ========== ÉLÉMENTAIRE (CP à CM2) ==========
  {
    id: 4,
    title: "Classe de CM2",
    description: "Nos élèves de CM2 en pleine concentration lors d'un cours de français.",
    image: elementaire1,
    cycle: 'elementaire',
    cycle_display: 'Élémentaire',
    is_featured: true, // Image mise en avant
    is_active: true,
    order: 4
  },
  {
    id: 5,
    title: "Cours de Mathématiques",
    description: "Apprentissage interactif des mathématiques avec du matériel pédagogique moderne.",
    image: elementaire2,
    cycle: 'elementaire',
    cycle_display: 'Élémentaire',
    is_featured: false,
    is_active: true,
    order: 5
  },
  {
    id: 6,
    title: "Bibliothèque de l'École",
    description: "Espace lecture où les élèves cultivent leur amour des livres et de la connaissance.",
    image: elementaire3,
    cycle: 'elementaire',
    cycle_display: 'Élémentaire',
    is_featured: false,
    is_active: true,
    order: 6
  },

  // ========== SECONDAIRE (6ème à Terminale) ==========
  {
    id: 7,
    title: "Laboratoire de Sciences",
    description: "Travaux pratiques de physique-chimie avec un équipement de laboratoire complet.",
    image: secondaire1,
    cycle: 'secondaire',
    cycle_display: 'Secondaire',
    is_featured: true,
    is_active: true,
    order: 7
  },
  {
    id: 8,
    title: "Salle Informatique",
    description: "Formation aux nouvelles technologies dans notre salle informatique moderne.",
    image: secondaire2,
    cycle: 'secondaire',
    cycle_display: 'Secondaire',
    is_featured: false,
    is_active: true,
    order: 8
  },
  {
    id: 9,
    title: "Cours de Chimie",
    description: "Expériences de chimie encadrées par nos enseignants qualifiés.",
    image: secondaire3,
    cycle: 'secondaire',
    cycle_display: 'Secondaire',
    is_featured: false,
    is_active: true,
    order: 9
  },

  // ========== ÉVÉNEMENTS ==========
  {
    id: 10,
    title: "Cérémonie de Remise des Diplômes",
    description: "Moment de fierté lors de la remise des diplômes du BAC 2024. Félicitations à tous nos lauréats !",
    image: evenement1,
    cycle: 'evenement',
    cycle_display: 'Événement',
    is_featured: true, // Événement important
    is_active: true,
    order: 10
  },
  {
    id: 11,
    title: "Fête de Fin d'Année",
    description: "Célébration de fin d'année scolaire avec spectacles et animations pour tous les élèves.",
    image: evenement2,
    cycle: 'evenement',
    cycle_display: 'Événement',
    is_featured: false,
    is_active: true,
    order: 11
  },
  {
    id: 12,
    title: "Sortie Pédagogique",
    description: "Visite éducative au musée dans le cadre du programme d'histoire.",
    image: evenement3,
    cycle: 'evenement',
    cycle_display: 'Événement',
    is_featured: false,
    is_active: true,
    order: 12
  },

  // ========== INFRASTRUCTURES ==========
  {
    id: 13,
    title: "Façade de l'École",
    description: "Vue extérieure de notre établissement situé à Thiès, Tableau Bakhdad.",
    image: infrastructure1,
    cycle: 'infrastructure',
    cycle_display: 'Infrastructure',
    is_featured: true,
    is_active: true,
    order: 13
  },
  {
    id: 14,
    title: "Cour de Récréation",
    description: "Espace de détente spacieux et sécurisé pour les pauses des élèves.",
    image: infrastructure2,
    cycle: 'infrastructure',
    cycle_display: 'Infrastructure',
    is_featured: false,
    is_active: true,
    order: 14
  },
  {
    id: 15,
    title: "Salle de Classe Moderne",
    description: "Salles de classe climatisées et équipées de tableaux interactifs.",
    image: infrastructure3,
    cycle: 'infrastructure',
    cycle_display: 'Infrastructure',
    is_featured: false,
    is_active: true,
    order: 15
  },

  // ========== GÉNÉRAL ==========
  {
    id: 16,
    title: "Équipe Pédagogique",
    description: "Notre équipe d'enseignants dévoués et hautement qualifiés.",
    image: general1,
    cycle: 'general',
    cycle_display: 'Général',
    is_featured: true,
    is_active: true,
    order: 16
  },
  {
    id: 17,
    title: "Entrée Principale",
    description: "Accueil chaleureux à l'entrée du Groupe Scolaire EMD.",
    image: general2,
    cycle: 'general',
    cycle_display: 'Général',
    is_featured: false,
    is_active: true,
    order: 17
  },
  {
    id: 18,
    title: "Cantine Scolaire",
    description: "Service de restauration proposant des repas équilibrés et variés.",
    image: general3,
    cycle: 'general',
    cycle_display: 'Général',
    is_featured: false,
    is_active: true,
    order: 18
  },
];


// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Récupère toutes les images actives
 * @returns {Array} Liste des images visibles
 */
export const getActiveImages = () => {
  return galleryImages.filter(img => img.is_active);
};

/**
 * Récupère les images par catégorie
 * @param {string} cycle - Catégorie (prescolaire, elementaire, etc.)
 * @returns {Array} Images de cette catégorie
 */
export const getImagesByCategory = (cycle) => {
  if (cycle === 'all') return getActiveImages();
  return galleryImages.filter(img => img.cycle === cycle && img.is_active);
};

/**
 * Récupère les images mises en avant
 * @returns {Array} Images avec is_featured = true
 */
export const getFeaturedImages = () => {
  return galleryImages.filter(img => img.is_featured && img.is_active);
};

/**
 * Récupère une image par son ID
 * @param {number} id - ID de l'image
 * @returns {Object|null} L'image ou null si non trouvée
 */
export const getImageById = (id) => {
  return galleryImages.find(img => img.id === id) || null;
};


// ============================================
// EXPORT PAR DÉFAUT
// ============================================
export default galleryImages;