import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Filter, Eye, Zap, X } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LazyImage from '../components/LazyImage';
import PageHero from '../components/PageHero';
import QuickViewModal from '../components/QuickViewModal';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { CONTACT_INFO } from '../config/contact';
import { useProducts } from '../context/ProductContext';
import PremiumProductCard from '../components/PremiumProductCard';

export default function Katalog() {
  /* URL Sync Implementation */
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL or defaults
  const selectedCategory = searchParams.get('kategori') || 'semua';
  const searchQuery = searchParams.get('cari') || '';

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { getProductsByCategory, loading } = useProducts();

  // Helper to update URL params
  const updateParams = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    // Reset page to 1 if we had pagination (future proofing)
    // nextParams.delete('page');

    setSearchParams(nextParams);
  };

  const handleCategoryChange = (category) => {
    updateParams({ kategori: category === 'semua' ? '' : category });
  };

  const handleSearchChange = (query) => {
    updateParams({ cari: query });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  /* Removed hardcoded products - now using context */

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
      {/* Header (PageHero) */}
      <PageHero
        title="Katalog Produk"
        description="Temukan gerobak yang sempurna untuk bisnis Anda"
      >
        <SearchBar
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onSearch={(query) => handleSearchChange(query)}
          placeholder="Cari gerobak berdasarkan nama, kategori, atau deskripsi..."
          className="mb-4"
          showSuggestions={true}
        />
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Active Filters Chips */}
        {(selectedCategory !== 'semua' || searchQuery.trim()) && (
          <div className="mb-6 animate-slide-up">
            <div className="flex flex-wrap items-center gap-2 justify-center">
              <span className="text-sm text-gray-600 font-medium">Filter Aktif:</span>
              {selectedCategory !== 'semua' && (
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <Filter size={14} />
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => handleCategoryChange('semua')}
                    className="ml-1 hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                    aria-label="Remove category filter"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {searchQuery.trim() && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <span>"{searchQuery}"</span>
                  <button
                    onClick={() => handleSearchChange('')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {(selectedCategory !== 'semua' || searchQuery.trim()) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-primary-600 font-medium underline"
                >
                  Hapus Semua Filter
                </button>
              )}
            </div>
          </div>
        )}

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
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === cat.id
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
                className="h-full animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PremiumProductCard
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <EmptyState
            type={searchQuery || selectedCategory !== 'semua' ? 'search' : 'products'}
            title={
              searchQuery
                ? `Tidak Ada Hasil untuk "${searchQuery}"`
                : selectedCategory !== 'semua'
                  ? `Tidak Ada Produk di Kategori ${categories.find(c => c.id === selectedCategory)?.name}`
                  : 'Belum Ada Produk'
            }
            description={
              searchQuery
                ? `Tidak ditemukan produk yang sesuai. Coba kata kunci lain atau ubah filter.`
                : selectedCategory !== 'semua'
                  ? 'Belum ada produk dalam kategori ini. Coba kategori lain atau lihat semua produk.'
                  : 'Produk akan muncul di sini setelah ditambahkan.'
            }
            onClearFilters={clearFilters}
            suggestions={
              searchQuery
                ? categories.filter(c => c.id !== selectedCategory).slice(0, 3).map(c => c.name)
                : categories.filter(c => c.id !== 'semua' && c.id !== selectedCategory).slice(0, 3).map(c => c.name)
            }
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
