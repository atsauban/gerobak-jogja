import { X, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import WhatsAppButton from './WhatsAppButton';
import LazyImage from './LazyImage';

export default function QuickViewModal({ product, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900">Quick View</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              <LazyImage
                src={product.images?.[0] || product.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={product.name}
                className="w-full h-80 md:h-96 object-cover rounded-xl"
              />
              {product.badge && (
                <span className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.shortDesc || product.description}
                </p>

                <div className="mb-6">
                  <span className="text-sm text-gray-500 block mb-1">Harga Mulai Dari</span>
                  <p className="text-4xl font-bold text-primary-600">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Specifications Preview */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Spesifikasi:</h4>
                    <div className="space-y-2">
                      {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features Preview */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Keunggulan:</h4>
                    <ul className="space-y-2">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t">
                <Link
                  to={`/produk/${product.id}`}
                  className="btn-primary w-full justify-center"
                  onClick={onClose}
                >
                  <Eye size={20} />
                  Lihat Detail Lengkap
                </Link>
                <WhatsAppButton
                  productName={product.name}
                  productPrice={product.price}
                  className="btn-whatsapp w-full justify-center"
                >
                  Pesan Sekarang
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
