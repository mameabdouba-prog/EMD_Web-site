import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getNewsArticles } from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { Newspaper, ArrowRight } from 'lucide-react';

/**
 * Page Actualités - Design premium cohérent avec la HomePage
 */
const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => [
    { value: 'all', label: 'Toutes les actualités' },
    { value: 'annonce', label: 'Annonces' },
    { value: 'evenement', label: 'Événements' },
    { value: 'reussite', label: 'Réussites' },
    { value: 'activite', label: 'Activités' },
    { value: 'information', label: 'Informations' },
  ], []);

  const counts = useMemo(() => {
    const res = { all: articles.length };
    categories.forEach(cat => {
      if (cat.value !== 'all') {
        res[cat.value] = articles.filter(art => art.category === cat.value).length;
      }
    });
    return res;
  }, [articles, categories]);

  useEffect(() => { fetchArticles(); }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(a => a.category === selectedCategory));
    }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
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

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <PageHero badge="Toute l'actualité de l'EMD" title="Nos" highlight="Actualités">
        Suivez toutes les <span className="font-semibold text-orange-300">nouvelles</span> et{' '}
        <span className="font-semibold text-amber-300">événements</span> de notre école.
      </PageHero>

      {/* ===== FILTRES ===== */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        counts={counts}
        totalCount={articles.length}
        label="Filtrer par catégorie :"
      />

      {/* ===== LISTE DES ACTUALITÉS ===== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-orange-500/30 border-t-orange-500 mb-4" />
              <p className="text-slate-500 font-medium">Chargement des actualités...</p>
            </div>
          )}

          {/* Erreur */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center">
              <p className="font-semibold mb-1">Erreur de chargement</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Aucun article */}
          {!loading && !error && filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">Aucune actualité dans cette catégorie pour le moment.</p>
            </div>
          )}

          {/* Grille d'articles */}
          {!loading && !error && filteredArticles.length > 0 && (
            <>
              <div className="text-center mb-10">
                <p className="text-slate-500 text-sm">
                  <span className="font-bold text-blue-950 text-base">{filteredArticles.length}</span>{' '}
                  actualité{filteredArticles.length > 1 ? 's' : ''}{' '}
                  {selectedCategory !== 'all' && (
                    <span>dans «{' '}
                      <span className="font-semibold text-orange-600">
                        {categories.find(c => c.value === selectedCategory)?.label}
                      </span> »
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <Reveal key={article.id} delay={(index % 3) * 90} y={20}>
                    <Link
                      to={`/actualites/${article.slug}`}
                      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
                    >
                    {/* Image */}
                    {article.image_url && (
                      <div className="relative overflow-hidden h-52">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {article.is_featured && (
                          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                            ★ À la une
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contenu */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryStyle(article.category)}`}>
                            {article.category_display}
                          </span>
                          <span className="text-xs text-slate-400">{formatDate(article.published_date)}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400">Par {article.author}</span>
                        <span className="text-orange-500 font-bold text-sm group-hover:underline flex items-center gap-1">
                          Lire <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                    </Link>
                  </Reveal>
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
