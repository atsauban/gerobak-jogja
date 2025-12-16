import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
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

  const [viewMode, setViewMode] = useState('grid');
  const hasActiveFilters = selectedCategory !== 'semua' || searchQuery.trim();

  return (
    <div className="pt-16 min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <span className="inline-block text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-4">
              Koleksi Lengkap
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
              Katalog Produk
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Temukan gerobak berkualitas tinggi untuk bisnis kuliner Anda. Tersedia berbagai pilihan material dan desain.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onSearch={(query) => handleSearchChange(query)}
                placeholder="Cari produk..."
                className="w-full"
                showSuggestions={true}
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <SlidersHorizontal size={16} className="text-gray-400 flex-shrink-0 hidden sm:block" />
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {!loading && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> produk ditemukan
              </p>
            )}
            
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                {selectedCategory !== 'semua' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                    {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.name}
                    <button
                      onClick={() => handleCategoryChange('semua')}
                      className="hover:text-primary-900 ml-1"
                      aria-label="Remove category filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    "{searchQuery}"
                    <button
                      onClick={() => handleSearchChange('')}
                      className="hover:text-gray-900 ml-1"
                      aria-label="Clear search"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && <ProductGridSkeleton count={6} />}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }>
            {filteredProducts.map((product) => (
              <PremiumProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
                variant={viewMode}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <EmptyState
            type={hasActiveFilters ? 'search' : 'products'}
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
          <div className="mt-16 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            <div className="relative text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                Tidak Menemukan yang Anda Cari?
              </h3>
              <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                Kami menerima pesanan custom design sesuai kebutuhan bisnis Anda. Konsultasikan ide Anda dengan tim kami.
              </p>
              <WhatsAppButton
                message={CONTACT_INFO.messages.customDesign}
                className="!bg-white !text-gray-900 hover:!bg-gray-100 !px-8 !py-3.5 !rounded-xl !font-semibold inline-flex shadow-lg"
              >
                Konsultasi Custom Design
              </WhatsAppButton>
            </div>
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
