import { Star, Package, Truck, Shield, Ruler } from 'lucide-react';
import WhatsAppButton from '../WhatsAppButton';
import ShareButton from '../ShareButton';

export default function ProductInfo({ product }) {
    return (
        <div>
            {/* Category Badge */}
            <span className="inline-block text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md mb-3 capitalize">
                {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-3 text-gray-900">
                {product.name}
            </h1>

            {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{product.reviews} ulasan</span>
                </div>
            )}

            <p className="text-gray-600 mb-6 leading-relaxed">
                {product.shortDesc}
            </p>

            {/* Price & CTA */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                <div className="text-sm text-gray-500 mb-1">Harga Mulai</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                </div>
                <div className="flex gap-2">
                    <WhatsAppButton
                        productName={product.name}
                        productPrice={product.price}
                        className="btn-whatsapp flex-1 justify-center"
                    >
                        Pesan Sekarang
                    </WhatsAppButton>
                    <ShareButton
                        title={product.name}
                        text={`Cek produk ${product.name} di Gerobak Jogja!`}
                        className="px-4 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-xl"
                    />
                </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: Package, label: 'Garansi', value: '1-2 Tahun', color: 'blue' },
                    { icon: Truck, label: 'Pengiriman', value: 'Seluruh Indonesia', color: 'green' },
                    { icon: Shield, label: 'Kualitas', value: 'Premium', color: 'purple' },
                    { icon: Ruler, label: 'Custom', value: 'Tersedia', color: 'orange' },
                ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            item.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                            item.color === 'green' ? 'bg-green-100 text-green-600' :
                            item.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                            'bg-orange-100 text-orange-600'
                        }`}>
                            <item.icon size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">{item.label}</div>
                            <div className="text-sm font-medium text-gray-900">{item.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
