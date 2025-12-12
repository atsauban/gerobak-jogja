import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import LazyImage from '../LazyImage';

export default function RelatedProducts({ currentProduct }) {
    const { getProductsByCategory } = useProducts();

    if (!currentProduct) return null;

    // Get products in same category, exclude current, limit to 4
    const relatedProducts = getProductsByCategory(currentProduct.category)
        .filter(p => p.id !== currentProduct.id)
        .slice(0, 4);

    if (relatedProducts.length === 0) return null;

    return (
        <div className="mt-16 pt-16 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Produk Sejenis</h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {relatedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <LazyImage
                                src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </div>

                        <div className="p-3 md:p-4">
                            <h4 className="font-bold text-sm md:text-base text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2 h-8 hidden md:block">
                                {product.shortDesc || product.desc}
                            </p>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <span className="text-primary-600 font-bold text-sm md:text-base">
                                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                                </span>
                                <Link
                                    to={`/produk/${product.slug || product.id}`}
                                    className="p-1.5 md:p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-primary-600 hover:text-white transition-all duration-300 self-end md:self-auto"
                                    aria-label="Lihat detail"
                                >
                                    <Eye size={16} className="md:w-[18px] md:h-[18px]" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
