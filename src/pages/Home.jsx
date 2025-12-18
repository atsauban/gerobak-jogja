import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Award,
  Users,
  Wrench,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import EmptyState from '../components/EmptyState';
import LazyImage from '../components/LazyImage';
import CountUpNumber from '../components/CountUpNumber';
import RevealOnScroll from '../components/RevealOnScroll';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { CONTACT_INFO } from '../config/contact';
import { useProducts } from '../context/ProductContext';
import PremiumProductCard from '../components/PremiumProductCard';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';

export default function Home() {
  const { products, loading } = useProducts();

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gerobak Jogja',
    alternateName: ['Gerobak Jogja Official', 'Pusat Gerobak Jogja'],
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${window.location.origin}/katalog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gerobak Jogja',
    url: window.location.origin,
    logo: `${window.location.origin}/images/logo.webp`,
    sameAs: [
      'https://www.instagram.com/gerobakjogja',
      'https://www.facebook.com/gerobakjogja',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+6282327220077',
      contactType: 'customer service',
      areaServed: 'ID',
      availableLanguage: 'Indonesian',
    },
  };

  const features = [
    {
      icon: Award,
      title: 'Kualitas Terjamin',
      desc: 'Material pilihan dan pengerjaan profesional',
      color: 'blue',
    },
    {
      icon: Wrench,
      title: 'Custom Design',
      desc: 'Desain sesuai kebutuhan bisnis Anda',
      color: 'emerald',
    },
    {
      icon: Users,
      title: 'Berpengalaman',
      desc: 'Lebih dari 10 tahun melayani pelanggan',
      color: 'orange',
    },
    {
      icon: ShoppingCart,
      title: 'Harga Kompetitif',
      desc: 'Harga terbaik dengan kualitas premium',
      color: 'purple',
    },
  ];

  const featuredProducts = products
    .filter((p) => p.featured === true)
    .slice(0, 3);

  const stats = [
    { value: 100, suffix: '+', label: 'Pelanggan Puas', duration: 2000 },
    { value: 10, suffix: '+', label: 'Tahun Pengalaman', duration: 1500 },
    { value: 100, suffix: '+', label: 'Gerobak Terjual', duration: 2500 },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <PageTransition>
    <div className="pt-16">
      <SEO
        title="Spesialis Gerobak & Booth Custom"
        description="Jasa pembuatan gerobak aluminium, kayu, dan baja ringan di Jogja. Desain custom, harga kompetitif, dan pengerjaan rapi. Gratis konsultasi!"
        schema={[websiteSchema, organizationSchema]}
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <LazyImage
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Workshop Gerobak Jogja"
            className="w-full h-full object-cover opacity-40"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/70"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <RevealOnScroll delay={200}>
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/10">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Dipercaya 100+ Pelanggan
                </span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-white tracking-tight">
                Gerobak Premium untuk{' '}
                <span className="text-primary-400">Bisnis Sukses</span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={600}>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                Mulai dari{' '}
                <span className="text-white font-semibold">Rp 2.5 juta</span> —
                dapatkan gerobak berkualitas tinggi dengan desain custom sesuai
                kebutuhan bisnis Anda.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={800}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/katalog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
                >
                  Lihat Katalog
                  <ArrowRight size={18} />
                </Link>
                <WhatsAppButton
                  message={CONTACT_INFO.messages.consultation}
                  className="btn-whatsapp justify-center"
                >
                  Konsultasi Gratis
                </WhatsAppButton>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={1000}>
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center sm:text-left">
                    <CountUpNumber
                      end={stat.value}
                      suffix={stat.suffix}
                      duration={stat.duration}
                      className="text-3xl font-display font-bold text-white"
                    />
                    <div className="text-sm text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-14">
              <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
                Keunggulan Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
                Mengapa Pilih Kami?
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Komitmen kami untuk memberikan produk terbaik dengan layanan
                memuaskan
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <RevealOnScroll key={index} delay={index * 100}>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getColorClasses(feature.color)} group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
                <Sparkles size={16} />
                Produk Pilihan
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">
                Produk Unggulan
              </h2>
              <p className="text-gray-600">
                Pilihan terbaik untuk memulai bisnis gerobak Anda
              </p>
            </div>
            {!loading && featuredProducts.length > 0 && (
              <Link
                to="/katalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all"
              >
                Lihat Semua
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {loading && <ProductGridSkeleton count={3} />}

          {!loading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <RevealOnScroll key={product.id} delay={index * 100}>
                  <PremiumProductCard product={product} />
                </RevealOnScroll>
              ))}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && (
            <EmptyState
              type="products"
              title="Belum Ada Produk Unggulan"
              description="Produk unggulan akan ditampilkan di sini."
              actionText="Lihat Semua Produk"
              actionLink="/katalog"
            />
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Siap Memulai Bisnis Anda?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Konsultasikan kebutuhan gerobak Anda dengan tim kami. Gratis!
            </p>
            <WhatsAppButton
              message={CONTACT_INFO.messages.consultation}
              className="!bg-white !text-gray-900 hover:!bg-gray-100 !px-8 !py-3.5 !rounded-xl !font-semibold inline-flex shadow-lg"
            >
              Hubungi Kami Sekarang
            </WhatsAppButton>
          </RevealOnScroll>
        </div>
      </section>
    </div>
    </PageTransition>
  );
}
