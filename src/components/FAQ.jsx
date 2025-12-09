import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { getFAQs } from '../services/firebaseService';

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
      console.error('Error loading FAQs:', error);
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

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full mb-4">
            <HelpCircle size={20} />
            <span className="font-semibold">FAQ</span>
          </div>
          <h2 className="section-title">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar produk dan layanan kami
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`flex-shrink-0 text-primary-600 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Masih ada pertanyaan lain?</p>
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
