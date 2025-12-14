import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, MessageCircle, ShoppingCart } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import { CONTACT_INFO } from '../config/contact';

export default function NotFound() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          {/* 404 Illustration */}
          <div className="mb-12">
            <div className="relative">
              {/* Large 404 Text */}
              <div className="text-8xl md:text-9xl font-display font-black text-transparent bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text mb-4 animate-pulse">
                404
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-4 left-8 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🔍</div>
                <div className="absolute top-8 right-12 text-xl animate-bounce" style={{ animationDelay: '1s' }}>❓</div>
                <div className="absolute bottom-4 left-12 text-lg animate-bounce" style={{ animationDelay: '1.5s' }}>📍</div>
                <div className="absolute bottom-8 right-8 text-xl animate-bounce" style={{ animationDelay: '2s' }}>🎯</div>
              </div>
            </div>
            
            {/* Decorative Lines */}
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-8 h-1 bg-primary-600 rounded-full animate-pulse"></div>
              <div className="w-12 h-1 bg-accent-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-8 h-1 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Oops! Gerobak Tersesat
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed max-w-lg mx-auto">
              Sepertinya gerobak yang Anda cari sedang berkeliling di tempat lain. 
              Mari kita bantu Anda menemukan jalan kembali!
            </p>
          </div>

          {/* Action Cards */}
          <div className="flex gap-3 justify-center mb-12">
            {/* Home Card */}
            <Link 
              to="/"
              className="group bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex-1 max-w-40"
            >
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Home className="text-white" size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 text-center">Kembali ke Beranda</h3>
              <p className="text-gray-600 text-xs text-center leading-tight">Lihat koleksi gerobak terbaru</p>
            </Link>

            {/* Catalog Card */}
            <Link 
              to="/katalog"
              className="group bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex-1 max-w-40"
            >
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="text-white" size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 text-center">Jelajahi Katalog</h3>
              <p className="text-gray-600 text-xs text-center leading-tight">Temukan gerobak sempurna</p>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 justify-center items-center mb-12">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 border-2 border-gray-300 text-gray-700 
                       font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 text-xs sm:text-sm"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Halaman Sebelumnya</span>
              <span className="sm:hidden">Kembali</span>
            </button>
            
            <Link 
              to="/galeri"
              className="inline-flex items-center justify-center gap-1 px-3 py-2 border-2 border-primary-300 text-primary-700 
                       font-medium rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all duration-300 text-xs sm:text-sm"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Lihat Galeri</span>
              <span className="sm:hidden">Galeri</span>
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageCircle className="text-primary-600" size={24} />
              <h3 className="text-2xl font-bold text-gray-900">Butuh Bantuan?</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tim customer service kami siap membantu Anda menemukan gerobak yang tepat 
              atau menjawab pertanyaan seputar produk kami.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppButton 
                message={CONTACT_INFO.messages.help}
                className="btn-whatsapp justify-center"
              >
                Chat WhatsApp
              </WhatsAppButton>
              
              <Link 
                to="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 
                         font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Halaman Kontak
              </Link>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}