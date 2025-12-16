import { Link } from 'react-router-dom';
import { Star, ArrowUpRight } from 'lucide-react';
import LazyImage from './LazyImage';
import WhatsAppButton from './WhatsAppButton';

export default function PremiumProductCard({ product, variant = 'grid' }) {
    const isFeatured = product.featured;
    const priceFormatted = parseInt(product.price).toLocaleString('id-ID');
    const productUrl = `/produk/${product.slug || product.id}`;
    const imageUrl = product.images?.[0] || product.image || 'https://via.placeholder.com/400x300?text=No+Image';

    // List View
    if (variant === 'list') {
        return (
            <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative sm:w-56 md:w-64 flex-shrink-0 aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-50">
                        <Link to={productUrl}>
                            <LazyImage
                                src={imageUrl}
                                alt={`Gerobak ${product.name}`}
                                className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                            />
                        </Link>
                        {isFeatured && (
                            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                                <Star size={10} fill="currentColor" />
                                Unggulan
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                            {product.category && (
                                <span className="inline-block text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded mb-2">
                                    {product.category}
                                </span>
                            )}
                            <Link to={productUrl}>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                    {product.name}
                                </h3>
                            </Link>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                {product.shortDesc || product.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div>
                                <span className="text-xs text-gray-400 block">Mulai dari</span>
                                <span className="text-xl font-bold text-gray-900">Rp {priceFormatted}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <WhatsAppButton
                                    productName={product.name}
                                    productPrice={product.price}
                                    className="!px-4 !py-2 !rounded-lg !text-sm"
                                    iconOnly={false}
                                >
                                    Pesan
                                </WhatsAppButton>
                                <Link
                                    to={productUrl}
                                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Detail
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid View (default)
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden h-full flex flex-col border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
            {/* Image */}
            <Link to={productUrl} className="relative aspect-square overflow-hidden bg-gray-50">
                <LazyImage
                    src={imageUrl}
                    alt={`Gerobak ${product.name} - ${product.category}`}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                {isFeatured && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow-sm">
                        <Star size={10} fill="currentColor" />
                        Unggulan
                    </span>
                )}
                {product.badge && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-primary-600 text-white text-xs font-bold rounded-full shadow-sm">
                        {product.badge}
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                {product.category && (
                    <span className="inline-block w-fit text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded mb-2">
                        {product.category}
                    </span>
                )}

                <Link to={productUrl}>
                    <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {product.shortDesc || product.description}
                </p>

                {/* Price & CTA */}
                <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                        <span className="text-xs text-gray-400 block">Mulai dari</span>
                        <span className="text-xl font-bold text-gray-900">Rp {priceFormatted}</span>
                    </div>

                    <Link
                        to={productUrl}
                        className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-200 group/btn"
                    >
                        <ArrowUpRight size={18} className="group-hover/btn:rotate-45 transition-transform duration-200" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
