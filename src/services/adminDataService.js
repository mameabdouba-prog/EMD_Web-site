import api from './api';

/**
 * Service de gestion des données administrateur pour l'EMD.
 *
 * - Les lectures publiques (page d'accueil) passent par les endpoints publics.
 * - Toutes les opérations du dashboard passent par les endpoints /admin/*
 *   protégés par le token signé (attaché automatiquement par api.js).
 * - Aucune donnée n'est dupliquée en localStorage : le serveur fait foi.
 * - Seuls les paramètres d'affichage locaux restent dans localStorage.
 */

const STORAGE_KEYS = {
    SETTINGS: 'emd_admin_settings',
    AUTH: 'emd_admin_auth_session',
};

const INITIAL_SETTINGS = {
    email: "dieyebabacar802@gmail.com",
    openingHours: "Lundi - Vendredi: 07h30 - 18h00 | Samedi: 08h00 - 12h30",
    announcementTicker: "Inscriptions et réinscriptions ouvertes pour l'année scolaire 2026-2027 ! Contactez le secrétariat au 77 470 15 35."
};

// Helper: load stored data or fallback
const getStored = (key, initial) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : initial;
    } catch (err) {
        console.error(`Error reading ${key} from localStorage:`, err);
        return initial;
    }
};

// Helper: save data
const setStored = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.error(`Error saving ${key} to localStorage:`, err);
    }
};

/**
 * Force des URLs d'images absolues (le backend renvoie image_url absolue,
 * mais image reste un chemin relatif /media/... inexploitable depuis
 * le serveur de dev Vite).
 */
const withAbsoluteImages = (item) => {
    const url = item.image_url || item.image || '';
    return { ...item, image: url, image_url: url };
};

const extractList = (res) => {
    if (res?.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
    }
    throw new Error(res?.data?.message || 'Réponse inattendue du serveur.');
};

export const adminDataService = {
    // ==================== AUTHENTICATION ====================
    /**
     * Authentification via le backend : POST /api/admin/login/
     * Les identifiants ne transitent jamais en clair dans le bundle ;
     * la vérification du mot de passe se fait côté serveur (hash PBKDF2)
     * et renvoie un token signé à durée de vie limitée.
     */
    async login(username, password) {
        try {
            const res = await api.post('/admin/login/', { username, password });
            if (res.data && res.data.success && res.data.token) {
                const session = {
                    user: res.data.session?.user || { name: 'Administrateur EMD', role: 'Super Admin' },
                    token: res.data.token,
                    expiresAt: Date.now() + (res.data.expires_in || 60 * 60 * 8) * 1000,
                    loggedAt: new Date().toISOString(),
                };
                sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
                return { success: true, session };
            }
            return { success: false, message: res.data?.message || 'Identifiants incorrects.' };
        } catch (err) {
            const msg = err.response?.status === 401
                ? 'Identifiants incorrects.'
                : err.response?.data?.message
                    ? err.response.data.message
                    : "Impossible de contacter le serveur d'authentification.";
            return { success: false, message: msg };
        }
    },

    /**
     * Vérifie que la session courante est valide (token présent et non expiré).
     * Note : la validation cryptographique réelle a lieu côté serveur
     * à chaque appel protégé ; ceci n'est qu'un garde-fou d'affichage.
     */
    getCurrentSession() {
        try {
            const sess = sessionStorage.getItem(STORAGE_KEYS.AUTH);
            if (!sess) return null;
            const parsed = JSON.parse(sess);
            if (!parsed?.token) return null;
            if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
                sessionStorage.removeItem(STORAGE_KEYS.AUTH);
                return null;
            }
            return parsed;
        } catch {
            return null;
        }
    },

    logout() {
        sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    },

    // ==================== LECTURES PUBLIQUES (accueil) ====================

    /** Articles publiés uniquement (endpoint public). */
    async getPublishedNews() {
        const res = await api.get('/news/');
        return extractList(res).map(withAbsoluteImages);
    },

    /** Images actives uniquement (endpoint public). */
    async getActiveGallery() {
        const res = await api.get('/gallery/');
        return extractList(res).map(withAbsoluteImages);
    },

    // ==================== ACTUALITÉS (ADMIN) ====================

    /** Tous les articles, publiés ou non. */
    async getNews() {
        const res = await api.get('/admin/news/');
        return extractList(res).map(withAbsoluteImages);
    },

    /**
     * Crée ou met à jour un article puis renvoie la liste actualisée.
     * Une nouvelle image est transmise sous forme de data URL base64 ;
     * sans nouvelle image, le champ est omis pour conserver l'existant.
     */
    async saveNewsArticle(article) {
        const payload = {
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            author: article.author || 'Administration EMD',
            is_published: article.is_published !== undefined ? article.is_published : true,
            is_featured: !!article.is_featured,
        };
        if (typeof article.image_url === 'string' && article.image_url.startsWith('data:image')) {
            payload.image = article.image_url;
        }

        if (article.id) {
            await api.patch(`/admin/news/${article.id}/`, payload);
        } else {
            await api.post('/admin/news/', payload);
        }
        return this.getNews();
    },

    async deleteNewsArticle(id) {
        await api.delete(`/admin/news/${id}/`);
        return this.getNews();
    },

    async toggleNewsPublished(id, currentValue) {
        await api.patch(`/admin/news/${id}/`, { is_published: !currentValue });
        return this.getNews();
    },

    async toggleNewsFeatured(id, currentValue) {
        await api.patch(`/admin/news/${id}/`, { is_featured: !currentValue });
        return this.getNews();
    },

    // ==================== GALERIE (ADMIN) ====================

    /** Toutes les images, actives ou non. */
    async getGallery() {
        const res = await api.get('/admin/gallery/');
        return extractList(res).map(withAbsoluteImages);
    },

    /**
     * Ajoute ou met à jour une photo puis renvoie la liste actualisée.
     * Une nouvelle photo (data URL base64) est requise à la création.
     */
    async saveGalleryImage(imageObj) {
        const payload = {
            title: imageObj.title,
            description: imageObj.description || '',
            cycle: imageObj.cycle || 'general',
            is_active: imageObj.is_active !== undefined ? imageObj.is_active : true,
            is_featured: !!imageObj.is_featured,
        };
        if (typeof imageObj.image === 'string' && imageObj.image.startsWith('data:image')) {
            payload.image = imageObj.image;
        }

        if (imageObj.id) {
            await api.patch(`/admin/gallery/${imageObj.id}/`, payload);
        } else {
            await api.post('/admin/gallery/', payload);
        }
        return this.getGallery();
    },

    async deleteGalleryImage(id) {
        await api.delete(`/admin/gallery/${id}/`);
        return this.getGallery();
    },

    async toggleGalleryActive(id, currentValue) {
        await api.patch(`/admin/gallery/${id}/`, { is_active: !currentValue });
        return this.getGallery();
    },

    async toggleGalleryFeatured(id, currentValue) {
        await api.patch(`/admin/gallery/${id}/`, { is_featured: !currentValue });
        return this.getGallery();
    },

    // ==================== MESSAGES DE CONTACT (ADMIN) ====================

    async getMessages() {
        const res = await api.get('/contact/list/');
        return extractList(res);
    },

    async markMessageRead(id) {
        await api.patch(`/admin/messages/${id}/`, { lu: true });
        return this.getMessages();
    },

    async markMessageTraite(id, traite = true, notes = null) {
        const payload = { traite, lu: true };
        if (notes !== null) payload.notes = notes;
        await api.patch(`/admin/messages/${id}/`, payload);
        return this.getMessages();
    },

    async deleteMessage(id) {
        await api.delete(`/admin/messages/${id}/`);
        return this.getMessages();
    },

    // ==================== PARAMÈTRES SITE (local) ====================
    getSettings() {
        return getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    },

    saveSettings(newSettings) {
        const current = getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
        const updated = { ...current, ...newSettings };
        setStored(STORAGE_KEYS.SETTINGS, updated);
        return updated;
    }
};

export default adminDataService;
