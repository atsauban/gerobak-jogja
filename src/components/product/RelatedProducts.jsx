import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import LazyImage from '../LazyImage';

export default function RelatedProducts({ currentProduct }) {
    const { getProductsByCategory } = useProducts();

    if (!currentProduct) return null;

    const relatedProducts = getProductsByCategory(currentProduct.category)
        .filter(p => p.id !== currentProduct.id)
        .slice(0, 4);

    if (relatedProducts.length === 0) return null;

    return (
        <div className="mt-12 pt-12 border-t border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Produk Sejenis</h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((product) => (
                    <Link
                        key={product.id}
                        to={`/produk/${product.slug || product.id}`}
                        className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="aspect-square overflow-hidden bg-gray-50">
                            <LazyImage
                                src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="p-3">
                            <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                {product.name}
                            </h4>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900">
                                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                                </span>
                                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
