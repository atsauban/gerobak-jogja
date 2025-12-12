import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoggingIn(true);

        try {
            await login(email, password);
            // User will be set by onAuthStateChanged in parent or context
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                setLoginError('Email atau password salah');
            } else if (error.code === 'auth/user-not-found') {
                setLoginError('User tidak ditemukan');
            } else if (error.code === 'auth/too-many-requests') {
                setLoginError('Terlalu banyak percobaan login. Coba lagi nanti.');
            } else {
                setLoginError('Gagal login. Coba lagi.');
            }
        } finally {
            setLoggingIn(false);
        }
    };

    return (
        <div className="pt-16 min-h-screen gradient-primary relative overflow-hidden">
            {/* Background Effects - Same as Home page */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            {/* Geometric Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rotate-45"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/50 rotate-12"></div>
                <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white">
                            🔐 Admin Access
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white mb-2">
                            Admin Panel
                        </h1>
                        <p className="text-blue-100">
                            Masuk untuk mengelola produk gerobak
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="glass rounded-2xl p-8 backdrop-blur-lg border border-white/20">
                        {loginError && (
                            <div className="mb-6 p-4 bg-red-500/20 border border-red-300/30 rounded-xl text-sm text-red-100 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                                    {loginError}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-white/90 mb-2 font-medium text-sm">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@gerobakjogja.com"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    required
                                    disabled={loggingIn}
                                />
                            </div>

                            <div>
                                <label className="block text-white/90 mb-2 font-medium text-sm">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    required
                                    disabled={loggingIn}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loggingIn}
                                className="w-full bg-white text-primary-600 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loggingIn ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                                        Masuk...
                                    </div>
                                ) : (
                                    'Masuk ke Admin Panel'
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-white/10 text-center">
                            <p className="text-white/60 text-sm">
                                Gerobak Jogja Admin Dashboard
                            </p>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="mt-6 text-center">
                        <p className="text-blue-100/80 text-sm">
                            🔒 Koneksi aman dengan enkripsi end-to-end
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
