import axios from 'axios';

/**
 * Configuration de l'API et services pour communiquer avec le backend Django
 * Groupe Scolaire El Hadji Malick Dieye
 */

// URL de base de l'API Django
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// Intercepteur pour logger les requêtes (développement)
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ Response Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
    } else if (error.request) {
      console.error('❌ No Response:', error.request);
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ==================== CONTACT ====================

/**
 * Envoie un message de contact
 */
export const sendContactMessage = async (data) => {
  try {
    const response = await api.post('/contact/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère tous les messages de contact (admin)
 */
export const getContactMessages = async (params = {}) => {
  try {
    const response = await api.get('/contact/list/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== GALERIE ====================

/**
 * Récupère toutes les images de la galerie
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.cycle - Filtrer par cycle (prescolaire, elementaire, secondaire, general, evenement, infrastructure)
 * @param {boolean} params.featured - Filtrer les images mises en avant
 * @param {number} params.limit - Nombre d'images à retourner
 */
export const getGalleryImages = async (params = {}) => {
  try {
    const response = await api.get('/gallery/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère le détail d'une image de la galerie
 */
export const getGalleryImage = async (id) => {
  try {
    const response = await api.get(`/gallery/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== ACTUALITÉS ====================

/**
 * Récupère toutes les actualités
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.category - Filtrer par catégorie (annonce, evenement, reussite, activite, information)
 * @param {boolean} params.featured - Filtrer les articles mis en avant
 * @param {number} params.limit - Nombre d'articles à retourner
 */
export const getNewsArticles = async (params = {}) => {
  try {
    const response = await api.get('/news/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère le détail d'un article d'actualité
 */
export const getNewsArticle = async (slug) => {
  try {
    const response = await api.get(`/news/${slug}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== HEALTH CHECK ====================

/**
 * Vérifie l'état de santé de l'API
 */
export const checkAPIHealth = async () => {
  try {
    const response = await api.get('/health/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;