import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import logoEMD from '../assets/EMD.jpeg';

/**
 * Composant Footer - Pied de page premium
 * Liens animés, dégradé d'accent et retour en haut fluide.
 */
const quickLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/cycles', label: 'Nos cycles' },
  { to: '/contact', label: 'Contact' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/actualites', label: 'Actualités' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-blue-950 text-white overflow-hidden">
      {/* Décor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-orange-400/70 to-transparent" />
      <div className="absolute -bottom-32 -left-24 w-[380px] h-[380px] bg-orange-500/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-[320px] h-[320px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* À propos */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoEMD}
                alt="Logo EMD"
                className="w-12 h-12 object-cover rounded-full shadow-lg ring-2 ring-orange-400/40"
              />
              <h3 className="text-lg font-black tracking-tight">
                Groupe Scolaire{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">EMD</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Excellence, Motivation et Discipline - Notre école offre une
              éducation de qualité du préscolaire au secondaire, formant les
              leaders de demain.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-4">
              Liens rapides
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1.5 text-gray-300 hover:text-orange-400 transition-colors text-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    <span className="-ml-5 group-hover:ml-0 transition-all duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-4">
              Contactez-nous
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start group">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-orange-500/20 group-hover:border-orange-400/30 transition-colors">
                  <Mail className="w-4 h-4 text-orange-400" />
                </span>
                <a
                  href="mailto:dieyebabacar802@gmail.com"
                  className="hover:text-orange-400 transition-colors pt-1.5 break-all"
                >
                  dieyebabacar802@gmail.com
                </a>
              </li>
              <li className="flex items-start group">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-orange-500/20 group-hover:border-orange-400/30 transition-colors">
                  <Phone className="w-4 h-4 text-orange-400" />
                </span>
                <div className="pt-1.5 space-y-0.5">
                  <a href="tel:+221774701535" className="block hover:text-orange-400 transition-colors">(+221) 77 470 15 35</a>
                  <a href="tel:+221763073754" className="block hover:text-orange-400 transition-colors">(+221) 76 307 37 54</a>
                </div>
              </li>
              <li className="flex items-start group">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-orange-500/20 group-hover:border-orange-400/30 transition-colors">
                  <MapPin className="w-4 h-4 text-orange-400" />
                </span>
                <span className="pt-1.5">Thiès, Tableau Bakhdad</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-400">
            © {currentYear} Groupe Scolaire El Hadji Malick Dieye. Tous droits réservés.
          </p>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <p className="text-xs text-gray-500">
              Année scolaire 2026-2027
            </p>
            <p className="text-xs text-gray-500">
              Site conçu par{' '}
              <a
                href="tel:+221775890622"
                className="font-semibold text-orange-400/90 hover:text-orange-300 transition-colors"
              >
                And Tekki Labs
              </a>{' '}
              —{' '}
              <a href="tel:+221775890622" className="hover:text-orange-300 transition-colors">
                77 589 06 22
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
