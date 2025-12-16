import WhatsAppButton from '../WhatsAppButton';

export default function ProductCTA({ product }) {
    return (
        <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Tertarik dengan Produk Ini?</h3>
            <p className="text-gray-400 mb-6">
                Hubungi kami sekarang untuk konsultasi dan penawaran terbaik!
            </p>
            <WhatsAppButton
                productName={product.name}
                productPrice={product.price}
                className="btn-whatsapp inline-flex"
            >
                Konsultasi via WhatsApp
            </WhatsAppButton>
        </div>
    );
}
