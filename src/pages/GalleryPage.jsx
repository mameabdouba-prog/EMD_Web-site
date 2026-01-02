import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * PAGE GALERIE - VERSION API
 */
const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { value: 'all', label: 'Toutes les images' },
    { value: 'prescolaire', label: 'Préscolaire' },
    { value: 'elementaire', label: 'Élémentaire' },
    { value: 'secondaire', label: 'Secondaire' },
    { value: 'evenement', label: 'Événements' },
    { value: 'infrastructure', label: 'Infrastructures' },
    { value: 'general', label: 'Général' },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/gallery/');
        const activeImages = res.data.data.filter(img => img.is_active);
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
      const filtered = images.filter(img => img.cycle === selectedCategory);
      setFilteredImages(filtered);
    }
  }, [selectedCategory, images]);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div>
      {/* SECTION HERO */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notre Galerie</h1>
          <p className="text-xl text-blue-200">
            Découvrez la vie quotidienne et les moments forts de notre école
          </p>
        </div>
      </section>

      {/* FILTRES PAR CATÉGORIE */}
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

      {/* GRILLE D'IMAGES RESPONSIVE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Chargement des images...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
              <p className="font-semibold">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && filteredImages.length === 0 && (
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 text-lg">
                Aucune image dans cette catégorie pour le moment.
              </p>
            </div>
          )}

          {!loading && !error && filteredImages.length > 0 && (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  {filteredImages.length} image{filteredImages.length > 1 ? 's' : ''}{' '}
                  {selectedCategory !== 'all' && 
                    `dans la catégorie "${categories.find(c => c.value === selectedCategory)?.label}"`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => openLightbox(image)}
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                  >
                    <div className="aspect-w-4 aspect-h-3 relative">
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-64 sm:h-48 md:h-52 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {image.is_featured && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          ★ Mise en avant
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
                        {image.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{image.cycle_display}</p>
                      {image.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{image.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-orange-500 transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300 mb-1">{selectedImage.cycle_display}</p>
              {selectedImage.description && (
                <p className="text-gray-400 mt-2">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
