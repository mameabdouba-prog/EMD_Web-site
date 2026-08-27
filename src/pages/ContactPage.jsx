import { useState } from 'react';
import { sendContactMessage } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Mail, Phone, Clock, ArrowRight, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Page Contact du site EMD - Design premium cohérent avec la HomePage
 */
const ContactPage = () => {
  const [formData, setFormData] = useState({ nom: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(', '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Impossible de contacter le serveur. Vérifiez que le backend Django est lancé.');
      } else {
        setError('Une erreur est survenue. Veuillez vérifier votre connexion et réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const coordInfos = [
    {
      icon: MapPin,
      title: 'Adresse',
      content: ['Thiès, Tableau Bakhdad', 'Sénégal'],
      color: 'text-orange-500',
      bg: 'bg-orange-50 border-orange-200',
    },
    {
      icon: Mail,
      title: 'Email',
      content: ['dabakhba08@gmail.com'],
      href: 'mailto:dabakhba08@gmail.com',
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      icon: Phone,
      title: 'Téléphones',
      content: ['(+221) 77 470 15 35', '(+221) 76 307 37 54'],
      href: 'tel:+221774701535',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200',
    },
    {
      icon: Clock,
      title: "Horaires d'ouverture",
      content: ['Lundi – Vendredi : 8h – 19h', 'Samedi : 8h – 14h', 'Fermé le dimanche'],
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <PageHero badge="Nous sommes à votre écoute" title="Contactez" highlight="l'EMD">
        Pour toute <span className="font-semibold text-orange-300">question</span> ou{' '}
        <span className="font-semibold text-amber-300">demande d'inscription</span>, notre équipe est disponible.
      </PageHero>

      {/* ===== FORMULAIRE + COORDONNÉES ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* ---- Formulaire ---- */}
            <Reveal>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <MessageSquare className="w-3.5 h-3.5" /> Envoyez un message
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-blue-950 mb-8 tracking-tight">
                Écrivez-nous, on vous répond{' '}
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">rapidement</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Succès */}
                {success && (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Message envoyé avec succès !</p>
                      <p className="text-sm mt-1">Nous vous contacterons dans les plus brefs délais.</p>
                    </div>
                  </div>
                )}

                {/* Erreur */}
                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Erreur</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {/* Nom */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-semibold text-slate-700 mb-2">
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
                    disabled={loading}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="votre.email@exemple.com"
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
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
                    disabled={loading}
                    placeholder="Votre message..."
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 resize-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Minimum 10 caractères</p>
                </div>

                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-extrabold text-white transition-all duration-300 flex items-center justify-center gap-2 ${loading
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/30'
                    }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/774701535?text=${encodeURIComponent("Bonjour, je voudrais avoir plus d'informations sur votre école.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 hover:scale-[1.02] shadow-lg shadow-green-500/20 transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contacter via WhatsApp
                </a>
              </form>
            </Reveal>

            {/* ---- Coordonnées ---- */}
            <Reveal delay={150}>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6">
                <MapPin className="w-3.5 h-3.5" /> Nos coordonnées
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-blue-950 mb-8 tracking-tight">
                Où nous{' '}
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">trouver</span>
              </h2>

              <div className="space-y-4">
                {coordInfos.map((info, index) => {
                  const IconComp = info.icon;
                  return (
                    <div key={index} className={`flex items-start gap-4 ${info.bg} border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}>
                      <div className={`w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 ${info.color} group-hover:scale-110 transition-transform`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1">{info.title}</h3>
                        {info.href ? (
                          info.content.map((line, i) => (
                            <a key={i} href={info.href} className="block text-sm text-slate-600 hover:text-orange-600 transition-colors">
                              {line}
                            </a>
                          ))
                        ) : (
                          info.content.map((line, i) => (
                            <p key={i} className="text-sm text-slate-600">{line}</p>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== CARTE ===== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <MapPin className="w-3.5 h-3.5" /> Notre localisation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
              Nous{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Localiser</span>
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <MapContainer
              center={[14.7644340, -16.9148230]}
              zoom={14}
              scrollWheelZoom={false}
              className="w-full h-[450px]"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[14.7644340, -16.9148230]}>
                <Popup>
                  <strong>Groupe Scolaire EMD</strong><br />Thiès – Tableau Bakhdad
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          </Reveal>

          <Reveal delay={200} className="flex justify-center mt-6">
            <a
              href="https://www.google.com/maps/search/?api=1&query=14.7644340,-16.9148230"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:scale-105 shadow-lg transition-all duration-300"
            >
              <MapPin className="w-4 h-4" />
              Ouvrir dans Google Maps
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;