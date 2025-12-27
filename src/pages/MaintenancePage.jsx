import { AlertTriangle, Clock, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MaintenancePage({ message }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-gray-900" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/80 backdrop-blur-xl max-w-lg w-full rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/50 relative z-10"
            >
                <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner transform rotate-3"
                >
                    <AlertTriangle size={48} className="text-yellow-600 drop-shadow-sm" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight"
                >
                    Sedang Dalam Perbaikan
                </motion.h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "60px" }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-6"
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 mb-10 text-lg leading-relaxed font-light"
                >
                    {message || 'Kami sedang meningkatkan performa dan fitur website untuk memberikan layanan terbaik. Mohon kembali lagi beberapa saat lagi.'}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500 bg-gray-50/80 p-4 rounded-2xl border border-gray-100"
                >
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-primary-600" />
                        <span className="font-medium text-gray-700">Estimasi Kembali:</span>
                    </div>
                    <span>Kami akan segera online kembali</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 pt-8 border-t border-gray-100"
                >
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Butuh Bantuan Mendesak?</p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="mailto:info@gerobakjogja.com"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-primary-500 text-gray-600 hover:text-primary-600 rounded-xl transition-all shadow-sm hover:shadow-md group"
                        >
                            <Mail size={18} className="group-hover:scale-110 transition-transform" />
                            <span>Email Kami</span>
                        </a>
                        <a
                            href="https://wa.me/6282327220077"
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-50 border border-green-100 hover:border-green-500 text-green-700 hover:text-green-800 rounded-xl transition-all shadow-sm hover:shadow-md group"
                        >
                            <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-gray-400 text-sm font-medium tracking-wide"
            >
                &copy; {new Date().getFullYear()} Gerobak Jogja
            </motion.div>
        </div>
    );
}
