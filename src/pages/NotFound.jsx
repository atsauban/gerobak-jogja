import { Link } from 'react-router-dom';
import { Home, ArrowLeft, MessageCircle, ShoppingCart } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import { CONTACT_INFO } from '../config/contact';

export default function NotFound() {
  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen py-16">
        <div className="max-w-xl mx-auto text-center px-4">
          {/* 404 Text */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-display font-black text-gray-900 mb-4">
              404
            </div>
            <div className="w-16 h-1 bg-gray-900 rounded-full mx-auto"></div>
          </div>

          {/* Error Message */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Sepertinya halaman yang Anda cari tidak ada atau sudah dipindahkan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-3 justify-center mb-10 w-full sm:w-auto">
            <Link to="/" className="btn-primary flex-1 sm:flex-none justify-center text-sm px-4">
              <Home size={18} />
              Beranda
            </Link>
            <Link to="/katalog" className="btn-secondary flex-1 sm:flex-none justify-center text-sm px-4">
              <ShoppingCart size={18} />
              Katalog
            </Link>
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Kembali ke halaman sebelumnya
          </button>

          {/* Help Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MessageCircle className="text-gray-700" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Butuh Bantuan?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Hubungi kami jika Anda memerlukan bantuan.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <WhatsAppButton
                message={CONTACT_INFO.messages.help}
                className="btn-whatsapp justify-center"
              >
                Chat WhatsApp
              </WhatsAppButton>

              <Link to="/kontak" className="btn-secondary justify-center">
                Halaman Kontak
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}