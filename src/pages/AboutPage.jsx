/**
 * Page À propos du site EMD
 * Contient : Historique, Vision, Mission, Valeurs détaillées
 */
const AboutPage = () => {
    return (
      <div>
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">À Propos de Nous</h1>
            <p className="text-xl text-blue-200">
              Découvrez notre histoire, notre vision et nos valeurs
            </p>
          </div>
        </section>
  
        {/* Historique */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
              Notre Historique
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6 leading-relaxed">
                Le Groupe Scolaire El Hadji Malick Dieye (EMD) a été fondé avec
                une vision claire : offrir une éducation de qualité accessible à
                tous les enfants de Thiès et ses environs. Situé au cœur du
                quartier Tableau Bakhdad, notre établissement s'est rapidement
                imposé comme une référence en matière d'excellence éducative.
              </p>
              <p className="mb-6 leading-relaxed">
                Depuis sa création, l'EMD a formé des centaines d'élèves qui ont
                excellé dans leurs parcours académiques et professionnels. Notre
                engagement envers l'éducation de qualité nous a permis de bâtir
                une réputation solide auprès des familles de la région.
              </p>
              <p className="leading-relaxed">
                Aujourd'hui, nous continuons d'innover et d'améliorer nos méthodes
                pédagogiques pour répondre aux défis de l'éducation moderne, tout
                en restant fidèles à nos valeurs fondamentales d'Excellence, de
                Motivation et de Discipline.
              </p>
            </div>
          </div>
        </section>
  
        {/* Vision & Mission */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Vision */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  Notre Vision
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Devenir l'établissement de référence au Sénégal en matière
                  d'éducation de qualité, formant des citoyens responsables,
                  compétents et engagés, capables de contribuer positivement au
                  développement de leur communauté et de leur pays.
                </p>
              </div>
  
              {/* Mission */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  Notre Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Fournir une éducation complète et de qualité, alliant excellence
                  académique, développement personnel et valeurs morales. Nous nous
                  engageons à créer un environnement d'apprentissage stimulant où
                  chaque élève peut s'épanouir et réaliser son plein potentiel.
                </p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Valeurs détaillées */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">
              Nos Valeurs Fondamentales
            </h2>
            <div className="space-y-8">
              {/* Excellence */}
              <div className="bg-blue-50 p-8 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">★</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-blue-900 mb-3">
                      Excellence
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Nous visons l'excellence dans tout ce que nous faisons. Nos
                      enseignants hautement qualifiés utilisent des méthodes
                      pédagogiques modernes et éprouvées pour garantir la réussite
                      de chaque élève. Nous encourageons nos élèves à se dépasser
                      et à atteindre leurs objectifs académiques les plus
                      ambitieux.
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Motivation */}
              <div className="bg-orange-50 p-8 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">⚡</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-blue-900 mb-3">
                      Motivation
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Nous croyons que la motivation est la clé du succès. Notre
                      approche pédagogique vise à inspirer et à encourager chaque
                      élève à développer sa curiosité naturelle et son amour de
                      l'apprentissage. Nous créons un environnement positif où les
                      élèves se sentent valorisés et soutenus dans leurs efforts.
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Discipline */}
              <div className="bg-blue-50 p-8 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">✓</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-blue-900 mb-3">
                      Discipline
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      La discipline est au cœur de notre philosophie éducative.
                      Nous enseignons à nos élèves l'importance du respect, de la
                      ponctualité, de l'organisation et de la persévérance. Ces
                      valeurs les préparent non seulement à réussir dans leurs
                      études, mais aussi dans leur vie future en tant que citoyens
                      responsables.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Pourquoi nous choisir */}
        <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Pourquoi Choisir l'EMD ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-bold mb-2">Enseignants Qualifiés</h3>
                <p className="text-blue-100">
                  Une équipe pédagogique expérimentée et dévouée
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-bold mb-2">Programme Complet</h3>
                <p className="text-blue-100">
                  Curriculum conforme aux normes nationales
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏫</div>
                <h3 className="text-xl font-bold mb-2">Infrastructures Modernes</h3>
                <p className="text-blue-100">
                  Salles de classe équipées et environnement propice
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2">Classes à Effectif Réduit</h3>
                <p className="text-blue-100">
                  Suivi personnalisé de chaque élève
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Résultats Prouvés</h3>
                <p className="text-blue-100">
                  Excellent taux de réussite aux examens
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-2">Partenariat Famille-École</h3>
                <p className="text-blue-100">
                  Communication régulière avec les parents
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  export default AboutPage;