import { X, Eye, Star, Package, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import WhatsAppButton from './WhatsAppButton';
import LazyImage from './LazyImage';

export default function QuickViewModal({ product, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!product) return null;

  const images = product.images || [product.image] || [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Glassmorphism */}
        <div className="sticky top-0 glass-dark bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Eye size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Quick View</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 group"
            aria-label="Close modal"
          >
            <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative group">
                <LazyImage
                  src={images[currentImageIndex] || 'https://via.placeholder.com/600x400?text=No+Image'}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-lg"
                />
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.badge && (
                    <span className="glass px-3 py-1 rounded-full text-sm font-semibold text-white backdrop-blur-md shadow-lg">
                      {product.badge}
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      <span>Unggulan</span>
                    </span>
                  )}
                </div>

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-full text-sm text-white backdrop-blur-md">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? 'border-primary-600 scale-105 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex-1 space-y-6">
                {/* Title & Category */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold uppercase">
                      {product.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {product.shortDesc || product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6">
                  <span className="text-sm text-gray-600 block mb-2">Harga Mulai Dari</span>
                  <p className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500">*Harga dapat berubah sesuai spesifikasi</p>
                </div>

                {/* Quick Info Icons */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Package className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 font-medium">Garansi</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Truck className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 font-medium">Pengiriman</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Shield className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 font-medium">Kualitas</p>
                  </div>
                </div>

                {/* Specifications Preview */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-1 h-5 bg-primary-600 rounded-full"></div>
                      Spesifikasi
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                          <span className="text-gray-600 font-medium">{key}</span>
                          <span className="text-gray-900 font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                    {Object.keys(product.specifications).length > 4 && (
                      <p className="text-xs text-gray-500 mt-2">+{Object.keys(product.specifications).length - 4} spesifikasi lainnya</p>
                    )}
                  </div>
                )}

                {/* Features Preview */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-1 h-5 bg-green-600 rounded-full"></div>
                      Keunggulan
                    </h4>
                    <ul className="space-y-2">
                      {product.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {product.features.length > 4 && (
                      <p className="text-xs text-gray-500 mt-2">+{product.features.length - 4} keunggulan lainnya</p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-6 border-t-2 border-gray-100">
                <WhatsAppButton
                  productName={product.name}
                  productPrice={product.price}
                  className="btn-whatsapp w-full justify-center text-lg py-4 shadow-lg hover:shadow-xl"
                >
                  💬 Pesan via WhatsApp
                </WhatsAppButton>
                <Link
                  to={`/produk/${product.id}`}
                  className="block w-full text-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 hover:scale-105"
                  onClick={onClose}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Eye size={20} />
                    <span>Lihat Detail Lengkap</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
