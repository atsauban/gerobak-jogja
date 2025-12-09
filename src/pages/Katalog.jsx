import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, Eye, Zap } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LazyImage from '../components/LazyImage';
import QuickViewModal from '../components/QuickViewModal';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { CONTACT_INFO } from '../config/contact';
import { useProducts } from '../context/ProductContext';

export default function Katalog() {
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { getProductsByCategory, loading } = useProducts();

  /* Removed hardcoded products - now using context
  const products = [
    { id: 1, name: 'Gerobak Aluminium Premium', category: 'aluminium', price: '3.500.000', image: 'https://via.placeholder.com/400x300?text=Aluminium+Premium', desc: 'Gerobak aluminium dengan finishing premium', rating: 4.9, badge: 'Best Seller' },
    { id: 2, name: 'Gerobak Aluminium Standard', category: 'aluminium', price: '3.000.000', image: 'https://via.placeholder.com/400x300?text=Aluminium+Standard', desc: 'Gerobak aluminium kualitas standard', rating: 4.7, badge: null },
    { id: 3, name: 'Gerobak Kayu Jati', category: 'kayu', price: '4.000.000', image: 'https://via.placeholder.com/400x300?text=Kayu+Jati', desc: 'Gerobak kayu jati solid dan tahan lama', rating: 4.8, badge: 'Premium' },
    { id: 4, name: 'Gerobak Kayu Pinus', category: 'kayu', price: '2.500.000', image: 'https://via.placeholder.com/400x300?text=Kayu+Pinus', desc: 'Gerobak kayu pinus ekonomis', rating: 4.6, badge: 'Hemat' },
    { id: 5, name: 'Gerobak Stainless Steel', category: 'stainless', price: '5.000.000', image: 'https://via.placeholder.com/400x300?text=Stainless+Steel', desc: 'Gerobak stainless steel food grade', rating: 5.0, badge: 'Premium' },
    { id: 6, name: 'Gerobak Kombinasi', category: 'kombinasi', price: '3.800.000', image: 'https://via.placeholder.com/400x300?text=Kombinasi', desc: 'Kombinasi aluminium dan kayu', rating: 4.7, badge: 'Populer' },
  ]; */

  const categories = [
    { id: 'semua', name: 'Semua Produk', icon: '🏪' },
    { id: 'aluminium', name: 'Aluminium', icon: '⚡' },
    { id: 'kayu', name: 'Kayu', icon: '🌳' },
    { id: 'stainless', name: 'Stainless Steel', icon: '✨' },
    { id: 'kombinasi', name: 'Kombinasi', icon: '🎨' },
  ];

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    let products = getProductsByCategory(selectedCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.shortDesc && product.shortDesc.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }
    
    return products;
  }, [selectedCategory, searchQuery, getProductsByCategory]);

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="section-title">Katalog Produk</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Temukan gerobak yang sempurna untuk bisnis Anda
          </p>
          
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari gerobak berdasarkan nama, kategori, atau deskripsi..."
            className="mb-4"
          />
        </div>
        
        {/* Category Filter */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Filter className="text-gray-600" size={20} />
            <span className="text-gray-600 font-medium">Filter Kategori:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Count */}
        {!loading && filteredProducts.length > 0 && (
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Menampilkan <span className="font-bold text-primary-600">{filteredProducts.length}</span> produk
              {searchQuery && <span> untuk "{searchQuery}"</span>}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && <ProductGridSkeleton count={6} />}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="card overflow-hidden group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <LazyImage
                    src={product.images?.[0] || product.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={`Gerobak ${product.name} - ${product.category}`}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  {/* Quick View Button */}
                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full 
                               opacity-0 group-hover:opacity-100 transition-all duration-300 
                               hover:bg-white hover:scale-110 shadow-lg"
                    aria-label="Quick view"
                  >
                    <Zap size={20} className="text-primary-600" />
                  </button>

                  {product.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Image Gallery Indicator */}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                      {product.images.slice(0, 5).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1.5 h-1.5 rounded-full bg-white/70 backdrop-blur-sm"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    {product.shortDesc || product.desc}
                  </p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-sm text-gray-500">Mulai dari</span>
                    <p className="text-primary-600 font-bold text-2xl">
                      Rp {parseInt(product.price).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      to={`/produk/${product.id}`}
                      className="flex-1 btn-primary justify-center text-sm py-2"
                    >
                      <Eye size={18} />
                      Detail
                    </Link>
                    <WhatsAppButton 
                      productName={product.name}
                      productPrice={product.price}
                      className="flex-1 btn-whatsapp justify-center text-sm py-2"
                    >
                      Pesan
                    </WhatsAppButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <EmptyState
            type={searchQuery ? 'search' : 'products'}
            title={searchQuery ? 'Tidak Ada Hasil' : 'Belum Ada Produk'}
            description={
              searchQuery 
                ? `Tidak ditemukan produk untuk "${searchQuery}". Coba kata kunci lain.`
                : 'Produk dalam kategori ini belum tersedia.'
            }
            actionText={searchQuery ? 'Reset Pencarian' : 'Lihat Semua Produk'}
            actionLink={searchQuery ? null : '/katalog'}
          />
        )}

        {/* CTA */}
        {!loading && (
          <div className="mt-16 text-center bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Tidak Menemukan yang Anda Cari?</h3>
            <p className="text-gray-600 mb-6">Kami menerima custom design sesuai kebutuhan Anda</p>
            <WhatsAppButton 
              message={CONTACT_INFO.messages.customDesign}
              className="btn-whatsapp inline-flex"
            >
              Konsultasi Custom Design
            </WhatsAppButton>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
