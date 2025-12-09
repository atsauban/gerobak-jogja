import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, Eye } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import { CONTACT_INFO } from '../config/contact';
import { useProducts } from '../context/ProductContext';

export default function Katalog() {
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const { getProductsByCategory } = useProducts();

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

  const filteredProducts = getProductsByCategory(selectedCategory);

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="section-title">Katalog Produk</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan gerobak yang sempurna untuk bisnis Anda
          </p>
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
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Menampilkan <span className="font-bold text-primary-600">{filteredProducts.length}</span> produk
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="card overflow-hidden group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.images?.[0] || product.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                  alt={product.name} 
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                {product.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {product.badge}
                    </span>
                  </div>
                )}

              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{product.shortDesc || product.desc}</p>
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

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Tidak ada produk dalam kategori ini</p>
          </div>
        )}

        {/* CTA */}
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
      </div>
    </div>
  );
}
