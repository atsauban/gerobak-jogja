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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-primary-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Testimoni
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">
            Apa Kata Mereka?
          </h2>
          <p className="text-gray-600">
            Kepuasan pelanggan adalah prioritas kami
          </p>
        </div>

        <div className="relative overflow-hidden group">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

          {/* Marquee Container */}
          <div className="flex gap-6 w-max animate-marquee group-hover:pause">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-80 flex-shrink-0 bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=0284c7&color=fff`}
                    alt={testimonial.name}
                    className="w-11 h-11 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{testimonial.business}</p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
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
