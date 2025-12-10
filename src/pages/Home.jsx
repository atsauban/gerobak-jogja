import { Link } from 'react-router-dom';
import { ShoppingCart, Award, Users, Wrench, ArrowRight, Star, TrendingUp } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import EmptyState from '../components/EmptyState';
import LazyImage from '../components/LazyImage';
import CountUpNumber from '../components/CountUpNumber';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedBackground from '../components/AnimatedBackground';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { CONTACT_INFO } from '../config/contact';
import { useProducts } from '../context/ProductContext';
import { useParallax } from '../hooks/useParallax';

export default function Home() {
  const { products, loading } = useProducts();
  const parallaxOffset = useParallax(0.5);
  const features = [
    { icon: <Award className="w-12 h-12" />, title: 'Kualitas Terjamin', desc: 'Material pilihan dan pengerjaan profesional', color: 'from-blue-500 to-blue-600' },
    { icon: <Wrench className="w-12 h-12" />, title: 'Custom Design', desc: 'Desain sesuai kebutuhan bisnis Anda', color: 'from-purple-500 to-purple-600' },
    { icon: <Users className="w-12 h-12" />, title: 'Berpengalaman', desc: 'Lebih dari 10 tahun melayani pelanggan', color: 'from-green-500 to-green-600' },
    { icon: <ShoppingCart className="w-12 h-12" />, title: 'Harga Kompetitif', desc: 'Harga terbaik dengan kualitas premium', color: 'from-orange-500 to-orange-600' },
  ];

  // Get only featured products (max 3)
  const featuredProducts = products.filter(p => p.featured === true).slice(0, 3);

  const stats = [
    { value: 500, suffix: '+', label: 'Pelanggan Puas', icon: <Users className="w-8 h-8" />, duration: 2000 },
    { value: 10, suffix: '+', label: 'Tahun Pengalaman', icon: <Award className="w-8 h-8" />, duration: 1500 },
    { value: 1000, suffix: '+', label: 'Gerobak Terjual', icon: <TrendingUp className="w-8 h-8" />, duration: 2500 },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold">
              ✨ Dipercaya oleh 500+ Pelanggan
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-slide-up leading-tight">
              Gerobak Berkualitas<br />
              <span className="text-accent-300">untuk Bisnis Anda</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto animate-slide-up">
              Spesialis pembuatan gerobak aluminium, kayu, dan stainless steel dengan desain custom dan harga terbaik
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up max-w-md sm:max-w-none mx-auto">
              <Link 
                to="/katalog" 
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                Lihat Katalog
                <ArrowRight size={20} />
              </Link>
              <WhatsAppButton 
                message={CONTACT_INFO.messages.consultation}
                className="btn-whatsapp justify-center"
              >
                Konsultasi Gratis
              </WhatsAppButton>
            </div>
          </div>
        </div>

        {/* Stats with Glassmorphism */}
        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20"
          style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center glass rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group animate-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-3 text-accent-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  {stat.icon}
                </div>
                <CountUpNumber
                  end={stat.value}
                  suffix={stat.suffix}
                  duration={stat.duration}
                  className="text-4xl font-display font-bold mb-2"
                />
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with Scroll Reveal */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="section-title">Mengapa Pilih Kami?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Kami berkomitmen memberikan produk terbaik dengan layanan yang memuaskan
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} animation="zoom-in" delay={index * 100}>
                <div className="card-3d p-8 text-center group cursor-pointer">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 
                                group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-float`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Produk Unggulan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pilihan terbaik untuk memulai bisnis gerobak Anda
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProductGridSkeleton count={3} />
            </div>
          )}

          {/* Featured Products */}
          {!loading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} animation="zoom-in" delay={index * 150}>
              <div 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <LazyImage
                    src={product.images?.[0] || product.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={`Gerobak ${product.name} - Produk Unggulan`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  {product.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {product.badge}
                      </span>
                    </div>
                  )}
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      <span>Unggulan</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    {product.shortDesc || product.description}
                  </p>
                  <p className="text-primary-600 font-bold text-2xl mb-6">
                    Mulai Rp {parseInt(product.price).toLocaleString('id-ID')}
                  </p>
                  <div className="flex gap-2">
                    <Link 
                      to={`/produk/${product.id}`}
                      className="flex-1 btn-primary justify-center"
                    >
                      Lihat Detail
                    </Link>
                    <WhatsAppButton 
                      productName={product.name}
                      className="flex-1 btn-whatsapp justify-center"
                    >
                      Pesan
                    </WhatsAppButton>
                  </div>
                </div>
              </div>
              </ScrollReveal>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && featuredProducts.length === 0 && (
            <EmptyState
              type="products"
              title="Belum Ada Produk Unggulan"
              description="Produk unggulan akan ditampilkan di sini. Admin dapat memilih maksimal 3 produk unggulan."
              actionText="Lihat Semua Produk"
              actionLink="/katalog"
            />
          )}

          {/* View All Link */}
          {!loading && featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                to="/katalog" 
                className="inline-flex items-center gap-2 text-primary-600 font-semibold text-lg hover:gap-4 transition-all"
              >
                Lihat Semua Produk
                <ArrowRight size={20} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Siap Memulai Bisnis Gerobak Anda?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Konsultasikan kebutuhan Anda dengan tim kami sekarang juga!
          </p>
          <WhatsAppButton 
            message={CONTACT_INFO.messages.consultation}
            className="btn-whatsapp inline-flex text-lg px-8 py-4"
          >
            Hubungi Kami Sekarang
          </WhatsAppButton>
        </div>
      </section>
    </div>
  );
}
