import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import LazyImage from '../LazyImage';
import ImageGallery from '../ImageGallery';

export default function ProductImageGallery({ product }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);

    const images = product.images || [];
    const hasImages = images.length > 0;

    const nextImage = () => {
        if (!hasImages) return;
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        if (!hasImages) return;
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!hasImages) {
        return (
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center">
                <p className="text-gray-400">Tidak ada gambar</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Main Image */}
            <div className="relative group rounded-2xl overflow-hidden bg-white border border-gray-100">
                {/* Badge */}
                {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-medium">
                            {product.badge}
                        </span>
                    </div>
                )}

                {/* Counter */}
                {images.length > 1 && (
                    <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium text-gray-700 border border-gray-100">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                )}

                {/* Image */}
                <div
                    className="aspect-[4/3] cursor-pointer"
                    onClick={() => setShowGallery(true)}
                >
                    <LazyImage
                        src={images[currentImageIndex]}
                        alt={`${product.name} - Gambar ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain p-2 sm:p-6 transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                </div>

                {/* Expand Button */}
                <button
                    onClick={() => setShowGallery(true)}
                    className="absolute bottom-3 right-3 z-10 w-9 h-9 bg-gray-900 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800"
                    aria-label="Perbesar"
                >
                    <Expand size={16} />
                </button>

                {/* Navigation */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white text-gray-700 rounded-lg flex items-center justify-center shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                            aria-label="Sebelumnya"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white text-gray-700 rounded-lg flex items-center justify-center shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                            aria-label="Selanjutnya"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative flex-1 max-w-[80px] aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === index
                                    ? 'border-gray-900'
                                    : 'border-gray-100 hover:border-gray-300 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <LazyImage
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-contain p-1 bg-white"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Gallery Modal */}
            {showGallery && (
                <ImageGallery
                    images={images}
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
