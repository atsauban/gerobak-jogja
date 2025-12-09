import { Link } from 'react-router-dom';
import { Package, Search, ShoppingCart, Image as ImageIcon } from 'lucide-react';

export default function EmptyState({ 
  type = 'products', 
  title, 
  description, 
  actionText, 
  actionLink,
  icon: CustomIcon 
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
    <div className="text-center py-20 px-4">
      <div className="w-32 h-32 mx-auto mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="relative flex items-center justify-center h-full">
          {config.emoji ? (
            <span className="text-7xl opacity-50">{config.emoji}</span>
          ) : (
            <Icon size={64} className="text-primary-300" />
          )}
        </div>
      </div>
      
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {finalTitle}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
        {finalDescription}
      </p>
      
      {finalActionLink && (
        <Link 
          to={finalActionLink}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Icon size={20} />
          {finalActionText}
        </Link>
      )}
    </div>
  );
}
