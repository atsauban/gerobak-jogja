import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import LazyImage from '../LazyImage';
import ImageGallery from '../ImageGallery';

export default function ProductImageGallery({ product }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);

    // Safely handle missing images
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
            <div className="h-96 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                No Images
            </div>
        );
    }

    return (
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
                {images.length > 1 && (
                    <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {images.length}
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
                    src={images[currentImageIndex]}
                    alt={`${product.name} - Gambar ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-2xl shadow-xl cursor-pointer"
                    onClick={() => setShowGallery(true)}
                />

                {images.length > 1 && (
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
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index
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

            {/* Image Gallery Modal */}
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
