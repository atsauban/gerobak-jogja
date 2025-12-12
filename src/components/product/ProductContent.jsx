import { Check, Package } from 'lucide-react';

export default function ProductContent({ product }) {
    return (
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
                        {Object.entries(product.specifications || {}).map(([key, value]) => (
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
                        {(product.features || []).map((feature, index) => (
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
                        {(product.includes || []).map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <Package className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
