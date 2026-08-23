import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoEMD from '../assets/EMD.jpeg';
import { Menu, X, Sparkles } from 'lucide-react';

/**
 * Composant de navigation principal
 * Glassmorphism au scroll, barre de progression de lecture,
 * menu mobile animé en accordéon.
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/cycles', label: 'Cycles' },
    { path: '/galerie', label: 'Galerie' },
    { path: '/actualites', label: 'Actualités' },
    { path: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(window.scrollY / total, 1) : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Ferme le menu mobile à chaque changement de page */
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/actualites') return location.pathname.startsWith('/actualites');
    return location.pathname === path;
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-blue-950/80 backdrop-blur-xl shadow-xl shadow-blue-950/30 border-b border-white/10'
        : 'bg-blue-950 border-b border-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

          {/* Logo et nom */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity group">
            <img
              src={logoEMD}
              alt="Logo EMD"
              className="w-12 h-12 object-cover rounded-full shadow-md ring-2 ring-orange-400/30 group-hover:ring-orange-400/70 group-hover:scale-105 transition-all duration-300"
            />
            <div className="hidden md:block">
              <div className="font-black text-white text-base leading-tight tracking-wide">
                GROUPE SCOLAIRE
              </div>
              <div className="text-sm font-semibold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                El Hadji Malick Dieye
              </div>
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive(link.path)
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="btn-shine ml-3 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-500/25 hover:scale-105 hover:shadow-orange-500/40 transition-all duration-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Inscription
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 active:scale-90 transition-all"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <div className="relative w-6 h-6">
              <Menu className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Barre de progression de lecture */}
      <div
        className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 origin-left transition-[width] duration-150 ease-out rounded-full"
        style={{ width: `${progress * 100}%`, opacity: scrolled || isOpen ? 1 : 0 }}
      />

      {/* Menu mobile animé */}
      <div className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${isOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="bg-blue-900/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 pt-3 pb-5 space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: `${index * 40}ms` }}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'} ${isActive(link.path)
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block mt-3 px-4 py-3 rounded-xl text-center text-base font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg active:scale-95 transition-transform"
            >
              Inscription 2026-2027
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
