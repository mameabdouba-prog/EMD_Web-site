import { Link } from 'react-router-dom';
import backImage from '../assets/right.jpeg'; // Assure-toi que le fichier est dans src/assets

/**
 * Page d'accueil du site EMD
 * Contient : Hero, Présentation, Cycles, Valeurs, CTA
 */
const HomePage = () => {
  const cycles = [
    {
      title: 'Préscolaire',
      description:
        'Un environnement bienveillant pour éveiller la curiosité et développer les premières compétences de vos enfants.',
      icon: '🎨',
      color: 'bg-blue-100 hover:bg-blue-200',
    },
    {
      title: 'Élémentaire',
      description:
        'Des bases solides en lecture, écriture et mathématiques pour construire un avenir brillant.',
      icon: '📚',
      color: 'bg-orange-100 hover:bg-orange-200',
    },
    {
      title: 'Secondaire',
      description:
        "Préparation rigoureuse aux examens nationaux avec un accompagnement personnalisé pour l'excellence.",
      icon: '🎓',
      color: 'bg-blue-100 hover:bg-blue-200',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${backImage})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 bg-black/50">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              GROUPE SCOLAIRE
              <span className="block text-orange-400 mt-2">
                EL HADJI MALICK DIEYE
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-200">
              Excellence • Motivation • Discipline
            </p>
            <p className="text-lg text-blue-100 mb-8">
              Année scolaire 2025 – 2026
            </p>
            <Link
              to="/contact"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              Bienvenue à l'EMD
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Le Groupe Scolaire El Hadji Malick Dieye est une institution
              éducative d'excellence située à Thiès, engagée dans la formation
              de citoyens responsables et compétents. Nous offrons un
              environnement d'apprentissage stimulant du préscolaire au
              secondaire, où chaque élève peut développer son plein potentiel.
            </p>
          </div>
        </div>
      </section>

      {/* Cycles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-12">
            Nos Cycles d'Enseignement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cycles.map((cycle, index) => (
              <div
                key={index}
                className={`${cycle.color} p-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer`}
              >
                <div className="text-5xl mb-4 text-center">{cycle.icon}</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                  {cycle.title}
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  {cycle.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/cycles"
              className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              En savoir plus sur nos cycles
            </Link>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Excellence</h3>
              <p className="text-blue-100">
                Nous visons l'excellence académique et personnelle pour chaque élève
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Motivation</h3>
              <p className="text-blue-100">
                Nous inspirons et encourageons nos élèves à donner le meilleur d'eux-mêmes
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Discipline</h3>
              <p className="text-blue-100">
                Nous cultivons la rigueur et le respect pour former des citoyens responsables
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez-nous pour l'année 2025-2026
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Inscrivez votre enfant dans une école qui fait la différence
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-orange-500 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors duration-300 shadow-lg"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
