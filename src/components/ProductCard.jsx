/**
 * Product Card Component for Mobile View
 * Used in Admin panel to replace table on mobile devices
 */
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Star } from 'lucide-react';

export default function ProductCard({ product, onEdit, onDelete, onToggleFeatured }) {
  const priceFormatted = parseInt(product.price).toLocaleString('id-ID');
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image';

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{product.category}</p>
            </div>
            {product.badge && (
              <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                {product.badge}
              </span>
            )}
          </div>
          <p className="text-base font-bold text-gray-900 mt-1">
            Rp {priceFormatted}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-t border-gray-100">
        <button
          onClick={() => onToggleFeatured(product.id, product.featured)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            product.featured
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}
          aria-label={product.featured ? 'Hapus dari unggulan' : 'Jadikan unggulan'}
        >
          <Star size={16} fill={product.featured ? 'currentColor' : 'none'} />
          <span className="hidden xs:inline">{product.featured ? 'Unggulan' : 'Set Unggulan'}</span>
        </button>

        <div className="flex items-center gap-1">
          <Link
            to={`/produk/${product.slug || product.id}`}
            target="_blank"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Lihat detail"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            aria-label="Edit produk"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Hapus produk"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
