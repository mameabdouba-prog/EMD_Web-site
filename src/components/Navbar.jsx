import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoEMD from '../assets/EMD.jpeg'; // Assure-toi que le fichier est dans src/assets et idéalement renommé sans espaces, ex: EMD.jpeg

/**
 * Composant de navigation principal
 * Responsive avec menu mobile
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/cycles', label: 'Cycles' },
    { path: '/galerie', label: 'Galerie' },
    { path: '/actualites', label: 'Actualités' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/actualites') {
      return location.pathname.startsWith('/actualites');
    }
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo et nom */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <img
              src={logoEMD}
              alt="Logo EMD"
              className="w-12 h-12 object-cover rounded-full shadow-md"
            />
            <div className="hidden md:block">
              <div className="font-bold text-lg leading-tight">
                GROUPE SCOLAIRE
              </div>
              <div className="text-sm text-orange-400">
                El Hadji Malick Dieye
              </div>
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'hover:bg-blue-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-blue-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-orange-500 text-white'
                    : 'hover:bg-blue-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
