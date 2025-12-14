import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTestimonials } from '../services/firebaseService';
import { handleError } from '../utils/errorHandler';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      handleError(error, 'Gagal memuat testimoni. Menampilkan data default.');
      // Fallback to default testimonials
      setTestimonials([
        {
          id: 1,
          name: 'Budi Santoso',
          business: 'Warung Kopi Budi',
          rating: 5,
          text: 'Gerobak aluminium dari Gerobak Jogja sangat berkualitas! Sudah 2 tahun pakai masih seperti baru.',
          image: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=0284c7&color=fff'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full mb-4">
            <Star className="fill-current" size={20} />
            <span className="font-semibold">Testimoni Pelanggan</span>
          </div>
          <h2 className="section-title">Apa Kata Mereka?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kepuasan pelanggan adalah prioritas kami
          </p>
        </div>

        <div className="relative overflow-hidden group">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

          {/* Marquee Container */}
          <div className="flex gap-8 w-max animate-marquee group-hover:pause">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-80 md:w-96 flex-shrink-0 card p-8 relative hover:scale-105 transition-transform duration-300"
              >
                <Quote className="absolute top-6 right-6 text-primary-100" size={48} />

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=0284c7&color=fff`}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-2 border-primary-100"
                  />
                  <div>
                    <h4 className="font-bold text-base text-gray-900 line-clamp-1">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{testimonial.business}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed relative z-10 line-clamp-4">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
