import { useState, useEffect } from 'react';
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { getGalleryImages } from '../services/firebaseService';

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
      console.error('Error loading gallery images:', error);
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
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  console.error('Image failed to load:', image.url);
                  e.target.src = 'https://via.placeholder.com/500x400?text=Image+Error';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-6">
                <ZoomIn className="text-white mb-3 transform scale-0 group-hover:scale-100 transition-transform duration-300" size={32} />
                <p className="text-white font-bold text-lg text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.title}
                </p>
              </div>
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
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

      {/* Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X size={28} />
          </button>
          <div className="max-w-5xl w-full animate-scale-in">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="text-center mt-6">
              <p className="text-white text-2xl font-bold mb-2">{selectedImage.title}</p>
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm">
                {categories.find(c => c.id === selectedImage.category)?.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
