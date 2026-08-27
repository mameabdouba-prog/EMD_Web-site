import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Users, Star, Award, Shield,
  ArrowRight, Heart, Sparkles, Trophy, MapPin
} from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';

/* Halo lumineux qui suit le curseur sur les cartes */
const handleSpotlight = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

/**
 * Page À propos du site EMD - Design premium cohérent avec la HomePage
 */
const AboutPage = () => {
  const whyChoose = [
    { icon: Users, title: 'Enseignants Qualifiés', desc: 'Une équipe pédagogique expérimentée et dévouée', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-400/20' },
    { icon: BookOpen, title: 'Programme Complet', desc: 'Curriculum conforme aux normes nationales sénégalaises', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-400/20' },
    { icon: GraduationCap, title: 'Infrastructures Modernes', desc: 'Salles de classe équipées et environnement propice', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-400/20' },
    { icon: Heart, title: 'Classes à Effectif Réduit', desc: 'Suivi personnalisé et attentif pour chaque élève', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-400/20' },
    { icon: Trophy, title: 'Résultats Prouvés', desc: 'Excellent taux de réussite aux examens nationaux', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-400/20' },
    { icon: Shield, title: 'Partenariat Famille-École', desc: 'Communication régulière et transparente avec les parents', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-400/20' },
  ];

  const valeurs = [
    {
      title: 'Excellence',
      label: 'Rigueur & Dépassement',
      desc: 'Nous visons l\'excellence dans tout ce que nous faisons. Nos enseignants hautement qualifiés utilisent des méthodes pédagogiques modernes pour garantir la réussite de chaque élève.',
      icon: Award,
      accent: 'border-orange-500',
      iconColor: 'text-orange-400',
      labelColor: 'text-orange-400',
      bg: 'bg-orange-500/5',
    },
    {
      title: 'Motivation',
      label: 'Curiosité & Confiance',
      desc: 'Nous croyons que la motivation est la clé du succès. Notre approche pédagogique vise à inspirer et encourager chaque élève à développer sa curiosité naturelle et son amour de l\'apprentissage.',
      icon: Sparkles,
      accent: 'border-amber-500',
      iconColor: 'text-amber-400',
      labelColor: 'text-amber-400',
      bg: 'bg-amber-500/5',
    },
    {
      title: 'Discipline',
      label: 'Respect & Responsabilité',
      desc: 'La discipline est au cœur de notre philosophie. Nous enseignons l\'importance du respect, de la ponctualité et de la persévérance pour former des citoyens exemplaires.',
      icon: Shield,
      accent: 'border-blue-400',
      iconColor: 'text-blue-400',
      labelColor: 'text-blue-400',
      bg: 'bg-blue-500/5',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <PageHero badge="Notre Histoire & Identité" title="À Propos" highlight="de l'EMD">
        Découvrez notre <span className="font-semibold text-orange-300">histoire</span>,
        notre <span className="font-semibold text-amber-300">vision</span> et
        nos <span className="font-semibold text-blue-300">valeurs fondamentales</span>
      </PageHero>

      {/* ===== HISTORIQUE ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <GraduationCap className="w-3.5 h-3.5" /> Notre Historique
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-950 mb-6 tracking-tight">
                Une école fondée sur
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"> l'Excellence</span>
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Le <strong className="text-blue-950">Groupe Scolaire El Hadji Malick Dieye (EMD)</strong> a été fondé avec
                  une vision claire : offrir une éducation de qualité accessible à tous les enfants de Thiès et
                  ses environs. Situé au cœur du quartier Tableau Bakhdad, notre établissement s'est rapidement
                  imposé comme une référence en matière d'excellence éducative.
                </p>
                <p>
                  Depuis sa création, l'EMD a formé des centaines d'élèves qui ont excellé dans leurs parcours
                  académiques et professionnels. Notre engagement envers l'éducation de qualité nous a permis
                  de bâtir une réputation solide auprès des familles de la région.
                </p>
                <p>
                  Aujourd'hui, nous continuons d'innover et d'améliorer nos méthodes pédagogiques pour répondre
                  aux défis de l'éducation moderne, tout en restant fidèles à nos valeurs fondamentales
                  d'<strong className="text-orange-600">Excellence</strong>,
                  de <strong className="text-amber-600">Motivation</strong> et
                  de <strong className="text-blue-700">Discipline</strong>.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  Nous rejoindre
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/cycles"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-blue-950/20 text-blue-950 font-bold hover:bg-blue-50 transition-all duration-300"
                >
                  Nos cycles
                </Link>
              </div>
            </Reveal>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Cycles d'Enseignement", value: '4', desc: 'Du Préscolaire au Lycée', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { label: 'Taux de Réussite', value: '95%+', desc: 'Aux examens nationaux', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
                { label: 'Enseignants', value: '20+', desc: 'Professeurs qualifiés', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
                { label: 'Localisation', value: 'Thiès', desc: 'Tableau Bakhdad', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
              ].map((stat, i) => {
                const IconComp = stat.icon;
                return (
                  <Reveal key={i} delay={i * 110}>
                    <div className={`${stat.bg} border rounded-2xl p-5 hover:scale-105 hover:shadow-lg transition-all duration-300`}>
                      <IconComp className={`w-7 h-7 mb-3 ${stat.color}`} />
                      <CountUp value={stat.value} className={`text-2xl font-black ${stat.color}`} />
                      <div className="text-xs font-bold text-slate-800 mt-1">{stat.label}</div>
                      <div className="text-[10px] text-slate-500">{stat.desc}</div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== VISION & MISSION ===== */}
      <section className="py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Star className="w-3.5 h-3.5" /> Notre boussole
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Vision &{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Mission</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <Reveal>
              <div onMouseMove={handleSpotlight} className="spotlight-card bg-white/5 backdrop-blur-sm border border-white/10 border-t-4 border-t-orange-400 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 h-full">
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Notre Vision</span>
                  <h3 className="text-2xl font-extrabold text-white mt-2 mb-4">Être la référence au Sénégal</h3>
                  <p className="text-blue-100/80 leading-relaxed">
                    Devenir l'établissement de référence au Sénégal en matière d'éducation de qualité, formant des
                    citoyens responsables, compétents et engagés, capables de contribuer positivement au développement
                    de leur communauté et de leur pays.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Mission */}
            <Reveal delay={140}>
              <div onMouseMove={handleSpotlight} className="spotlight-card bg-white/5 backdrop-blur-sm border border-white/10 border-t-4 border-t-blue-400 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 h-full">
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Notre Mission</span>
                  <h3 className="text-2xl font-extrabold text-white mt-2 mb-4">Éduquer chaque élève</h3>
                  <p className="text-blue-100/80 leading-relaxed">
                    Fournir une éducation complète et de qualité, alliant excellence académique, développement
                    personnel et valeurs morales. Nous nous engageons à créer un environnement d'apprentissage
                    stimulant où chaque élève peut s'épanouir et réaliser son plein potentiel.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== VALEURS ===== */}
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
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center mb-5 shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
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

      {/* ===== POURQUOI NOUS CHOISIR ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Shield className="w-3.5 h-3.5" /> Nos atouts
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-950 tracking-tight">
              Pourquoi Choisir <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">l'EMD</span> ?
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, index) => {
              const IconComp = item.icon;
              return (
                <Reveal key={index} delay={(index % 3) * 110}>
                  <div onMouseMove={handleSpotlight} className={`${item.bg} border rounded-2xl p-6 h-full hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 spotlight-card`}>
                    <IconComp className={`relative z-10 w-8 h-8 mb-4 ${item.color}`} />
                    <h3 className="relative z-10 font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="relative z-10 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 animate-gradient-x" />
        <div className="absolute inset-0 bg-grid-dark opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Rejoignez la famille EMD
            </h2>
            <p className="text-xl mb-8 text-orange-50 font-light">
              Inscrivez votre enfant dans une école qui fait la différence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-shine inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-orange-600 font-extrabold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Contactez-nous
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/cycles"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                Voir nos cycles
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;