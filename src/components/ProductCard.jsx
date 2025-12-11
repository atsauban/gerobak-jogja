/**
 * Product Card Component for Mobile View
 * Used in Admin panel to replace table on mobile devices
 */
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Star } from 'lucide-react';

export default function ProductCard({ product, onEdit, onDelete, onToggleFeatured }) {
  return (
    <div className="card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 capitalize mt-1">{product.category}</p>
        </div>
        {product.badge && (
          <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
            {product.badge}
          </span>
        )}
      </div>

      {/* Price */}
      <div>
        <p className="text-lg font-bold text-primary-600">
          Rp {parseInt(product.price).toLocaleString('id-ID')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFeatured(product.id, product.featured)}
            className={`p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              product.featured 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            aria-label={product.featured ? 'Hapus dari unggulan' : 'Jadikan unggulan'}
          >
            <Star size={20} fill={product.featured ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={`/produk/${product.slug || product.id}`}
            target="_blank"
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Lihat detail"
          >
            <Eye size={20} />
          </Link>
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Edit produk"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Hapus produk"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

