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

const isDev = import.meta.env.DEV;

// Joint le token admin (s'il existe) à chaque requête sortante
api.interceptors.request.use(
  (config) => {
    try {
      const raw = sessionStorage.getItem('emd_admin_auth_session');
      if (raw) {
        const session = JSON.parse(raw);
        if (session?.token) {
          config.headers.Authorization = `Bearer ${session.token}`;
        }
      }
    } catch {
      // session illisible : on envoie la requête sans token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : journalisation limitée au développement,
// aucune donnée sensible affichée en production.
api.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log(`API ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (isDev) {
      if (error.response) {
        console.error(`API Error ${error.response.status} ${error.config?.url}`);
      } else if (error.request) {
        console.error('API Error: pas de réponse du serveur');
      } else {
        console.error('API Error:', error.message);
      }
    }
    // Expiration de session admin -> nettoyage local
    if (error.response?.status === 401) {
      sessionStorage.removeItem('emd_admin_auth_session');
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