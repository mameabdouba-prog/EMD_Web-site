import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsArticle, getNewsArticles } from '../services/api';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Reveal from '../components/Reveal';

/**
 * Page de détail d'un article - Design premium cohérent avec la HomePage
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
      const response = await getNewsArticle(slug);
      if (response.success) {
        setArticle(response.data);
        fetchRelatedArticles(response.data.category);
      }
    } catch (err) {
      console.error("Erreur lors du chargement de l'article:", err);
      setError('Article non trouvé ou impossible à charger.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (category) => {
    try {
      const response = await getNewsArticles({ category, limit: 3 });
      if (response.success) {
        setRelatedArticles(response.data.filter(a => a.slug !== slug).slice(0, 3));
      }
    } catch (err) {
      console.error('Erreur articles similaires:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryStyle = (category) => {
    const styles = {
      annonce: 'bg-blue-100 text-blue-700',
      evenement: 'bg-purple-100 text-purple-700',
      reussite: 'bg-green-100 text-green-700',
      activite: 'bg-orange-100 text-orange-700',
      information: 'bg-slate-100 text-slate-700',
    };
    return styles[category] || 'bg-slate-100 text-slate-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-orange-500/30 border-t-orange-500 mb-4" />
          <p className="text-slate-500 font-medium">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-2xl font-black text-blue-950 mb-3">Article non trouvé</h2>
          <p className="text-slate-500 mb-8">{error}</p>
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      {/* ===== HERO ARTICLE ===== */}
      {article.image_url ? (
        <div className="relative h-[50vh] min-h-[350px] overflow-hidden bg-blue-950">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/50 to-blue-950/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryStyle(article.category)}`}>
                    {article.category_display}
                  </span>
                  {article.is_featured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                      ★ À la une
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                  {article.title}
                </h1>
              </Reveal>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryStyle(article.category)}`}>
                  {article.category_display}
                </span>
                {article.is_featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                    ★ À la une
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                {article.title}
              </h1>
            </Reveal>
          </div>
        </div>
      )}

      {/* ===== ARTICLE CONTENT ===== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-orange-500 transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/actualites" className="hover:text-orange-500 transition-colors">Actualités</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Métadonnées */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-orange-500" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>{formatDate(article.published_date)}</span>
          </div>
        </div>

        {/* Extrait */}
        <Reveal>
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 border-l-4 border-orange-500 p-6 mb-10 rounded-r-2xl">
            <p className="text-lg text-slate-700 leading-relaxed italic">
              {article.excerpt}
            </p>
          </div>
        </Reveal>

        {/* Contenu */}
        <div className="prose prose-lg max-w-none">
          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base">
            {article.content}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-blue-950/20 text-blue-950 font-bold hover:bg-blue-50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </Link>
        </div>
      </div>

      {/* ===== ARTICLES SIMILAIRES ===== */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                Articles similaires
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
                Vous pourriez aussi{' '}
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">aimer</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relArticle, index) => (
                <Reveal key={relArticle.id} delay={index * 110}>
                  <Link
                    to={`/actualites/${relArticle.slug}`}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 block"
                  >
                    {relArticle.image_url && (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={relArticle.image_url}
                          alt={relArticle.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {relArticle.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{relArticle.excerpt}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsDetailPage;