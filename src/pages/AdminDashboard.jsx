import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Newspaper,
    Image as ImageIcon,
    Mail,
    Settings,
    LogOut,
    Plus,
    Trash2,
    Edit,
    Eye,
    EyeOff,
    Star,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    X,
    ExternalLink,
    ShieldCheck,
    Clock,
    UserCheck,
    MessageSquare,
    Sparkles,
    Save,
    Menu,
    ChevronRight,
    Phone,
    MapPin,
    FileText,
    Upload
} from 'lucide-react';
import logoEMD from '../assets/EMD.jpeg';
import compressImage from '../utils/imageCompressor';
import adminDataService from '../services/adminDataService';

import AdminLogin from '../components/admin/AdminLogin';

const AdminDashboard = () => {
    const [session, setSession] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, news, gallery, messages, settings
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Data states
    const [newsList, setNewsList] = useState([]);
    const [galleryList, setGalleryList] = useState([]);
    const [messagesList, setMessagesList] = useState([]);
    const [siteSettings, setSiteSettings] = useState({});

    // Loading & Toast state
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // Filter states
    const [newsSearch, setNewsSearch] = useState('');
    const [newsCategoryFilter, setNewsCategoryFilter] = useState('all');
    const [galleryCycleFilter, setGalleryCycleFilter] = useState('all');
    const [messageStatusFilter, setMessageStatusFilter] = useState('all');

    // Modal states
    const [newsModalOpen, setNewsModalOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);

    const [galleryModalOpen, setGalleryModalOpen] = useState(false);
    const [currentGallery, setCurrentGallery] = useState(null);

    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messageNoteInput, setMessageNoteInput] = useState('');

    // Initial load
    useEffect(() => {
        const currentSess = adminDataService.getCurrentSession();
        if (currentSess) {
            setSession(currentSess);
            loadAllData();
        } else {
            setLoading(false);
        }
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const newsData = await adminDataService.getNews();
            const galleryData = await adminDataService.getGallery();
            const messagesData = await adminDataService.getMessages();
            const settingsData = adminDataService.getSettings();

            setNewsList(newsData);
            setGalleryList(galleryData);
            setMessagesList(messagesData);
            setSiteSettings(settingsData);
        } catch (err) {
            console.error("Erreur de chargement des données admin:", err);
            showToast("Erreur lors du chargement des données", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleLogout = () => {
        adminDataService.logout();
        setSession(null);
    };

    if (!session) {
        return <AdminLogin onLoginSuccess={(sess) => { setSession(sess); loadAllData(); }} />;
    }

    // Statistics calculation
    const totalNews = newsList.length;
    const publishedNews = newsList.filter(n => n.is_published).length;
    const totalGallery = galleryList.length;
    const totalMessages = messagesList.length;
    const unreadMessages = messagesList.filter(m => !m.lu).length;

    // ==========================================
    // NEWS HANDLERS
    // ==========================================
    const handleOpenNewsModal = (article = null) => {
        if (article) {
            setCurrentNews({ ...article });
        } else {
            setCurrentNews({
                title: '',
                category: 'annonce',
                excerpt: '',
                content: '',
                image_url: '',
                is_published: true,
                is_featured: false,
                author: 'Administration EMD'
            });
        }
        setNewsModalOpen(true);
    };

    const handleSaveNews = async (e) => {
        e.preventDefault();
        try {
            const updated = await adminDataService.saveNewsArticle(currentNews);
            setNewsList(updated);
            setNewsModalOpen(false);
            showToast(currentNews.id ? "Article mis à jour avec succès" : "Nouvel article publié avec succès");
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Erreur lors de l'enregistrement de l'article", "error");
        }
    };

    const handleDeleteNews = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
        try {
            const updated = await adminDataService.deleteNewsArticle(id);
            setNewsList(updated);
            showToast("Article supprimé", "info");
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la suppression de l'article", "error");
        }
    };

    const handleToggleNewsPublished = async (id) => {
        const item = newsList.find(n => n.id === id);
        if (!item) return;
        try {
            const updated = await adminDataService.toggleNewsPublished(id, item.is_published);
            setNewsList(updated);
            showToast("Statut de publication mis à jour");
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la mise à jour", "error");
        }
    };

    const handleToggleNewsFeatured = async (id) => {
        const item = newsList.find(n => n.id === id);
        if (!item) return;
        try {
            const updated = await adminDataService.toggleNewsFeatured(id, item.is_featured);
            setNewsList(updated);
            showToast("Statut 'À la une' mis à jour");
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la mise à jour", "error");
        }
    };

    const handleNewsImageUpload = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast("Veuillez sélectionner un fichier image valide", "error");
                return;
            }
            try {
                const compressed = await compressImage(file, 1200, 0.75);
                setCurrentNews(prev => ({ ...prev, image_url: compressed }));
                showToast("Image importée et optimisée avec succès !");
            } catch (err) {
                console.error("Erreur de compression d'image:", err);
                showToast("Erreur lors de l'importation de l'image", "error");
            }
        }
    };

    const handleGalleryImageUpload = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast("Veuillez sélectionner un fichier image valide", "error");
                return;
            }
            try {
                const compressed = await compressImage(file, 1200, 0.75);
                setCurrentGallery(prev => ({ ...prev, image: compressed }));
                showToast("Photo importée et optimisée avec succès !");
            } catch (err) {
                console.error("Erreur de compression d'image:", err);
                showToast("Erreur lors de l'importation de la photo", "error");
            }
        }
    };


    // Filtered News
    const filteredNews = newsList.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
            article.excerpt?.toLowerCase().includes(newsSearch.toLowerCase());
        const matchesCategory = newsCategoryFilter === 'all' || article.category === newsCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    // ==========================================
    // GALLERY HANDLERS
    // ==========================================
    const handleOpenGalleryModal = (image = null) => {
        if (image) {
            setCurrentGallery({ ...image });
        } else {
            setCurrentGallery({
                title: '',
                cycle: 'general',
                cycle_display: 'Général',
                description: '',
                image: '',
                is_active: true,
                is_featured: false
            });
        }
        setGalleryModalOpen(true);
    };

    const handleSaveGallery = async (e) => {
        e.preventDefault();
        try {
            const updated = await adminDataService.saveGalleryImage(currentGallery);
            setGalleryList(updated);
            setGalleryModalOpen(false);
            showToast(currentGallery.id ? "Photo mise à jour" : "Nouvelle photo ajoutée à la galerie");
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Erreur lors de l'enregistrement de la photo", "error");
        }
    };

    const handleDeleteGallery = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette photo ?")) return;
        try {
            const updated = await adminDataService.deleteGalleryImage(id);
            setGalleryList(updated);
            showToast("Photo supprimée", "info");
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la suppression de la photo", "error");
        }
    };

    const handleToggleGalleryActive = async (id) => {
        const item = galleryList.find(g => g.id === id);
        if (!item) return;
        try {
            const updated = await adminDataService.toggleGalleryActive(id, item.is_active);
            setGalleryList(updated);
            showToast("Visibilité de la photo mise à jour");
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la mise à jour", "error");
        }
    };

    const handleToggleGalleryFeatured = async (id) => {
        const item = galleryList.find(g => g.id === id);
        if (!item) return;
        try {
            const updated = await adminDataService.toggleGalleryFeatured(id, item.is_featured);
            setGalleryList(updated);
            showToast("Statut de mise en avant mis à jour");
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la mise à jour", "error");
        }
    };

    // Filtered Gallery
    const filteredGallery = galleryList.filter(img => {
        return galleryCycleFilter === 'all' || img.cycle === galleryCycleFilter;
    });

    // ==========================================
    // MESSAGES HANDLERS
    // ==========================================
    const handleOpenMessageModal = (msg) => {
        setSelectedMessage(msg);
        setMessageNoteInput(msg.notes || '');
        setMessageModalOpen(true);
        if (!msg.lu) {
            adminDataService.markMessageRead(msg.id)
                .then(setMessagesList)
                .catch(err => console.error("Erreur marquage lu:", err));
        }
    };

    const handleSaveMessageNotes = async () => {
        if (!selectedMessage) return;
        try {
            const updated = await adminDataService.markMessageTraite(selectedMessage.id, true, messageNoteInput);
            setMessagesList(updated);
            setMessageModalOpen(false);
            showToast("Message marqué comme traité avec notes enregistrées");
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la mise à jour du message", "error");
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Supprimer ce message de contact ?")) return;
        try {
            const updated = await adminDataService.deleteMessage(id);
            setMessagesList(updated);
            if (selectedMessage?.id === id) setMessageModalOpen(false);
            showToast("Message supprimé", "info");
        } catch (err) {
            console.error(err);
            showToast("Erreur lors de la suppression du message", "error");
        }
    };

    // Filtered Messages
    const filteredMessages = messagesList.filter(msg => {
        if (messageStatusFilter === 'unread') return !msg.lu;
        if (messageStatusFilter === 'traite') return msg.traite;
        return true;
    });

    /* Halo lumineux qui suit le curseur sur les cartes KPI */
    const handleSpotlightKpi = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    // ==========================================
    // SETTINGS HANDLER
    // ==========================================
    const handleSaveSettings = (e) => {
        e.preventDefault();
        const updated = adminDataService.saveSettings(siteSettings);
        setSiteSettings(updated);
        showToast("Paramètres du site enregistrés avec succès !");
    };

    return (
        <div className="min-h-screen bg-blue-950 text-slate-100 flex flex-col md:flex-row relative">
            {/* Décor : halos aurora + grille subtile, identité visuelle du site */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-grid-dark opacity-[0.35]" />
                <div className="absolute -top-32 -left-24 w-[480px] h-[480px] bg-orange-500/[0.08] rounded-full blur-3xl" />
                <div className="absolute top-1/3 -right-32 w-[520px] h-[520px] bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 left-1/3 w-[420px] h-[420px] bg-amber-500/[0.05] rounded-full blur-3xl" />
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-3 animate-fade-in ${toast.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-200' :
                    toast.type === 'info' ? 'bg-blue-950/90 border-blue-500 text-blue-200' :
                        'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                    }`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-semibold">{toast.message}</span>
                </div>
            )}

            {/* MOBILE BAR */}
            <div className="md:hidden bg-blue-950/80 backdrop-blur-xl border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-30 relative">
                <div className="flex items-center space-x-3">
                    <img src={logoEMD} alt="EMD Logo" className="w-9 h-9 rounded-full ring-2 ring-orange-400/70" />
                    <span className="font-extrabold text-sm text-white">EMD Admin</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-xl bg-white/10 border border-white/10 text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* SIDEBAR NAVIGATION */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-950/80 backdrop-blur-2xl border-r border-white/10 p-5 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                <div>
                    {/* Logo & School Branding */}
                    <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
                        <img src={logoEMD} alt="Logo" className="w-11 h-11 rounded-full ring-2 ring-orange-400/70 shadow-lg shadow-orange-500/20" />
                        <div>
                            <h2 className="font-extrabold text-sm text-white leading-tight">GROUPE SCOLAIRE</h2>
                            <p className="text-xs font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">El Hadji Malick Dieye</p>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="mt-6 space-y-1.5">
                        {[
                            { id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard, badge: null },
                            { id: 'news', label: 'Actualités', icon: Newspaper, badge: totalNews },
                            { id: 'gallery', label: 'Galerie Photos', icon: ImageIcon, badge: totalGallery },
                            { id: 'messages', label: 'Messages Contact', icon: Mail, badge: unreadMessages > 0 ? unreadMessages : null },
                            { id: 'settings', label: 'Paramètres Site', icon: Settings, badge: null },
                        ].map(item => {
                            const Icon = item.icon;
                            const active = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                    className={`relative w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${active
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                                        }`}
                                >
                                    {active && <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-gradient-to-b from-orange-400 to-amber-400" />}
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${active ? '' : 'text-orange-400/80'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge !== null && (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${active ? 'bg-white/20 text-white' : item.id === 'messages' && unreadMessages > 0 ? 'bg-orange-500 text-white animate-pulse' : 'bg-white/10 text-slate-300'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* User Session & Logout */}
                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center shadow-md shadow-orange-500/25">
                            A
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{session.user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 md:ml-64 p-4 sm:p-8 overflow-y-auto relative">
                {/* TOP BAR HEADER */}
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 pt-2 pb-5 mb-8 bg-blue-950/70 backdrop-blur-xl border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                            <ShieldCheck className="w-4 h-4 text-orange-400" />
                            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Administration EMD</span>
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            {activeTab === 'overview' && 'Vue d\'ensemble & Statistiques'}
                            {activeTab === 'news' && 'Gestion des Actualités'}
                            {activeTab === 'gallery' && 'Gestion de la Galerie Photos'}
                            {activeTab === 'messages' && 'Messages de Contact'}
                            {activeTab === 'settings' && 'Configuration du Site'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5" /> Voir le site
                        </a>
                    </div>
                </div>

                {/* ========================================== */}
                {/* TAB 1: OVERVIEW */}
                {/* ========================================== */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* KPI Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div onMouseMove={handleSpotlightKpi} className="kpi-card p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-xl group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors duration-500" />
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                                        <Newspaper className="w-6 h-6" />
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                                        {publishedNews} Publiés
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-1 relative z-10">{totalNews}</h3>
                                <p className="text-xs text-slate-400 font-medium">Articles d'Actualité</p>
                            </div>

                            <div onMouseMove={handleSpotlightKpi} className="kpi-card p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-xl group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500" />
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">
                                        Actives
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-1 relative z-10">{totalGallery}</h3>
                                <p className="text-xs text-slate-400 font-medium">Photos dans l'album</p>
                            </div>

                            <div onMouseMove={handleSpotlightKpi} className="kpi-card p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-xl group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors duration-500" />
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    {unreadMessages > 0 ? (
                                        <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-bold animate-pulse">
                                            {unreadMessages} Non lu{unreadMessages > 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-bold">
                                            À jour
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-1 relative z-10">{totalMessages}</h3>
                                <p className="text-xs text-slate-400 font-medium">Messages de Contact</p>
                            </div>
                        </div>

                        {/* Quick Actions & Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Quick Actions */}
                            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
                                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-orange-400" /> Actions Rapides
                                </h2>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => { setActiveTab('news'); handleOpenNewsModal(); }}
                                        className="w-full p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 text-orange-300 font-bold text-xs flex items-center justify-between hover:bg-orange-500/20 transition-all group"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Plus className="w-4 h-4 text-orange-400" /> Publier une actualité
                                        </span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => { setActiveTab('gallery'); handleOpenGalleryModal(); }}
                                        className="w-full p-4 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-between hover:bg-white/[0.12] transition-all group"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Plus className="w-4 h-4 text-blue-400" /> Ajouter une photo à la galerie
                                        </span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('messages')}
                                        className="w-full p-4 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-between hover:bg-white/[0.12] transition-all group"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-amber-400" /> Voir les messages ({unreadMessages})
                                        </span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Recent Messages Preview */}
                            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-orange-400" /> Derniers Messages de Contact
                                    </h2>
                                    <button onClick={() => setActiveTab('messages')} className="text-xs font-bold text-orange-400 hover:underline">
                                        Voir tout ({totalMessages})
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {messagesList.slice(0, 3).map(msg => (
                                        <div
                                            key={msg.id}
                                            onClick={() => handleOpenMessageModal(msg)}
                                            className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-orange-400/50 cursor-pointer transition-all flex items-start justify-between gap-4"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-xs text-white">{msg.nom}</span>
                                                    {!msg.lu && (
                                                        <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">Nouveau</span>
                                                    )}
                                                    {msg.traite && (
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Traité</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-300 font-medium line-clamp-1">{msg.sujet || msg.message}</p>
                                                <span className="text-[10px] text-slate-400 mt-1 block">{msg.email} • {new Date(msg.date).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 mt-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB 2: NEWS MANAGEMENT */}
                {/* ========================================== */}
                {activeTab === 'news' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Header controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.04] p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un article..."
                                        value={newsSearch}
                                        onChange={(e) => setNewsSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white/[0.06] border border-white/10 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <select
                                    value={newsCategoryFilter}
                                    onChange={(e) => setNewsCategoryFilter(e.target.value)}
                                    className="py-2 px-3 bg-white/[0.06] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-400/60 transition-all"
                                >
                                    <option value="all">Toutes les catégories</option>
                                    <option value="annonce">Annonces</option>
                                    <option value="evenement">Événements</option>
                                    <option value="reussite">Réussites</option>
                                    <option value="activite">Activités</option>
                                    <option value="information">Informations</option>
                                </select>
                            </div>

                            <button
                                onClick={() => handleOpenNewsModal()}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Nouvel Article
                            </button>
                        </div>

                        {/* Articles Table */}
                        <div className="bg-white/[0.04] rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.06] border-b border-white/10 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                            <th className="py-4 px-4">Article</th>
                                            <th className="py-4 px-4">Catégorie</th>
                                            <th className="py-4 px-4">Publication</th>
                                            <th className="py-4 px-4">Statut</th>
                                            <th className="py-4 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 text-xs">
                                        {filteredNews.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-slate-400">
                                                    Aucun article d'actualité trouvé.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredNews.map(article => (
                                                <tr key={article.id} className="hover:bg-white/[0.05] transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center space-x-3">
                                                            <img
                                                                src={article.image_url}
                                                                alt={article.title}
                                                                className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                                                            />
                                                            <div>
                                                                <h4 className="font-bold text-white text-sm line-clamp-1">{article.title}</h4>
                                                                <p className="text-[11px] text-slate-400 line-clamp-1">{article.excerpt}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-orange-300 font-bold text-[10px] uppercase">
                                                            {article.category_display || article.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-slate-300 font-mono text-[11px]">
                                                        {new Date(article.published_date).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <button
                                                                onClick={() => handleToggleNewsPublished(article.id)}
                                                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all ${article.is_published ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                                    }`}
                                                            >
                                                                {article.is_published ? 'Publié' : 'Brouillon'}
                                                            </button>
                                                            {article.is_featured && (
                                                                <button
                                                                    onClick={() => handleToggleNewsFeatured(article.id)}
                                                                    className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold flex items-center gap-1"
                                                                >
                                                                    <Star className="w-2.5 h-2.5 fill-amber-300" /> Une
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleOpenNewsModal(article)}
                                                                className="p-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-blue-300 transition-colors"
                                                                title="Modifier"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteNews(article.id)}
                                                                className="p-2 rounded-lg bg-white/[0.08] hover:bg-red-500/25 text-red-300 transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB 3: GALLERY MANAGEMENT */}
                {/* ========================================== */}
                {activeTab === 'gallery' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.04] p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                                    <Filter className="w-3.5 h-3.5 text-orange-400" /> Cycle / Catégorie :
                                </span>
                                {[
                                    { value: 'all', label: 'Toutes' },
                                    { value: 'prescolaire', label: 'Préscolaire' },
                                    { value: 'elementaire', label: 'Élémentaire' },
                                    { value: 'secondaire', label: 'Secondaire' },
                                    { value: 'evenement', label: 'Événements' },
                                    { value: 'infrastructure', label: 'Infrastructures' },
                                    { value: 'general', label: 'Général' }
                                ].map(c => {
                                    const isSelected = galleryCycleFilter === c.value;
                                    const count = c.value === 'all'
                                        ? galleryList.length
                                        : galleryList.filter(img => img.cycle === c.value).length;

                                    return (
                                        <button
                                            key={c.value}
                                            onClick={() => setGalleryCycleFilter(c.value)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${isSelected
                                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-105'
                                                    : 'bg-white/[0.05] border border-white/10 text-slate-300 hover:bg-white/[0.12] hover:text-white'
                                                }`}
                                        >
                                            <span>{c.label}</span>
                                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-950/70 text-slate-400'
                                                }`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handleOpenGalleryModal()}
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Ajouter une Photo
                            </button>
                        </div>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredGallery.map(img => (
                                <div key={img.id} className="bg-white/[0.04] rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden shadow-xl flex flex-col">
                                    <div className="relative h-48 bg-black">
                                        <img src={img.image} alt={img.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-3 left-3 bg-blue-950/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-orange-400 uppercase">
                                            {img.cycle_display || img.cycle}
                                        </div>
                                        {img.is_featured && (
                                            <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                                                <Star className="w-2.5 h-2.5 fill-white" /> À la une
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-white text-sm leading-snug line-clamp-1">{img.title}</h4>
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{img.description}</p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleGalleryActive(img.id)}
                                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold ${img.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                                                        }`}
                                                >
                                                    {img.is_active ? 'Visible' : 'Masquée'}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleGalleryFeatured(img.id)}
                                                    className={`p-1 rounded-lg text-xs ${img.is_featured ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-white'
                                                        }`}
                                                    title="Basculer 'À la une'"
                                                >
                                                    <Star className={`w-3.5 h-3.5 ${img.is_featured ? 'fill-amber-400' : ''}`} />
                                                </button>
                                            </div>

                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleOpenGalleryModal(img)}
                                                    className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-blue-300"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGallery(img.id)}
                                                    className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-red-500/25 text-red-300"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB 4: MESSAGES MANAGEMENT */}
                {/* ========================================== */}
                {activeTab === 'messages' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex gap-2 bg-white/[0.04] p-2 rounded-2xl border border-white/10 backdrop-blur-xl w-fit">
                            {[
                                { key: 'all', label: 'Tous les messages' },
                                { key: 'unread', label: `Non lus (${unreadMessages})` },
                                { key: 'traite', label: 'Traités' },
                            ].map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => setMessageStatusFilter(f.key)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${messageStatusFilter === f.key ? 'bg-orange-500 text-white' : 'bg-transparent text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filteredMessages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`p-6 rounded-3xl border transition-all ${!msg.lu ? 'bg-white/[0.05] border-orange-500/50 shadow-lg shadow-orange-500/10 backdrop-blur-xl' : 'bg-white/[0.03] border-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-extrabold text-white text-base">{msg.nom}</h4>
                                            <p className="text-xs text-orange-400 font-mono mt-0.5">{msg.email} {msg.telephone ? `• ${msg.telephone}` : ''}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {!msg.lu && (
                                                <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">Non lu</span>
                                            )}
                                            {msg.traite && (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">Traité</span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-300 font-medium mb-4 line-clamp-3 bg-white/[0.04] p-3 rounded-2xl border border-white/10">
                                        "{msg.message}"
                                    </p>

                                    <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10">
                                        <span className="text-slate-500 text-[11px]">
                                            {new Date(msg.date).toLocaleString('fr-FR')}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenMessageModal(msg)}
                                                className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 font-bold text-xs transition-all"
                                            >
                                                Consulter
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className="p-1.5 rounded-xl bg-white/[0.08] hover:bg-red-500/25 text-red-300"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB 5: SITE SETTINGS */}
                {/* ========================================== */}
                {activeTab === 'settings' && (
                    <div className="max-w-4xl bg-white/[0.04] p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-xl animate-fade-in">
                        <form onSubmit={handleSaveSettings} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                        Nom de l'Établissement
                                    </label>
                                    <input
                                        type="text"
                                        value={siteSettings.schoolName || ''}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, schoolName: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                        Sigle / Acronyme
                                    </label>
                                    <input
                                        type="text"
                                        value={siteSettings.acronym || ''}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, acronym: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                        Devise Institutionnelle
                                    </label>
                                    <input
                                        type="text"
                                        value={siteSettings.tagline || ''}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                        Téléphone Principal
                                    </label>
                                    <input
                                        type="text"
                                        value={siteSettings.phonePrimary || ''}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, phonePrimary: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                        Téléphone Secondaire
                                    </label>
                                    <input
                                        type="text"
                                        value={siteSettings.phoneSecondary || ''}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, phoneSecondary: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                        Adresse Email Officielle
                                    </label>
                                    <input
                                        type="email"
                                        value={siteSettings.email || ''}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                        Adresse Géographique
                                    </label>
                                    <input
                                        type="text"
                                        value={siteSettings.address || ''}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                        Bandeau de Communiqué / Défilement
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={siteSettings.announcementTicker || ''}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, announcementTicker: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
                                >
                                    <Save className="w-4 h-4" /> Enregistrer les Modificateurs
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            {/* ========================================== */}
            {/* MODAL: NEWS EDIT / ADD */}
            {/* ========================================== */}
            {newsModalOpen && currentNews && (
                <div className="fixed inset-0 z-50 bg-blue-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {currentNews.id ? "Modifier l'article" : "Créer un nouvel article"}
                            </h3>
                            <button onClick={() => setNewsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveNews} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Titre de l'article</label>
                                <input
                                    type="text"
                                    required
                                    value={currentNews.title}
                                    onChange={(e) => setCurrentNews({ ...currentNews, title: e.target.value })}
                                    className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Catégorie</label>
                                    <select
                                        value={currentNews.category}
                                        onChange={(e) => setCurrentNews({ ...currentNews, category: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    >
                                        <option value="annonce">Annonce</option>
                                        <option value="evenement">Événement</option>
                                        <option value="reussite">Réussite</option>
                                        <option value="activite">Activité</option>
                                        <option value="information">Information</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Auteur</label>
                                    <input
                                        type="text"
                                        value={currentNews.author}
                                        onChange={(e) => setCurrentNews({ ...currentNews, author: e.target.value })}
                                        className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Image de l'article</label>
                                <div className="space-y-3">
                                    {/* Upload Zone */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-dashed border-white/20 hover:border-orange-400/60 transition-colors">
                                        {currentNews.image_url ? (
                                            <img
                                                src={currentNews.image_url}
                                                alt="Aperçu"
                                                className="w-16 h-16 rounded-xl object-cover border border-white/15 shadow-md flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-blue-950/60 border border-white/10 flex items-center justify-center text-slate-500 flex-shrink-0">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                        )}

                                        <div className="flex-1 overflow-hidden">
                                            <label
                                                htmlFor="news-image-upload"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                                            >
                                                <Upload className="w-4 h-4" /> Importer une image
                                            </label>
                                            <input
                                                id="news-image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleNewsImageUpload}
                                                className="hidden"
                                            />
                                            <p className="text-[11px] text-slate-400 mt-1.5 truncate">
                                                Formats acceptés : JPG, PNG, WEBP, GIF
                                            </p>
                                        </div>
                                    </div>

                                    {/* URL Fallback Input */}
                                    <div>
                                        <details className="text-[11px] text-slate-400">
                                            <summary className="cursor-pointer font-bold hover:text-orange-400">Ou saisir une URL d'image externe</summary>
                                            <input
                                                type="text"
                                                placeholder="https://..."
                                                value={currentNews.image_url}
                                                onChange={(e) => setCurrentNews({ ...currentNews, image_url: e.target.value })}
                                                className="w-full mt-2 p-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-400/60"
                                            />
                                        </details>
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Résumé court</label>
                                <textarea
                                    rows="2"
                                    required
                                    value={currentNews.excerpt}
                                    onChange={(e) => setCurrentNews({ ...currentNews, excerpt: e.target.value })}
                                    className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Contenu complet</label>
                                <textarea
                                    rows="5"
                                    required
                                    value={currentNews.content}
                                    onChange={(e) => setCurrentNews({ ...currentNews, content: e.target.value })}
                                    className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                />
                            </div>

                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                                    <input
                                        type="checkbox"
                                        checked={currentNews.is_published}
                                        onChange={(e) => setCurrentNews({ ...currentNews, is_published: e.target.checked })}
                                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                                    />
                                    Publier l'article immédiatement
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                                    <input
                                        type="checkbox"
                                        checked={currentNews.is_featured}
                                        onChange={(e) => setCurrentNews({ ...currentNews, is_featured: e.target.checked })}
                                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                                    />
                                    Mettre à la une
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setNewsModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 text-xs font-bold transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* MODAL: GALLERY EDIT / ADD */}
            {/* ========================================== */}
            {galleryModalOpen && currentGallery && (
                <div className="fixed inset-0 z-50 bg-blue-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-3xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {currentGallery.id ? "Modifier la photo" : "Ajouter une nouvelle photo"}
                            </h3>
                            <button onClick={() => setGalleryModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveGallery} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Titre de la photo</label>
                                <input
                                    type="text"
                                    required
                                    value={currentGallery.title}
                                    onChange={(e) => setCurrentGallery({ ...currentGallery, title: e.target.value })}
                                    className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Catégorie / Cycle</label>
                                <select
                                    value={currentGallery.cycle}
                                    onChange={(e) => setCurrentGallery({ ...currentGallery, cycle: e.target.value })}
                                    className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                >
                                    <option value="prescolaire">Préscolaire</option>
                                    <option value="elementaire">Élémentaire</option>
                                    <option value="secondaire">Secondaire</option>
                                    <option value="evenement">Événement</option>
                                    <option value="infrastructure">Infrastructure</option>
                                    <option value="general">Général</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Fichier Photo</label>
                                <div className="space-y-3">
                                    {/* Upload Zone */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-dashed border-white/20 hover:border-orange-400/60 transition-colors">
                                        {currentGallery.image ? (
                                            <img
                                                src={currentGallery.image}
                                                alt="Aperçu Photo"
                                                className="w-16 h-16 rounded-xl object-cover border border-white/15 shadow-md flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-blue-950/60 border border-white/10 flex items-center justify-center text-slate-500 flex-shrink-0">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                        )}

                                        <div className="flex-1 overflow-hidden">
                                            <label
                                                htmlFor="gallery-image-upload"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                                            >
                                                <Upload className="w-4 h-4" /> Choisir une photo
                                            </label>
                                            <input
                                                id="gallery-image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleGalleryImageUpload}
                                                className="hidden"
                                            />
                                            <p className="text-[11px] text-slate-400 mt-1.5 truncate">
                                                Formats acceptés : JPG, PNG, WEBP, GIF
                                            </p>
                                        </div>
                                    </div>

                                    {/* URL Fallback Input */}
                                    <div>
                                        <details className="text-[11px] text-slate-400">
                                            <summary className="cursor-pointer font-bold hover:text-orange-400">Ou saisir une URL d'image externe</summary>
                                            <input
                                                type="text"
                                                placeholder="https://..."
                                                value={currentGallery.image}
                                                onChange={(e) => setCurrentGallery({ ...currentGallery, image: e.target.value })}
                                                className="w-full mt-2 p-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-400/60"
                                            />
                                        </details>
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={currentGallery.description}
                                    onChange={(e) => setCurrentGallery({ ...currentGallery, description: e.target.value })}
                                    className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                />
                            </div>

                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                                    <input
                                        type="checkbox"
                                        checked={currentGallery.is_active}
                                        onChange={(e) => setCurrentGallery({ ...currentGallery, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                                    />
                                    Afficher dans la galerie
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                                    <input
                                        type="checkbox"
                                        checked={currentGallery.is_featured}
                                        onChange={(e) => setCurrentGallery({ ...currentGallery, is_featured: e.target.checked })}
                                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                                    />
                                    Photo mise en avant
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setGalleryModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 text-xs font-bold transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* MODAL: MESSAGE DETAIL */}
            {/* ========================================== */}
            {messageModalOpen && selectedMessage && (
                <div className="fixed inset-0 z-50 bg-blue-950/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Détail du message</h3>
                            <button onClick={() => setMessageModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1">
                                <p className="text-sm font-extrabold text-white">{selectedMessage.nom}</p>
                                <p className="text-orange-400 font-mono">{selectedMessage.email}</p>
                                {selectedMessage.telephone && <p className="text-slate-300">{selectedMessage.telephone}</p>}
                                <p className="text-slate-500 text-[10px] pt-1">{new Date(selectedMessage.date).toLocaleString('fr-FR')}</p>
                            </div>

                            <div>
                                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Message reçu</label>
                                <div className="p-4 rounded-2xl bg-blue-950/70 text-slate-200 leading-relaxed border border-white/10">
                                    "{selectedMessage.message}"
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Notes internes & Suivi</label>
                                <textarea
                                    rows="3"
                                    placeholder="Ajouter une note administrative (ex: Appelé le 20/08, inscrit en 2de)..."
                                    value={messageNoteInput}
                                    onChange={(e) => setMessageNoteInput(e.target.value)}
                                    className="w-full p-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-xs focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.sujet || 'Votre message au Groupe Scolaire EMD'}`}
                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5"
                                >
                                    <Mail className="w-3.5 h-3.5" /> Répondre par Email
                                </a>
                                <button
                                    onClick={handleSaveMessageNotes}
                                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Marquer comme Traité
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
