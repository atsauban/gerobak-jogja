import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { getFAQs } from '../services/firebaseService';
import { handleError } from '../utils/errorHandler';
import { FAQSchema } from './StructuredData';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const data = await getFAQs();
      setFaqs(data);
    } catch (error) {
      handleError(error, 'Gagal memuat FAQ. Menampilkan data default.');
      // Fallback to default FAQs
      setFaqs([
        {
          question: 'Berapa lama waktu pembuatan gerobak?',
          answer: 'Waktu pembuatan gerobak berkisar 7-14 hari kerja tergantung tingkat kesulitan dan antrian pesanan.'
        },
        {
          question: 'Apakah bisa custom design sesuai keinginan?',
          answer: 'Tentu saja! Kami menerima custom design sesuai kebutuhan Anda.'
        },
        {
          question: 'Apakah ada garansi untuk produk?',
          answer: 'Ya, kami memberikan garansi untuk kualitas material dan pengerjaan.'
        },
        {
          question: 'Bagaimana cara pemesanan?',
          answer: 'Anda bisa menghubungi kami via WhatsApp atau datang langsung ke workshop.'
        },
        {
          question: 'Apakah melayani pengiriman ke luar kota?',
          answer: 'Ya, kami melayani pengiriman ke seluruh Indonesia.'
        },
        {
          question: 'Apa saja metode pembayaran yang tersedia?',
          answer: 'Kami menerima pembayaran via transfer bank, e-wallet, dan cash.'
        },
        {
          question: 'Apakah bisa lihat contoh gerobak secara langsung?',
          answer: 'Tentu! Anda bisa datang ke workshop kami di Yogyakarta untuk melihat contoh gerobak dan berkonsultasi langsung dengan tim kami. Silakan hubungi kami terlebih dahulu untuk membuat janji.'
        },
        {
          question: 'Bagaimana perawatan gerobak agar awet?',
          answer: 'Untuk gerobak aluminium: bersihkan secara rutin dan hindari benturan keras. Untuk gerobak kayu: aplikasikan cat/vernis ulang setiap 6-12 bulan. Untuk stainless steel: lap dengan kain lembut dan hindari bahan kimia keras.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-primary-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50/50">
      <FAQSchema faqs={faqs} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">
            Pertanyaan Umum
          </h2>
          <p className="text-gray-600">
            Temukan jawaban untuk pertanyaan seputar produk dan layanan kami
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  size={20}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 text-sm mb-4">Masih ada pertanyaan lain?</p>
          <a 
            href="https://wa.me/6282327220077?text=Halo%20Gerobak%20Jogja,%20saya%20punya%20pertanyaan"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  );
}
