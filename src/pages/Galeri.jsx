import { useState, useEffect } from 'react';
import { ZoomIn, Image as ImageIcon } from 'lucide-react';
import { getGalleryImages } from '../services/firebaseService';
import { handleError } from '../utils/errorHandler';
import ImageGallery from '../components/ImageGallery';

export default function Galeri() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getGalleryImages();
      setImages(data);
    } catch (error) {
      handleError(error, 'Gagal memuat gambar galeri. Silakan refresh halaman.');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'semua', name: 'Semua' },
    { id: 'aluminium', name: 'Aluminium' },
    { id: 'kayu', name: 'Kayu' },
    { id: 'stainless', name: 'Stainless Steel' },
    { id: 'kombinasi', name: 'Kombinasi' },
    { id: 'custom', name: 'Custom' },
  ];

  const filteredImages = selectedCategory === 'semua' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading galeri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full mb-4">
            <ImageIcon size={20} />
            <span className="font-semibold">Portfolio Kami</span>
          </div>
          <h1 className="section-title">Galeri Produk</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lihat berbagai hasil karya kami yang telah dipercaya oleh ratusan pelanggan
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 rounded-full font-medium transition-all duration-300 min-h-[44px] min-w-[44px] ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
              }`}
              aria-pressed={selectedCategory === cat.id}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Images Grid - Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group break-inside-avoid animate-scale-in hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  console.error('Image failed to load:', image.url);
                  e.target.src = 'https://via.placeholder.com/500x400?text=Image+Error';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-6">
                <ZoomIn className="text-white mb-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 animate-float" size={32} />
                <p className="text-white font-bold text-lg text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.title}
                </p>
              </div>
              {/* Badge with Glassmorphism */}
              <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-sm font-semibold text-white backdrop-blur-md">
                {categories.find(c => c.id === image.category)?.name}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <ImageIcon className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">Tidak ada gambar dalam kategori ini</p>
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {selectedImage && (
        <ImageGallery
          images={filteredImages.map(img => img.url)}
          initialIndex={filteredImages.findIndex(img => img.id === selectedImage.id)}
          onClose={() => setSelectedImage(null)}
          title={selectedImage.title}
          showCounter={true}
          enableZoom={true}
        />
      )}
    </div>
  );
}
