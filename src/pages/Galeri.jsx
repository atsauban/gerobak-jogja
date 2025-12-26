import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ZoomIn, Image as ImageIcon, Camera, Sparkles } from 'lucide-react';
import { getGalleryImages } from '../services/firebaseService';
import { handleError } from '../utils/errorHandler';
import ImageGallery from '../components/ImageGallery';
import LazyImage from '../components/LazyImage';
import { GallerySkeleton } from '../components/LoadingSkeleton';
import PageTransition from '../components/PageTransition';

export default function Galeri() {
  /* Category logic removed */

  const [selectedImage, setSelectedImage] = useState(null);
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

  /* Categories removed */

  // No filtering needed
  const filteredImages = images;

  return (
    <PageTransition className="pt-16 min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                <Camera size={14} />
                Portfolio
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                <Sparkles size={14} />
                {images.length}+ Karya
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
              Galeri Produk
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Lihat berbagai hasil karya kami yang telah dipercaya oleh ratusan
              pelanggan di seluruh Indonesia.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        {/* Category Filter Removed */}

        {/* Results Count */}
        {!loading && filteredImages.length > 0 && (
          <p className="text-sm text-gray-600 mb-6">
            Menampilkan{' '}
            <span className="font-semibold text-gray-900">
              {filteredImages.length}
            </span>{' '}
            gambar
            gambar
          </p>
        )}

        {/* Loading State */}
        {loading && <GallerySkeleton count={9} />}

        {/* Images Grid - Masonry Layout */}
        {!loading && filteredImages.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="relative overflow-hidden rounded-2xl cursor-pointer group break-inside-avoid bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <LazyImage
                  src={image.url}
                  alt={image.title}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {/* Zoom Icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn size={20} className="text-white" />
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-medium text-white text-sm line-clamp-1">
                      {image.title}
                    </p>
                    {image.description && (
                      <p className="text-white/70 text-xs mt-1 line-clamp-1">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                {/* Category Badge removed */}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="text-gray-400" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak Ada Gambar
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Galeri masih kosong
            </p>
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {selectedImage && (
        <ImageGallery
          images={filteredImages.map((img) => img.url)}
          initialIndex={filteredImages.findIndex(
            (img) => img.id === selectedImage.id
          )}
          onClose={() => setSelectedImage(null)}
          title={selectedImage.title}
          showCounter={true}
          enableZoom={true}
        />
      )}
    </PageTransition>
  );
}
