import { Sparkles } from 'lucide-react';
import Reveal from './Reveal';

/**
 * Héro commun à toutes les pages : fond dégradé sombre, motif grille,
 * halos aurora animés, formes flottantes et titre dégradé shimmer.
 */
const PageHero = ({ badge, title, highlight, children }) => (
  <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white py-28 overflow-hidden">
    <div className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)] pointer-events-none" />
    <div className="absolute -top-32 -right-24 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
    <div className="absolute -bottom-40 -left-24 w-[420px] h-[420px] bg-blue-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

    {/* Formes décoratives flottantes */}
    <div className="absolute top-16 left-10 w-14 h-14 border-2 border-orange-400/30 rounded-xl rotate-12 animate-float pointer-events-none" />
    <div className="absolute top-32 right-16 w-8 h-8 bg-orange-400/20 rounded-full animate-float-delay-1 pointer-events-none" />
    <div className="absolute bottom-16 right-12 w-16 h-16 border border-blue-400/20 rounded-full animate-float-delay-2 pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
      <Reveal>
        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-bold uppercase tracking-widest mb-8 shadow backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          {badge}
          <Sparkles className="w-3.5 h-3.5 ml-1 text-orange-300" />
        </span>
      </Reveal>

      <Reveal delay={120}>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
          <span className="block text-white">{title}</span>
          <span className="block bg-gradient-to-r from-orange-300 via-amber-300 to-orange-400 bg-clip-text text-transparent mt-2 text-shimmer">
            {highlight}
          </span>
        </h1>
      </Reveal>

      {children && (
        <Reveal delay={240}>
          <p className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto font-light leading-relaxed">
            {children}
          </p>
        </Reveal>
      )}
    </div>
  </section>
);

export default PageHero;
