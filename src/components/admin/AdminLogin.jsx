import { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import logoEMD from '../../assets/EMD.jpeg';
import adminDataService from '../../services/adminDataService';

const AdminLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await adminDataService.login(username.trim(), password);
            if (result.success) {
                onLoginSuccess(result.session);
            } else {
                setError(result.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Glow Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                {/* Card Header & Logo */}
                <div className="text-center mb-8">
                    <div className="inline-relative inline-block mb-3">
                        <img
                            src={logoEMD}
                            alt="Logo EMD"
                            className="w-20 h-20 object-cover rounded-full ring-4 ring-orange-500/60 shadow-2xl mx-auto"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-1.5 rounded-full shadow-lg">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Espace Administration
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1.5 font-light">
                        Groupe Scolaire El Hadji Malick Dieye
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40">
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block">Accès Refusé</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                Identifiant / Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ex: admin"
                                    className="w-full pl-10 pr-4 py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-500/25 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-11 py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-500/25 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Connexion en cours...</span>
                                </>
                            ) : (
                                <>
                                    <span>Se connecter</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sécurité */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-orange-400/70" />
                            Connexion chiffrée et protégée contre les tentatives répétées
                        </p>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-slate-400 hover:text-white text-xs font-medium transition-colors"
                    >
                        ← Retourner sur le site vitrine
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
