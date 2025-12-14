import { Link } from 'react-router-dom';
import { Star, Eye, Zap } from 'lucide-react';
import LazyImage from './LazyImage';
import WhatsAppButton from './WhatsAppButton';

export default function PremiumProductCard({ product, onQuickView }) {
    const isFeatured = product.featured;
    const priceFormatted = parseInt(product.price).toLocaleString('id-ID');

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col border border-gray-100">

            {/* Image Container with Zoom & Overlay */}
            <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center">
                <LazyImage
                    src={product.images?.[0] || product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={`Gerobak ${product.name} - ${product.category}`}
                    className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Dark Gradient on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {isFeatured && (
                        <div className="bg-white/90 backdrop-blur-sm text-yellow-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-fade-in border border-white/50">
                            <Star size={12} fill="currentColor" />
                            <span>UNGGULAN</span>
                        </div>
                    )}
                </div>

                {product.badge && (
                    <div className="absolute top-4 right-4 z-20">
                        <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl shadow-accent-500/20 border-2 border-white/20">
                            {product.badge}
                        </span>
                    </div>
                )}

                {/* Hover Action Buttons (Slide Up) - Always visible on mobile, slide-up on desktop */}
                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-3 
                              translate-y-0 opacity-100 
                              lg:translate-y-10 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 
                              transition-all duration-300 delay-75">
                    <Link
                        to={`/produk/${product.slug || product.id}`}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-primary-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-lg"
                        title="Lihat Detail"
                    >
                        <Eye size={18} />
                    </Link>

                    {onQuickView && (
                        <button
                            onClick={() => onQuickView(product)}
                            className="hidden lg:flex w-10 h-10 bg-white rounded-full items-center justify-center text-gray-700 hover:bg-yellow-500 hover:text-white hover:scale-110 transition-all duration-300 shadow-lg"
                            title="Quick View"
                        >
                            <Zap size={18} />
                        </button>
                    )}

                    <div className="scale-100 hover:scale-110 transition-transform duration-300">
                        <WhatsAppButton
                            productName={product.name}
                            productPrice={product.price}
                            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg !p-0"
                            iconOnly={true}
                        />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col relative bg-white">
                {/* Decorative subtle pattern */}

                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {product.shortDesc || product.description}
                    </p>
                </div>

                {/* Price & Divider */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Mulai Dari</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                            Rp {priceFormatted}
                        </span>
                    </div>

                    <Link
                        to={`/produk/${product.slug || product.id}`}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1 group/link"
                    >
                        Detail
                        <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
