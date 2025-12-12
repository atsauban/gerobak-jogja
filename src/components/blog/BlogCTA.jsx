import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import WhatsAppButton from '../WhatsAppButton';

export default function BlogCTA() {
    return (
        <div className="card p-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Tertarik dengan Gerobak Kami?</h3>
            <p className="text-lg mb-6 text-blue-100">
                Konsultasikan kebutuhan bisnis Anda dengan tim kami!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/katalog"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    Lihat Katalog
                    <ArrowRight size={20} />
                </Link>
                <WhatsAppButton className="btn-whatsapp justify-center">
                    Hubungi Kami
                </WhatsAppButton>
            </div>
        </div>
    );
}
