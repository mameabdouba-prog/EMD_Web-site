import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backImage from '../assets/right.jpeg';
import adminDataService from '../services/adminDataService';
import {
  GraduationCap, BookOpen, Users, MapPin, Star, Award, Shield,
  ChevronRight, ArrowRight, Newspaper, Image, Phone, Sparkles, Trophy, Heart, BookMarked
} from 'lucide-react';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';

/* Halo lumineux qui suit le curseur sur les cartes */
const handleSpotlight = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

const HomePage = () => {
  const [recentNews, setRecentNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const data = await adminDataService.getPublishedNews();
        const published = (data || []).filter(item => item.is_published !== false);
        setRecentNews(published.slice(0, 3));
      } catch (err) {
        console.error('Erreur actualités accueil:', err);
      } finally {
        setNewsLoading(false);
      }
    };

    const fetchGallery = async () => {
      try {
        setGalleryLoading(true);
        const data = await adminDataService.getActiveGallery();
        const activeImages = (data || []).filter((img) => img.is_active !== false);
        setGalleryImages(activeImages.slice(0, 4));
      } catch (err) {
        console.error('Erreur galerie accueil:', err);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchNews();
    fetchGallery();
  }, []);


  const cycles = [
    {
      title: 'Préscolaire',
      subtitle: 'Éveil & Curiosité (2 - 5 ans)',
      description: "Un environnement stimulant et bienveillant pour développer l'autonomie, le langage et la créativité des tout-petits.",
      accent: 'border-t-4 border-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-200 border border-blue-400/40',
      icon: Heart,
      features: ['Éveil créatif & psychomoteur', 'Socialisation douce', 'Activités ludiques'],
    },
    {
      title: 'Élémentaire',
      subtitle: 'Bases Solides & Réussite (6 - 11 ans)',
      description: 'Un apprentissage structuré en lecture, écriture et mathématiques pour poser des fondations durables et solides.',
      accent: 'border-t-4 border-orange-400',
      badgeBg: 'bg-orange-500/20 text-orange-200 border border-orange-400/40',
      icon: BookOpen,
      features: ['Maîtrise des fondamentaux', 'Encadrement attentif', 'Développement du raisonnement'],
    },
    {
      title: 'Moyen',
      subtitle: 'Consolidation & Brevet (12 - 15 ans)',
      description: 'Un enseignement renforcé par matières spécialisées préparant activement les élèves à l\'examen du BFEM.',
      accent: 'border-t-4 border-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-200 border border-amber-400/40',
      icon: BookMarked,
      features: ['Sciences & Langues vivantes', 'Méthodologie de travail', 'Préparation au BFEM'],
    },
    {
      title: 'Secondaire (Lycée)',
      subtitle: 'Excellence & Examens (16 - 18 ans)',
      description: 'Une préparation académique rigoureuse (Séries L & S) pour le Baccalauréat et l\'accès aux études supérieures.',
      accent: 'border-t-4 border-indigo-400',
      badgeBg: 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40',
      icon: GraduationCap,
      features: ['Séries L & S spécialisées', 'Bac Blancs & Tutorat', 'Orientation universitaire'],
    },
  ];

  const stats = [
    { label: "Cycles d'Enseignement", value: '4', desc: 'Du Préscolaire au Secondaire', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Excellence Académique', value: '95%+', desc: 'Taux de réussite aux examens', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Enseignants Qualifiés', value: '20+', desc: 'Professeurs dévoués', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Localisation', value: 'Thiès', desc: 'Quartier Tableau Bakhdad', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const atouts = [
    { title: 'Excellence Académique', desc: 'Programmes conformes et préparation optimale aux examens nationaux.', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
    { title: 'Enseignants Dédiés', desc: "Équipe pédagogique qualifiée, expérimentée et à l'écoute des élèves.", icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
    { title: 'Discipline & Rigueur', desc: 'Formation du caractère : civisme, respect et ponctualité au quotidien.', icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
    { title: 'Partenariat Familles', desc: 'Un dialogue transparent et un suivi continu avec les parents.', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
  ];

  const valeurs = [
    { title: 'Excellence', desc: 'Viser le plus haut niveau académique grâce à une pédagogie exigeante et personnalisée.', label: 'Rigueur & Dépassement', icon: Award, accent: 'border-orange-500', iconColor: 'text-orange-400', labelColor: 'text-orange-400' },
    { title: 'Motivation', desc: "Susciter l'envie d'apprendre, la curiosité intellectuelle et la confiance pour réussir.", label: 'Curiosité & Confiance', icon: Sparkles, accent: 'border-amber-500', iconColor: 'text-amber-400', labelColor: 'text-amber-400' },
    { title: 'Discipline', desc: "Cultiver le respect, le goût de l'effort et la politesse pour façonner des citoyens exemplaires.", label: 'Respect & Responsabilité', icon: Shield, accent: 'border-blue-400', iconColor: 'text-blue-400', labelColor: 'text-blue-400' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white min-h-[88vh] flex items-center justify-center overflow-hidden">

        {/* Motif grille + halos aurora */}
        <div className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)] pointer-events-none" />
        <div className="absolute -top-32 -right-24 w-[560px] h-[560px] bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-24 w-[480px] h-[480px] bg-blue-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

        {/* Floating decorative shapes */}
        <div className="absolute top-16 left-10 w-14 h-14 border-2 border-orange-400/30 rounded-xl rotate-12 animate-float pointer-events-none" />
        <div className="absolute top-32 right-16 w-8 h-8 bg-orange-400/20 rounded-full animate-float-delay-1 pointer-events-none" />
        <div className="absolute bottom-24 left-20 w-20 h-20 border border-blue-400/20 rounded-full animate-float-delay-2 pointer-events-none" />
        <div className="absolute bottom-16 right-10 w-10 h-10 border-2 border-white/10 rotate-45 animate-float-delay-3 pointer-events-none" />
        <div className="absolute top-1/2 left-6 w-6 h-6 bg-white/5 rounded-full animate-float pointer-events-none" />
        <div className="absolute top-1/3 right-6 w-12 h-12 border border-orange-300/20 rounded-lg rotate-6 animate-float-delay-2 pointer-events-none" />

        {/* Background image with blue tint overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 opacity-60 transition-all duration-700"
          style={{ backgroundImage: `url(${backImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/55 to-blue-950/45" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 pb-24 text-center z-10">
          {/* Pill badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-bold uppercase tracking-widest mb-8 shadow backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              Année Scolaire 2026-2027 • Inscriptions Ouvertes
              <Sparkles className="w-3.5 h-3.5 ml-1 text-orange-300" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
              <span className="block text-white whitespace-nowrap">GROUPE SCOLAIRE</span>
              <span className="block bg-gradient-to-r from-orange-300 via-amber-300 to-orange-400 bg-clip-text text-transparent mt-2 text-shimmer">
                El Hadji Malick Dieye
              </span>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              <span className="font-semibold text-orange-300">Excellence</span> ⬢{' '}
              <span className="font-semibold text-amber-300">Motivation</span> ⬢{' '}
              <span className="font-semibold text-blue-300">Discipline</span>
              <br />
              <span className="text-sm text-blue-200/70 mt-2 block">Du Préscolaire au Secondaire – Thiès, Sénégal</span>
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="btn-shine group px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-base shadow-xl shadow-orange-500/30 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 flex items-center gap-2"
              >
                Inscriptions 2026-2027
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/a-propos"
                className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-base hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
              >
                Découvrir l'école
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Indicateur de défilement */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-blue-200/70 hidden md:flex">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Défiler</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-orange-400 scroll-dot" />
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative z-20 -mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComp = stat.icon;
              return (
                <Reveal key={index} delay={index * 100} y={36}>
                  <div className={`${stat.bg} p-5 rounded-2xl shadow-lg border border-white/80 backdrop-blur-md text-center hover:scale-105 hover:shadow-xl transition-all duration-300`}>
                    <IconComp className={`w-7 h-7 mx-auto mb-2 ${stat.color}`} />
                    <CountUp value={stat.value} className={`text-2xl sm:text-3xl font-black ${stat.color}`} />
                    <div className="text-xs font-bold text-slate-800 mt-1">{stat.label}</div>
                    <div className="text-[10px] text-slate-500">{stat.desc}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PRÉSENTATION ===== */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-orange-100/40 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
              <GraduationCap className="w-3.5 h-3.5" /> Qui sommes-nous
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-950 mb-6 tracking-tight">
              Bienvenue à <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">l'EMD</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Le Groupe Scolaire El Hadji Malick Dieye est une institution
              éducative d'excellence située à Thiès, engagée dans la formation
              de citoyens responsables et compétents. Nous offrons un
              environnement d'apprentissage stimulant du préscolaire au
              secondaire, où chaque élève peut développer son plein potentiel.
            </p>
          </Reveal>

          {/* Atouts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {atouts.map((atout, index) => {
              const IconComp = atout.icon;
              return (
                <Reveal key={index} delay={index * 110}>
                  <div
                    onMouseMove={handleSpotlight}
                    className={`${atout.bg} border rounded-2xl p-6 text-center h-full hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 spotlight-card`}
                  >
                    <div className={`relative z-10 w-12 h-12 rounded-xl ${atout.color} bg-white shadow-md flex items-center justify-center mx-auto mb-4 group-hover:scale-110`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="relative z-10 font-bold text-slate-900 mb-2">{atout.title}</h3>
                    <p className="relative z-10 text-sm text-slate-600 leading-relaxed">{atout.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CYCLES D'ENSEIGNEMENT ===== */}
      <section className="py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Formation complète
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Nos <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">4 Cycles</span> d'Enseignement
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cycles.map((cycle, index) => {
              const IconComp = cycle.icon;
              return (
                <Reveal key={index} delay={index * 110}>
                  <div
                    onMouseMove={handleSpotlight}
                    className={`${cycle.accent} bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 hover:border-white/20 hover:scale-[1.03] transition-all duration-300 spotlight-card`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <IconComp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-lg text-white">{cycle.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${cycle.badgeBg} font-bold`}>{cycle.subtitle}</span>
                        </div>
                      </div>
                      <p className="text-blue-100/80 text-sm leading-relaxed mb-4">{cycle.description}</p>
                      <ul className="space-y-1.5">
                        {cycle.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-blue-200/70">
                            <ChevronRight className="w-3 h-3 text-orange-400 flex-shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={200} className="text-center mt-12">
            <Link to="/cycles" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/20 text-white font-bold hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 transition-all duration-300">
              Détails de nos cycles <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== VALEURS EMD ===== */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" /> Notre philosophie
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-950 tracking-tight">
              Nos <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Valeurs</span> Fondamentales
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valeurs.map((val, index) => {
              const IconComp = val.icon;
              return (
                <Reveal key={index} delay={index * 140}>
                  <div className={`bg-white border-l-4 ${val.accent} rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full group`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center mb-5 shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComp className={`w-7 h-7 ${val.iconColor}`} />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${val.labelColor}`}>{val.label}</span>
                    <h3 className="text-2xl font-black text-blue-950 mt-2 mb-3">{val.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{val.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ACTUALITÉS RÉCENTES ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                  <Newspaper className="w-3.5 h-3.5" /> Actualités
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
                  Dernières <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Nouvelles</span>
                </h2>
              </div>
              <Link to="/actualites" className="group mt-4 sm:mt-0 inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
                Voir toutes les actualités <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : recentNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((article, index) => (
                <Reveal key={article.id || index} delay={index * 120}>
                  <Link to={`/actualites/${article.slug || article.id}`} className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                    {article.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img src={article.image} alt={article.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <div className="p-5">
                      {article.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-1 rounded-full">{article.category}</span>
                      )}
                      <h3 className="font-bold text-slate-900 mt-2 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{article.excerpt || article.summary}</p>
                      {article.date && <p className="text-xs text-slate-400 mt-2">{formatDate(article.date)}</p>}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">Aucune actualité disponible pour le moment.</p>
          )}
        </div>
      </section>

      {/* ===== GALERIE APERÇU ===== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-3">
                  <Image className="w-3.5 h-3.5" /> Galerie
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
                  Notre <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Vie Scolaire</span>
                </h2>
              </div>
              <Link to="/galerie" className="group mt-4 sm:mt-0 inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
                Voir la galerie complète <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          {galleryLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-200 rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((img, index) => (
                <Reveal key={img.id || index} delay={index * 100} y={20}>
                  <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-square">
                    <img src={img.image} alt={img.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 translate-y-2 group-hover:translate-y-0">
                      <span className="text-white text-sm font-bold">{img.title}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">La galerie sera bientôt disponible.</p>
          )}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 animate-gradient-x" />
        <div className="absolute inset-0 bg-grid-dark opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight drop-shadow-sm">
              Rejoignez-nous pour l'année 2026-2027
            </h2>
            <p className="text-xl mb-8 text-orange-50 font-light">
              Inscrivez votre enfant dans une école qui fait la différence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-shine inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-orange-600 font-extrabold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-5 h-5" /> Contactez-nous
              </Link>
              <Link
                to="/a-propos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                En savoir plus
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
