import WhatsAppButton from '../WhatsAppButton';

export default function StickyBottomBar({ product }) {
    if (!product) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden safe-area-bottom animate-slide-up">
            <div className="flex gap-3 items-center">
                <div className="flex-1">
                    <p className="text-xs text-gray-500 line-clamp-1">{product.name}</p>
                    <p className="text-lg font-bold text-primary-600">
                        Rp {parseInt(product.price).toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="flex-1">
                    <WhatsAppButton
                        productName={product.name}
                        productPrice={product.price}
                        className="w-full btn-whatsapp justify-center py-2.5 text-sm font-bold shadow-none"
                    >
                        Pesan Sekarang
                    </WhatsAppButton>
                </div>
            </div>
        </div>
    );
}
