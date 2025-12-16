import { X, Eye, Star, Package, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import WhatsAppButton from './WhatsAppButton';
import LazyImage from './LazyImage';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function QuickViewModal({ product, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useFocusTrap(true, modalRef);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    
    if (closeButtonRef.current) closeButtonRef.current.focus();
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!product) return null;

  const images = product.images || [product.image] || [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h3 id="quick-view-title" className="text-lg font-bold text-gray-900">Detail Produk</h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-65px)]">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <LazyImage
                  src={images[currentImageIndex] || 'https://via.placeholder.com/600x400?text=No+Image'}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-md">
                    <Star size={12} fill="currentColor" />
                    Unggulan
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-primary-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                <span className="inline-block text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md mb-3 capitalize">
                  {product.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.shortDesc || product.description}
                </p>

                {/* Price */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Harga Mulai</div>
                  <div className="text-2xl font-bold text-gray-900">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: Package, label: 'Garansi', color: 'blue' },
                    { icon: Truck, label: 'Kirim', color: 'green' },
                    { icon: Shield, label: 'Premium', color: 'purple' },
                  ].map((item, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <item.icon className={`w-5 h-5 mx-auto mb-1 ${
                        item.color === 'blue' ? 'text-blue-600' :
                        item.color === 'green' ? 'text-green-600' :
                        'text-purple-600'
                      }`} />
                      <p className="text-xs text-gray-600 font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Specs Preview */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Spesifikasi</h4>
                    <div className="space-y-1.5">
                      {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-500">{key}</span>
                          <span className="text-gray-900 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <WhatsAppButton
                  productName={product.name}
                  productPrice={product.price}
                  className="btn-whatsapp w-full justify-center"
                >
                  Pesan via WhatsApp
                </WhatsAppButton>
                <Link
                  to={`/produk/${product.slug || product.id}`}
                  className="btn-secondary w-full justify-center"
                  onClick={onClose}
                >
                  <Eye size={18} />
                  Lihat Detail
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
