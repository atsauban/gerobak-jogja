import WhatsAppButton from '../WhatsAppButton';

export default function ProductCTA({ product }) {
    return (
        <div className="mt-12 card p-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Tertarik dengan Produk Ini?</h3>
            <p className="text-xl mb-6 text-blue-100">
                Hubungi kami sekarang untuk konsultasi dan penawaran terbaik!
            </p>
            <WhatsAppButton
                productName={product.name}
                productPrice={product.price}
                className="btn-whatsapp inline-flex text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-50"
            >
                Konsultasi via WhatsApp
            </WhatsAppButton>
        </div>
    );
}
