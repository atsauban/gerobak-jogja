import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="card p-8 md:p-12 text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-display font-bold gradient-text mb-6">
              404
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mb-6"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Maaf, halaman yang Anda cari tidak dapat ditemukan. 
              Mungkin halaman telah dipindahkan atau URL yang dimasukkan salah.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-12">
            <Link 
              to="/" 
              className="btn-primary inline-flex justify-center w-full sm:w-auto"
            >
              <Home className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </button>
              
              <Link 
                to="/katalog"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                <Search className="w-4 h-4 mr-2" />
                Katalog
              </Link>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Atau kunjungi halaman lainnya:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link 
                to="/tentang" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Tentang Kami
              </Link>
              <Link 
                to="/galeri" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Galeri
              </Link>
              <Link 
                to="/blog" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Blog
              </Link>
              <Link 
                to="/kontak" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Kontak
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;