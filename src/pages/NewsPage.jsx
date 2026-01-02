import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNewsArticles } from '../services/api';

/**
 * Page Actualités - Liste des articles d'actualité
 */
const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Toutes les actualités' },
    { value: 'annonce', label: 'Annonces' },
    { value: 'evenement', label: 'Événements' },
    { value: 'reussite', label: 'Réussites' },
    { value: 'activite', label: 'Activités' },
    { value: 'information', label: 'Informations' },
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [selectedCategory, articles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await getNewsArticles();
      if (response.success) {
        setArticles(response.data);
        setFilteredArticles(response.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des actualités:', err);
      setError('Impossible de charger les actualités. Vérifiez que le backend est lancé.');
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (selectedCategory === 'all') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article => article.category === selectedCategory);
      setFilteredArticles(filtered);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      annonce: 'bg-blue-100 text-blue-800',
      evenement: 'bg-purple-100 text-purple-800',
      reussite: 'bg-green-100 text-green-800',
      activite: 'bg-orange-100 text-orange-800',
      information: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Actualités</h1>
          <p className="text-xl text-blue-200">
            Suivez toutes les nouvelles et événements de notre école
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des actualités */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Chargement des actualités...</p>
            </div>
          )}

          {/* Erreur */}
          {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
              <p className="font-semibold">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Aucun article */}
          {!loading && !error && filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-24 h-24 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <p className="text-gray-600 text-lg">
                Aucune actualité dans cette catégorie pour le moment.
              </p>
            </div>
          )}

          {/* Grille d'articles responsive */}
          {!loading && !error && filteredArticles.length > 0 && (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  {filteredArticles.length} actualité{filteredArticles.length > 1 ? 's' : ''}{' '}
                  {selectedCategory !== 'all' && `dans la catégorie "${categories.find(c => c.value === selectedCategory)?.label}"`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/actualites/${article.slug}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    {/* Image */}
                    {article.image_url && (
                      <div className="relative overflow-hidden w-full h-48 sm:h-56 md:h-52 lg:h-60">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {article.is_featured && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            ★ À la une
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contenu */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Catégorie et date */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                            {article.category_display}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(article.published_date)}
                          </span>
                        </div>

                        {/* Titre */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        {/* Extrait */}
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-gray-500">Par {article.author}</span>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          {article.views_count}
                        </div>
                      </div>

                      {/* Bouton Lire la suite */}
                      <div className="mt-4">
                        <span className="text-orange-500 font-semibold group-hover:underline">
                          Lire la suite →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
