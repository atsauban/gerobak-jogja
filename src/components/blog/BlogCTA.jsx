import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import WhatsAppButton from '../WhatsAppButton';

export default function BlogCTA() {
    return (
        <div className="bg-gray-900 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Tertarik dengan Gerobak Kami?</h3>
            <p className="text-gray-300 mb-6">
                Konsultasikan kebutuhan bisnis Anda dengan tim kami!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    to="/katalog"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Lihat Katalog
                    <ArrowRight size={18} />
                </Link>
                <WhatsAppButton className="btn-whatsapp justify-center">
                    Hubungi Kami
                </WhatsAppButton>
            </div>
        </div>
    );
}
