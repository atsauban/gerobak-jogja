import { Link } from 'react-router-dom';
import { Package, Search, ShoppingCart, Image as ImageIcon, Filter, Home } from 'lucide-react';

export default function EmptyState({ 
  type = 'products', 
  title, 
  description, 
  actionText, 
  actionLink,
  icon: CustomIcon,
  suggestions = [],
  onClearFilters
}) {
  const configs = {
    products: {
      icon: Package,
      emoji: '📦',
      defaultTitle: 'Belum Ada Produk',
      defaultDescription: 'Produk akan muncul di sini setelah ditambahkan',
      defaultAction: 'Tambah Produk',
      defaultLink: '/admin'
    },
    search: {
      icon: Search,
      emoji: '🔍',
      defaultTitle: 'Tidak Ada Hasil',
      defaultDescription: 'Coba kata kunci lain atau ubah filter pencarian',
      defaultAction: 'Reset Filter',
      defaultLink: null
    },
    cart: {
      icon: ShoppingCart,
      emoji: '🛒',
      defaultTitle: 'Keranjang Kosong',
      defaultDescription: 'Belum ada produk yang ditambahkan ke keranjang',
      defaultAction: 'Lihat Katalog',
      defaultLink: '/katalog'
    },
    gallery: {
      icon: ImageIcon,
      emoji: '🖼️',
      defaultTitle: 'Belum Ada Gambar',
      defaultDescription: 'Galeri foto akan muncul di sini',
      defaultAction: 'Upload Gambar',
      defaultLink: '/admin'
    }
  };

  const config = configs[type] || configs.products;
  const Icon = CustomIcon || config.icon;
  const finalTitle = title || config.defaultTitle;
  const finalDescription = description || config.defaultDescription;
  const finalActionText = actionText || config.defaultAction;
  const finalActionLink = actionLink || config.defaultLink;

  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        {config.emoji ? (
          <span className="text-3xl">{config.emoji}</span>
        ) : (
          <Icon size={28} className="text-gray-400" />
        )}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {finalTitle}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {finalDescription}
      </p>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mb-6 max-w-sm mx-auto">
          <p className="text-xs text-gray-400 mb-2">Saran:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onClearFilters && onClearFilters(suggestion)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
        {onClearFilters && (
          <button
            onClick={() => onClearFilters()}
            className="btn-secondary text-sm"
          >
            {finalActionText}
          </button>
        )}
        {finalActionLink && (
          <Link 
            to={finalActionLink}
            className="btn-primary text-sm"
          >
            {type === 'search' ? 'Lihat Semua Produk' : finalActionText}
          </Link>
        )}
      </div>
    </div>
  );
}
