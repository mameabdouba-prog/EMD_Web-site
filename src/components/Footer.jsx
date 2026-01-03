import { Link } from 'react-router-dom';

/**
 * Composant Footer - Pied de page du site
 * Contient les liens, informations de contact et copyright
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">
              Groupe Scolaire EMD
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Excellence, Motivation et Discipline - Notre école offre une
              éducation de qualité du préscolaire au secondaire, formant les
              leaders de demain.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/a-propos"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  to="/cycles"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                >
                  Nos cycles
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/Galerie"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                >
                  Galerie
                </Link>
              </li>
              <li>
                <Link
                  to="/Actualites"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                >
                  Actualités
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">
              Contactez-nous
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a
                  href="mailto:dieyebabacar802@gmail.com"
                  className="hover:text-orange-400 transition-colors"
                >
                  dieyebabacar802@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <div>(+221) 77 470 15 35</div>
                  <div>(+221) 76 307 37 54</div>
                </div>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Thiès, Tableau Bakhdad</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} Groupe Scolaire El Hadji Malick Dieye. Tous droits
            réservés.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Année scolaire 2025 – 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;