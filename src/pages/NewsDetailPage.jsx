import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsArticle, getNewsArticles } from '../services/api';

/**
 * Page de détail d'un article d'actualité
 */
const NewsDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Récupérer l'article
      const response = await getNewsArticle(slug);
      if (response.success) {
        setArticle(response.data);
        
        // Récupérer les articles similaires
        fetchRelatedArticles(response.data.category);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'article:', err);
      setError('Article non trouvé ou impossible à charger.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (category) => {
    try {
      const response = await getNewsArticles({ category, limit: 3 });
      if (response.success) {
        // Exclure l'article actuel
        const filtered = response.data.filter(a => a.slug !== slug);
        setRelatedArticles(filtered.slice(0, 3));
      }
    } catch (err) {
      console.error('Erreur lors du chargement des articles similaires:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article non trouvé</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/actualites"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            ← Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-orange-500">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/actualites" className="text-gray-500 hover:text-orange-500">
              Actualités
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <header className="mb-8">
            {/* Catégorie et featured */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(article.category)}`}>
                {article.category_display}
              </span>
              {article.is_featured && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-500 text-white">
                  ★ À la une
                </span>
              )}
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{formatDate(article.published_date)}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>{article.views_count} vues</span>
              </div>
            </div>
          </header>

          {/* Image principale */}
          {article.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Extrait */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-700 leading-relaxed italic">
              {article.excerpt}
            </p>
          </div>

          {/* Contenu */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t">
            <Link
              to="/actualites"
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux actualités
            </Link>
          </div>
        </div>
      </article>

      {/* Articles similaires */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relArticle) => (
                <Link
                  key={relArticle.id}
                  to={`/actualites/${relArticle.slug}`}
                  className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {relArticle.image_url && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={relArticle.image_url}
                        alt={relArticle.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {relArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relArticle.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsDetailPage;