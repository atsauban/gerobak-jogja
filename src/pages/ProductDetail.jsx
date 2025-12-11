import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Check, Package, Truck, Shield, Ruler, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import Breadcrumbs from '../components/Breadcrumbs';
import LazyImage from '../components/LazyImage';
import ImageGallery from '../components/ImageGallery';
import { useProducts } from '../context/ProductContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug, loading } = useProducts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const product = getProductBySlug(slug);

  // Loading state
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="h-96 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && product.images && (
        <ImageGallery
          images={product.images}
          initialIndex={currentImageIndex}
          onClose={() => setShowGallery(false)}
          title={product.name}
          showCounter={true}
          enableZoom={true}
        />
      )}
    </div>
  );
}

  /* Removed hardcoded products array - now using context
  const allProducts = [
    {
      id: 1,
      name: 'Gerobak Aluminium Premium',
      category: 'aluminium',
      price: '3.500.000',
      rating: 4.9,
      reviews: 45,
      badge: 'Best Seller',
      shortDesc: 'Gerobak aluminium dengan finishing premium dan desain modern',
      description: 'Gerobak aluminium premium dengan material berkualitas tinggi dan finishing yang sempurna. Cocok untuk berbagai jenis usaha kuliner seperti kopi, minuman, makanan ringan, dan lainnya. Desain modern dan elegan yang akan menarik perhatian pelanggan.',
      images: [
        'https://via.placeholder.com/800x600?text=Gerobak+Aluminium+1',
        'https://via.placeholder.com/800x600?text=Gerobak+Aluminium+2',
        'https://via.placeholder.com/800x600?text=Gerobak+Aluminium+3',
        'https://via.placeholder.com/800x600?text=Gerobak+Aluminium+4',
      ],
      specifications: {
        'Dimensi': '120cm x 80cm x 180cm',
        'Material Rangka': 'Aluminium Hollow 2x4cm',
        'Material Body': 'Aluminium Composite Panel',
        'Roda': '4 buah (2 roda kunci)',
        'Finishing': 'Powder Coating',
        'Warna': 'Custom (sesuai permintaan)',
        'Berat': '±45kg',
        'Kapasitas': 'Beban maksimal 150kg'
      },
      features: [
        'Material aluminium anti karat',
        'Desain modern dan elegan',
        'Mudah dipindahkan dengan roda',
        'Tahan cuaca dan air',
        'Banyak ruang penyimpanan',
        'Lampu LED (optional)',
        'Branding custom gratis',
        'Garansi 1 tahun'
      ],
      includes: [
        '1 unit gerobak aluminium',
        'Roda 4 buah',
        'Kunci roda 2 buah',
        'Rak penyimpanan',
        'Laci/drawer',
        'Branding sticker',
        'Buku panduan',
        'Garansi card'
      ]
    },
    {
      id: 2,
      name: 'Gerobak Kayu Jati',
      category: 'kayu',
      price: '4.000.000',
      rating: 4.8,
      reviews: 38,
      badge: 'Premium',
      shortDesc: 'Gerobak kayu jati solid dengan desain klasik dan elegan',
      description: 'Gerobak kayu jati premium dengan material kayu jati pilihan. Desain klasik yang timeless dan cocok untuk berbagai konsep usaha. Finishing natural yang menonjolkan keindahan serat kayu jati.',
      images: [
        'https://via.placeholder.com/800x600?text=Gerobak+Kayu+1',
        'https://via.placeholder.com/800x600?text=Gerobak+Kayu+2',
        'https://via.placeholder.com/800x600?text=Gerobak+Kayu+3',
      ],
      specifications: {
        'Dimensi': '130cm x 85cm x 190cm',
        'Material': 'Kayu Jati Grade A',
        'Finishing': 'Natural Wood + Clear Coating',
        'Roda': '4 buah (2 roda kunci)',
        'Warna': 'Natural kayu jati',
        'Berat': '±65kg',
        'Kapasitas': 'Beban maksimal 200kg'
      },
      features: [
        'Kayu jati solid berkualitas',
        'Desain klasik dan elegan',
        'Tahan lama dan kokoh',
        'Finishing natural premium',
        'Banyak ruang penyimpanan',
        'Custom ukiran (optional)',
        'Branding custom',
        'Garansi 2 tahun'
      ],
      includes: [
        '1 unit gerobak kayu jati',
        'Roda 4 buah',
        'Kunci roda 2 buah',
        'Rak kayu',
        'Laci kayu',
        'Branding',
        'Buku panduan',
        'Garansi card'
      ]
    },
    {
      id: 3,
      name: 'Gerobak Stainless Steel',
      category: 'stainless',
      price: '5.000.000',
      rating: 5.0,
      reviews: 52,
      badge: 'Premium',
      shortDesc: 'Gerobak stainless steel food grade untuk usaha kuliner',
      description: 'Gerobak stainless steel food grade dengan standar kebersihan tinggi. Sangat cocok untuk usaha kuliner yang mengutamakan hygiene. Material stainless steel 304 yang tahan karat dan mudah dibersihkan.',
      images: [
        'https://via.placeholder.com/800x600?text=Gerobak+Stainless+1',
        'https://via.placeholder.com/800x600?text=Gerobak+Stainless+2',
        'https://via.placeholder.com/800x600?text=Gerobak+Stainless+3',
        'https://via.placeholder.com/800x600?text=Gerobak+Stainless+4',
      ],
      specifications: {
        'Dimensi': '125cm x 80cm x 185cm',
        'Material': 'Stainless Steel 304',
        'Ketebalan': '1.2mm - 1.5mm',
        'Roda': '4 buah heavy duty (2 roda kunci)',
        'Finishing': 'Mirror/Doff',
        'Berat': '±55kg',
        'Kapasitas': 'Beban maksimal 180kg'
      },
      features: [
        'Stainless steel 304 food grade',
        'Anti karat dan tahan lama',
        'Mudah dibersihkan',
        'Hygienis untuk makanan',
        'Desain profesional',
        'Tahan panas dan air',
        'Branding laser engraving',
        'Garansi 2 tahun'
      ],
      includes: [
        '1 unit gerobak stainless',
        'Roda heavy duty 4 buah',
        'Kunci roda 2 buah',
        'Rak stainless',
        'Laci stainless',
        'Branding laser',
        'Buku panduan',
        'Garansi card'
      ]
    }
  ]; */

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center px-4">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-50 animate-pulse"></div>
            <div className="relative flex items-center justify-center h-full">
              <span className="text-7xl opacity-50">❌</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Produk Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Produk yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link to="/katalog" className="btn-primary inline-flex">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: 'Katalog', href: '/katalog' },
            { label: product.name }
          ]}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative mb-4 group">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {product.badge}
                  </span>
                </div>
              )}
              
              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}

              {/* Zoom Button */}
              <button
                onClick={() => setShowGallery(true)}
                className="absolute bottom-4 right-4 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Open image gallery"
              >
                <ZoomIn size={24} className="text-primary-600" />
              </button>
              
              <LazyImage
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Gambar ${currentImageIndex + 1}`}
                className="w-full h-96 object-cover rounded-2xl shadow-xl cursor-pointer"
                onClick={() => setShowGallery(true)}
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-primary-600 scale-105 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <LazyImage
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-display font-bold mb-4 text-gray-900">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{product.rating}</span>
                <span className="text-gray-600">({product.reviews} ulasan)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600 capitalize">{product.category}</span>
            </div>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {product.shortDesc}
            </p>

            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-6 mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-gray-600">Harga Mulai</span>
              </div>
              <div className="text-4xl font-bold text-primary-600 mb-4">
                Rp {parseInt(product.price).toLocaleString('id-ID')}
              </div>
              <WhatsAppButton
                productName={product.name}
                productPrice={product.price}
                className="btn-whatsapp w-full justify-center text-lg py-4"
              >
                Pesan Sekarang
              </WhatsAppButton>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Garansi</div>
                  <div className="font-semibold">1-2 Tahun</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Truck className="text-green-600" size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Pengiriman</div>
                  <div className="font-semibold">Seluruh Indonesia</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-purple-600" size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Kualitas</div>
                  <div className="font-semibold">Premium</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Ruler className="text-orange-600" size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Custom</div>
                  <div className="font-semibold">Bisa</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card p-8">
          <div className="space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Deskripsi Produk</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Spesifikasi</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Keunggulan</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Includes */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Yang Anda Dapatkan</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {product.includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Package className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 card p-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Tertarik dengan Produk Ini?</h3>
          <p className="text-xl mb-6 text-blue-100">
            Hubungi kami sekarang untuk konsultasi dan penawaran terbaik!
          </p>
          <WhatsAppButton
            productName={product.name}
            productPrice={product.price}
            className="btn-whatsapp inline-flex text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-50"
          >
            Konsultasi via WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
