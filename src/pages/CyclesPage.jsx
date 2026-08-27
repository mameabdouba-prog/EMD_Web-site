import { Link } from 'react-router-dom';
import {
  Heart, BookOpen, BookMarked, GraduationCap,
  ArrowRight, ChevronRight, Phone
} from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';

/**
 * Page Cycles du site EMD - Design premium cohérent avec la HomePage
 */
const CyclesPage = () => {
  const cycles = [
    {
      title: 'Préscolaire',
      subtitle: 'Éveil & Curiosité (2 – 5 ans)',
      icon: Heart,
      colorAccent: 'border-t-4 border-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-200 border border-blue-400/40',
      sectionBg: 'bg-white',
      description:
        "Le cycle préscolaire accueille les enfants dans un environnement chaleureux et stimulant. C'est une période cruciale pour le développement de l'enfant, alliant éveil des sens et socialisation douce.",
      objectifs: [
        'Développer les capacités motrices et sensorielles',
        "Stimuler la créativité et l'imagination",
        'Favoriser la socialisation et le vivre-ensemble',
        'Initier au langage oral et écrit',
        'Éveiller la curiosité scientifique',
        "Développer l'autonomie et la confiance en soi",
      ],
      activites: [
        'Jeux éducatifs et ludiques',
        'Arts plastiques et créativité',
        'Chants et comptines',
        "Initiation à la lecture et à l'écriture",
        'Activités psychomotrices',
        'Sorties pédagogiques',
      ],
      iconColor: 'text-blue-400',
    },
    {
      title: 'Élémentaire',
      subtitle: 'Bases Solides & Réussite (6 – 11 ans)',
      icon: BookOpen,
      colorAccent: 'border-t-4 border-orange-400',
      badgeBg: 'bg-orange-500/20 text-orange-200 border border-orange-400/40',
      sectionBg: 'bg-gradient-to-br from-slate-50 to-blue-50',
      description:
        "Le cycle élémentaire couvre six années d'apprentissage fondamental. C'est durant cette période que les élèves acquièrent les bases essentielles en lecture, écriture et mathématiques.",
      objectifs: [
        "Maîtriser la lecture, l'écriture et le calcul",
        "Développer l'esprit critique et analytique",
        'Acquérir une culture générale solide',
        'Apprendre les langues (français, arabe)',
        'Développer les compétences scientifiques',
        'Former à la citoyenneté et au respect',
      ],
      activites: [
        'Cours de français et mathématiques renforcés',
        "Enseignement de l'arabe",
        'Sciences et découverte du monde',
        'Éducation physique et sportive',
        'Informatique et nouvelles technologies',
        'Clubs et activités parascolaires',
      ],
      iconColor: 'text-orange-400',
    },
    {
      title: 'Moyen',
      subtitle: 'Consolidation & Brevet (12 – 15 ans)',
      icon: BookMarked,
      colorAccent: 'border-t-4 border-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-200 border border-amber-400/40',
      sectionBg: 'bg-white',
      description:
        "Un enseignement renforcé par matières spécialisées préparant activement les élèves à l'examen du BFEM. Méthodologie rigoureuse et accompagnement personnalisé.",
      objectifs: [
        'Préparer efficacement au BFEM',
        'Approfondir les connaissances disciplinaires',
        "Développer l'esprit de recherche et d'analyse",
        'Maîtriser les sciences et les langues vivantes',
        'Former à la méthodologie de travail',
        "Renforcer l'autonomie intellectuelle",
      ],
      activites: [
        'Enseignement conforme aux programmes officiels',
        'Cours de préparation BFEM',
        'Accompagnement personnalisé',
        'Travaux pratiques en sciences',
        'Préparation aux concours',
        'Tutorat et soutien scolaire',
      ],
      iconColor: 'text-amber-400',
    },
    {
      title: 'Secondaire (Lycée)',
      subtitle: 'Excellence & Examens (16 – 18 ans)',
      icon: GraduationCap,
      colorAccent: 'border-t-4 border-indigo-400',
      badgeBg: 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40',
      sectionBg: 'bg-gradient-to-br from-slate-50 to-blue-50',
      description:
        "Une préparation académique rigoureuse (Séries L & S) visant le Baccalauréat. Nous assurons un accompagnement personnalisé pour garantir l'accès de nos élèves aux études supérieures.",
      objectifs: [
        'Préparer les élèves au Baccalauréat (L & S)',
        'Approfondir les connaissances académiques',
        "Développer l'esprit critique et de synthèse",
        "Orienter vers les filières d'excellence",
        'Former à la recherche et à l\'autonomie',
        "Préparer à l'enseignement supérieur",
      ],
      activites: [
        'Enseignement conforme aux programmes officiels',
        'Bac Blancs & concours entraînements',
        'Tutorat et orientation universitaire',
        'Travaux pratiques en sciences',
        'Conférences et sorties académiques',
        'Accompagnement psychologique et scolaire',
      ],
      iconColor: 'text-indigo-400',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <PageHero badge="Formation complète" title="Nos Cycles" highlight="d'Enseignement">
        Du <span className="font-semibold text-blue-300">Préscolaire</span> au{' '}
        <span className="font-semibold text-orange-300">Secondaire</span>, un parcours d'excellence
        pensé pour chaque étape de la vie de votre enfant.
      </PageHero>

      {/* ===== CYCLES DÉTAILLÉS ===== */}
      {cycles.map((cycle, index) => {
        const IconComp = cycle.icon;
        const isReversed = index % 2 === 1;
        return (
          <section key={index} className={`py-20 ${cycle.sectionBg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${isReversed ? 'direction-rtl' : ''}`}>

                {/* ---- Contenu ---- */}
                <Reveal className={isReversed ? 'lg:order-2' : ''}>
                  {/* Badge index */}
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                    <BookOpen className="w-3.5 h-3.5" /> Cycle {index + 1} / 4
                  </span>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center shadow-lg flex-shrink-0 hover:rotate-6 hover:scale-110 transition-transform duration-300">
                      <IconComp className={`w-7 h-7 ${cycle.iconColor}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-blue-950">{cycle.title}</h2>
                      <span className="text-sm text-slate-500">{cycle.subtitle}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                    {cycle.description}
                  </p>

                  {/* Objectifs */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-4">
                      Objectifs pédagogiques
                    </h3>
                    <ul className="space-y-2">
                      {cycle.objectifs.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-sm">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                {/* ---- Activités ---- */}
                <Reveal delay={150} className={isReversed ? 'lg:order-1' : ''}>
                  <div className={`${cycle.colorAccent} bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <IconComp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-white">{cycle.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${cycle.badgeBg} font-bold`}>{cycle.subtitle}</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-orange-300 mb-4">
                      Activités & Programmes
                    </h4>
                    <ul className="space-y-3">
                      {cycle.activites.map((act, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                          <span className="text-blue-100/80 text-sm">{act}</span>
                        </li>
                      ))}
                     </ul>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* ===== CTA ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 animate-gradient-x" />
        <div className="absolute inset-0 bg-grid-dark opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Inscrivez Votre Enfant Dès Maintenant
            </h2>
            <p className="text-xl mb-8 text-orange-50 font-light">
              Donnez à votre enfant les meilleures chances de réussite
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-shine inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-orange-600 font-extrabold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Nous contacter pour une inscription
              </Link>
              <Link
                to="/a-propos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default CyclesPage;