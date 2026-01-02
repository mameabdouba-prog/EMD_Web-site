import { Link } from 'react-router-dom';

/**
 * Page Cycles du site EMD
 * Présente les 3 cycles : Préscolaire, Élémentaire, Secondaire
 */
const CyclesPage = () => {
  const cycles = [
    {
      title: 'Préscolaire',
      subtitle: 'Petite et Moyenne Section',
      icon: '🎨',
      color: 'blue',
      description:
        "Le cycle préscolaire accueille les enfants de 3 à 5 ans dans un environnement chaleureux et stimulant. C'est une période cruciale pour le développement de l'enfant.",
      objectifs: [
        'Développer les capacités motrices et sensorielles',
        'Stimuler la créativité et l\'imagination',
        'Favoriser la socialisation et le vivre-ensemble',
        'Initier au langage oral et écrit',
        'Éveiller la curiosité scientifique',
        'Développer l\'autonomie et la confiance en soi',
      ],
      activites: [
        'Jeux éducatifs et ludiques',
        'Arts plastiques et créativité',
        'Chants et comptines',
        'Initiation à la lecture et à l\'écriture',
        'Activités psychomotrices',
        'Sorties pédagogiques',
      ],
    },
    {
      title: 'Élémentaire',
      subtitle: 'CI au CM2',
      icon: '📚',
      color: 'orange',
      description:
        "Le cycle élémentaire couvre six années d'apprentissage fondamental. C'est durant cette période que les élèves acquièrent les bases essentielles en lecture, écriture et mathématiques.",
      objectifs: [
        'Maîtriser la lecture, l\'écriture et le calcul',
        'Développer l\'esprit critique et analytique',
        'Acquérir une culture générale solide',
        'Apprendre les langues (français, arabe)',
        'Développer les compétences scientifiques',
        'Former à la citoyenneté et au respect',
      ],
      activites: [
        'Cours de français et mathématiques renforcés',
        'Enseignement de l\'arabe',
        'Sciences et découverte du monde',
        'Éducation physique et sportive',
        'Informatique et nouvelles technologies',
        'Clubs et activités parascolaires',
      ],
    },
    {
      title: 'Secondaire',
      subtitle: '6ème à la Terminale',
      icon: '🎓',
      color: 'blue',
      description:
        "Le cycle secondaire prépare les élèves aux examens nationaux (BFEM et BAC) tout en développant leur sens critique et leur capacité d'analyse. Nous offrons un accompagnement personnalisé pour assurer la réussite de chaque élève.",
      objectifs: [
        'Préparer efficacement aux examens nationaux',
        'Approfondir les connaissances disciplinaires',
        'Développer l\'esprit de recherche et d\'analyse',
        'Orienter vers les filières appropriées',
        'Former à l\'excellence académique',
        'Préparer à l\'enseignement supérieur',
      ],
      activites: [
        'Enseignement conforme aux programmes officiels',
        'Classes de préparation BFEM et BAC',
        'Accompagnement personnalisé',
        'Orientation scolaire et professionnelle',
        'Travaux pratiques en sciences',
        'Préparation aux concours d\'entrée',
      ],
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos Cycles d'Enseignement
          </h1>
          <p className="text-xl text-blue-200">
            Du préscolaire au secondaire, un parcours d'excellence
          </p>
        </div>
      </section>

      {/* Cycles détaillés */}
      <section className="py-16">
        {cycles.map((cycle, index) => (
          <div
            key={index}
            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Contenu */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-20 h-20 ${
                        cycle.color === 'orange' ? 'bg-orange-500' : 'bg-blue-900'
                      } rounded-full flex items-center justify-center text-4xl mr-4`}
                    >
                      {cycle.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-blue-900">
                        {cycle.title}
                      </h2>
                      <p className="text-lg text-gray-600">{cycle.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {cycle.description}
                  </p>

                  {/* Objectifs */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                      Objectifs Pédagogiques
                    </h3>
                    <ul className="space-y-2">
                      {cycle.objectifs.map((obj, i) => (
                        <li key={i} className="flex items-start">
                          <svg
                            className={`w-6 h-6 ${
                              cycle.color === 'orange'
                                ? 'text-orange-500'
                                : 'text-blue-900'
                            } mr-2 flex-shrink-0 mt-0.5`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Activités */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div
                    className={`${
                      cycle.color === 'orange' ? 'bg-orange-50' : 'bg-blue-50'
                    } p-8 rounded-lg shadow-md`}
                  >
                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                      Activités et Programmes
                    </h3>
                    <ul className="space-y-3">
                      {cycle.activites.map((act, i) => (
                        <li key={i} className="flex items-start">
                          <span
                            className={`inline-block w-2 h-2 ${
                              cycle.color === 'orange'
                                ? 'bg-orange-500'
                                : 'bg-blue-900'
                            } rounded-full mr-3 mt-2 flex-shrink-0`}
                          ></span>
                          <span className="text-gray-700">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Inscrivez Votre Enfant Dès Maintenant
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Donnez à votre enfant les meilleures chances de réussite
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-orange-500 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors duration-300 shadow-lg"
          >
            Nous contacter pour une inscription
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CyclesPage;