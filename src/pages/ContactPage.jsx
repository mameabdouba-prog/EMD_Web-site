          import { useState } from 'react';
          import { sendContactMessage } from '../services/api';
          import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
      import L from 'leaflet';
      import 'leaflet/dist/leaflet.css';

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

          /**
           * Page Contact du site EMD
           * Formulaire de contact avec validation et envoi vers Django
           */
          const ContactPage = () => {
            const [formData, setFormData] = useState({
              nom: '',
              email: '',
              message: '',
            });
            const [loading, setLoading] = useState(false);
            const [success, setSuccess] = useState(false);
            const [error, setError] = useState('');

            const handleChange = (e) => {
              setFormData({
                ...formData,
                [e.target.name]: e.target.value,
              });
              // Réinitialiser les messages
              if (error) setError('');
              if (success) setSuccess(false);
            };

            const handleSubmit = async (e) => {
              e.preventDefault();
              setLoading(true);
              setError('');
              setSuccess(false);

              try {
                const response = await sendContactMessage(formData);
                if (response.success) {
                  setSuccess(true);
                  setFormData({ nom: '', email: '', message: '' });
                  
                  // Scroll vers le haut pour voir le message de succès
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              } catch (err) {
                console.error('Erreur lors de l\'envoi:', err);
                
                if (err.response?.data?.errors) {
                  // Erreurs de validation du backend
                  const errors = err.response.data.errors;
                  const errorMessages = Object.values(errors).flat().join(', ');
                  setError(errorMessages);
                } else if (err.response?.data?.message) {
                  setError(err.response.data.message);
                } else if (err.code === 'ERR_NETWORK') {
                  setError(
                    'Impossible de contacter le serveur. Vérifiez que le backend Django est lancé sur http://localhost:8000'
                  );
                } else {
                  setError(
                    'Une erreur est survenue. Veuillez vérifier votre connexion et réessayer.'
                  );
                }
              } finally {
                setLoading(false);
              }
            };

            return (
              <div>
                {/* Hero */}
                <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-Nous</h1>
                    <p className="text-xl text-blue-200">
                      Nous sommes à votre écoute pour toute question ou demande d'information
                    </p>
                  </div>
                </section>

                {/* Contact Content */}
                <section className="py-16 bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Formulaire */}
                      <div>
                        <h2 className="text-3xl font-bold text-blue-900 mb-6">
                          Envoyez-nous un Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Message de succès */}
                          {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                              <strong className="font-semibold">✓ Message envoyé avec succès !</strong>
                              <p className="text-sm mt-1">
                                Nous vous contacterons dans les plus brefs délais.
                              </p>
                            </div>
                          )}

                          {/* Message d'erreur */}
                          {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                              <strong className="font-semibold">✗ Erreur</strong>
                              <p className="text-sm mt-1">{error}</p>
                            </div>
                          )}

                          {/* Nom */}
                          <div>
                            <label
                              htmlFor="nom"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Nom complet <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="nom"
                              name="nom"
                              value={formData.nom}
                              onChange={handleChange}
                              required
                              minLength={2}
                              maxLength={200}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="Votre nom complet"
                              disabled={loading}
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="votre.email@exemple.com"
                              disabled={loading}
                            />
                          </div>

                          {/* Message */}
                          <div>
                            <label
                              htmlFor="message"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                              minLength={10}
                              maxLength={5000}
                              rows="6"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                              placeholder="Votre message..."
                              disabled={loading}
                            ></textarea>
                            <p className="text-sm text-gray-500 mt-1">
                              Minimum 10 caractères
                            </p>
                          </div>

                          {/* Bouton */}
                          <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                              loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600 transform hover:scale-105 shadow-lg'
                            }`}
                          >
                            {loading ? (
                              <span className="flex items-center justify-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-3"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Envoi en cours...
                              </span>
                            ) : (
                              'Envoyer le message'
                            )}
                          </button>
                          {/* Bouton WhatsApp */}
          <a
            href={`https://wa.me/774701535?text=${encodeURIComponent(
              `Bonjour, je voudrais avoir plus d'informations sur votre école.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-block text-center py-4 px-6 mt-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transform hover:scale-105 shadow-lg transition-all"
          >
            Contacter via WhatsApp
          </a>

                        </form>
                      </div>

                      {/* Informations de contact */}
                      <div>
                        <h2 className="text-3xl font-bold text-blue-900 mb-6">
                          Nos Coordonnées
                        </h2>
                        <div className="space-y-6">
                          {/* Adresse */}
                          <div className="flex items-start bg-blue-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                                Adresse
                              </h3>
                              <p className="text-gray-700">Thiès, Tableau Bakhdad</p>
                              <p className="text-sm text-gray-500 mt-1">Sénégal</p>
                            </div>
                          </div>

                          {/* Email */}
                          <div className="flex items-start bg-orange-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                                Email
                              </h3>
                              <a
                                href="mailto:dabakhba08@gmail.com"
                                className="text-gray-700 hover:text-orange-500 transition-colors"
                              >
                                dabakhba08@gmail.com
                              </a>
                            </div>
                          </div>

                        {/* Téléphones */}
        <div className="flex items-start bg-blue-50 p-6 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-1">
              Téléphones
            </h3>
            <a
              href="tel:+221774701535"
              className="block text-gray-700 hover:text-orange-500 transition-colors"
            >
              (+221) 77 470 15 35
            </a>
            <a
              href="tel:+221763073754"
              className="block text-gray-700 hover:text-orange-500 transition-colors"
            >
              (+221) 76 307 37 54
            </a>
          </div>
        </div>


                          {/* Horaires */}
                          <div className="flex items-start bg-orange-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                                Horaires d'ouverture
                              </h3>
                              <p className="text-gray-700">Lundi - Vendredi : 8h - 19h</p>
                              <p className="text-gray-700">Samedi : 8h - 14h</p>
                              <p className="text-sm text-gray-500 mt-1">Fermé le dimanche</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

              {/* Map section */}
  <section className="py-16 bg-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Nous Localiser
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <MapContainer
          center={[14.7644340, -16.9148230]} // Thiès (approx, non précis)
          zoom={14}
          scrollWheelZoom={false}
          className="w-full h-[450px] rounded-lg"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[14.7644340, -16.9148230]}>
            <Popup>
              <strong>EMD</strong> <br />
              Thiès – Tableau Bakhdad
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
      <div className="flex justify-center mt-4">
  <a
  href={`https://www.google.com/maps/search/?api=1&query=14.7644340,-16.9148230`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 inline-block py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
>
  Ouvrir dans Google Maps
</a>
</div>
  </section>



              </div>
            );
          };

          export default ContactPage;