import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CyclesPage from './pages/CyclesPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import './index.css';

/**
 * Composant principal de l'application
 * Gère le routing et la structure générale du site
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navigation en haut de page */}
        <Navbar />
        
        {/* Contenu principal qui s'adapte */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/cycles" element={<CyclesPage />} />
            <Route path="/galerie" element={<GalleryPage />} />
            <Route path="/actualites" element={<NewsPage />} />
            <Route path="/actualites/:slug" element={<NewsDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        
        {/* Footer en bas de page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;