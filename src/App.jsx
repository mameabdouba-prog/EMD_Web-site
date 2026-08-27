import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

/*
 * Découpage du code par page : chaque page est chargée à la demande,
 * ce qui réduit fortement le poids du bundle initial.
 * La carte (leaflet, très volumineuse) n'est ainsi téléchargée
 * que lorsqu'on visite la page contact.
 */
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CyclesPage = lazy(() => import('./pages/CyclesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

import './index.css';

/* Écran d'attente minimal pendant le chargement d'une page */
const PageFallback = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
    </div>
);

/**
 * Layout public : navbar + footer autour des pages du site.
 * L'espace d'administration (/admin) possède sa propre interface
 * complète et n'affiche ni la navbar ni le footer publics.
 */
const PublicLayout = ({ children }) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    if (isAdmin) return children;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};

/**
 * Composant principal de l'application
 * Gère le routing et la structure générale du site
 */
function App() {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            {/* GESTION AUTOMATIQUE DU SCROLL */}
            <ScrollToTop />

            <PublicLayout>
                <Suspense fallback={<PageFallback />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/a-propos" element={<AboutPage />} />
                        <Route path="/cycles" element={<CyclesPage />} />
                        <Route path="/galerie" element={<GalleryPage />} />
                        <Route path="/actualites" element={<NewsPage />} />
                        <Route path="/actualites/:slug" element={<NewsDetailPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </Suspense>
            </PublicLayout>
        </Router>
    );
}

export default App;
