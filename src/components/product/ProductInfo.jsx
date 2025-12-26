import { Star, Package, Truck, Shield, Ruler } from 'lucide-react';
import WhatsAppButton from '../WhatsAppButton';
import ShareButton from '../ShareButton';

export default function ProductInfo({ product }) {
    return (
        <div>


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
                        Pesan
                    </WhatsAppButton>
                    <ShareButton
                        title={product.name}
                        text={`Cek produk ${product.name} di Gerobak Jogja!`}
                        className="px-4 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-xl"
                    />
                </div>
            </div>


        </div>
    );
}
