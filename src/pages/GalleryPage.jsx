import { useState, useEffect, useMemo } from 'react';
import { getGalleryImages } from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Lightbox from '../components/Lightbox';
import { Image } from 'lucide-react';

/**
 * PAGE GALERIE - Design premium cohérent avec la HomePage
 */
const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = useMemo(() => [
    { value: 'all', label: 'Toutes les images' },
    { value: 'prescolaire', label: 'Préscolaire' },
    { value: 'elementaire', label: 'Élémentaire' },
    { value: 'secondaire', label: 'Secondaire' },
    { value: 'evenement', label: 'Événements' },
    { value: 'infrastructure', label: 'Infrastructures' },
    { value: 'general', label: 'Général' },
  ], []);

  const counts = useMemo(() => {
    const res = { all: images.length };
    categories.forEach(cat => {
      if (cat.value !== 'all') {
        res[cat.value] = images.filter(img => img.cycle === cat.value || img.category === cat.value).length;
      }
    });
    return res;
  }, [images, categories]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const payload = await getGalleryImages();
        const activeImages = (payload?.data || []).filter(img => img.is_active);
        setImages(activeImages);
        setFilteredImages(activeImages);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les images depuis le serveur.');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.cycle === selectedCategory));
    }
  }, [selectedCategory, images]);

  /* Verrouille le défilement de la page tant que la lightbox est ouverte */
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [lightboxIndex]);

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <PageHero badge="Vie Scolaire en Images" title="Notre" highlight="Galerie">
        Découvrez la <span className="font-semibold text-orange-300">vie quotidienne</span> et les{' '}
        <span className="font-semibold text-amber-300">moments forts</span> de notre école en images.
      </PageHero>

      {/* ===== FILTRES PAR CATÉGORIE ===== */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        counts={counts}
        totalCount={images.length}
        label="Filtrer par cycle :"
      />

      {/* ===== GRILLE D'IMAGES ===== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-orange-500/30 border-t-orange-500 mb-4" />
              <p className="text-slate-500 font-medium">Chargement des images...</p>
            </div>
          )}

          {/* Erreur */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center">
              <p className="font-semibold mb-1">Erreur de chargement</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Aucune image */}
          {!loading && !error && filteredImages.length === 0 && (
            <div className="text-center py-20">
              <Image className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">Aucune image dans cette catégorie pour le moment.</p>
            </div>
          )}

          {/* Grille */}
          {!loading && !error && filteredImages.length > 0 && (
            <>
              <div className="text-center mb-10">
                <p className="text-slate-500 text-sm">
                  <span className="font-bold text-blue-950 text-base">{filteredImages.length}</span>{' '}
                  image{filteredImages.length > 1 ? 's' : ''}{' '}
                  {selectedCategory !== 'all' && (
                    <span>dans la catégorie «{' '}
                      <span className="font-semibold text-orange-600">
                        {categories.find(c => c.value === selectedCategory)?.label}
                      </span> »
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredImages.map((image, index) => (
                  <Reveal key={image.id} delay={(index % 4) * 80} y={20}>
                    <div
                      onClick={() => setLightboxIndex(index)}
                      className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white"
                    >
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={image.image}
                        alt={image.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-sm font-bold">{image.title}</span>
                      </div>
                      {image.is_featured && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                          ★ À la une
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-orange-600 transition-colors">{image.title}</h3>
                      <p className="text-xs text-slate-500">{image.cycle_display}</p>
                    </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
};

export default GalleryPage;
