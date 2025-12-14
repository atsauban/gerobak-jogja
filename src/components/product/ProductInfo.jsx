import { Star, Package, Truck, Shield, Ruler } from 'lucide-react';
import WhatsAppButton from '../WhatsAppButton';
import ShareButton from '../ShareButton';

export default function ProductInfo({ product }) {
    return (
        <div>
            <h1 className="text-4xl font-display font-bold mb-4 text-gray-900">
                {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{product.rating}</span>
                    <span className="text-gray-600">({product.reviews} ulasan)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600 capitalize">{product.category}</span>
            </div>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {product.shortDesc}
            </p>

            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-6 mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-gray-600">Harga Mulai</span>
                </div>
                <div className="text-4xl font-bold text-primary-600 mb-4">
                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                </div>
                <div className="flex gap-3">
                    <WhatsAppButton
                        productName={product.name}
                        productPrice={product.price}
                        className="btn-whatsapp flex-1 justify-center text-lg py-4"
                    >
                        Pesan Sekarang
                    </WhatsAppButton>
                    <ShareButton
                        title={product.name}
                        text={`Cek produk ${product.name} di Gerobak Jogja! Harga mulai Rp ${parseInt(product.price).toLocaleString('id-ID')}`}
                        className="px-4 py-4 bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 rounded-xl"
                    />
                </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="text-blue-600" size={20} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">Garansi</div>
                        <div className="font-semibold">1-2 Tahun</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Truck className="text-green-600" size={20} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">Pengiriman</div>
                        <div className="font-semibold">Seluruh Indonesia</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="text-purple-600" size={20} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">Kualitas</div>
                        <div className="font-semibold">Premium</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Ruler className="text-orange-600" size={20} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-600">Custom</div>
                        <div className="font-semibold">Bisa</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
