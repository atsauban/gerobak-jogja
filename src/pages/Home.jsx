import { Link } from 'react-router-dom';
import { ShoppingCart, Award, Users, Wrench, ArrowRight, Star, TrendingUp } from 'lucide-react';
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

export default function Home() {
  const { products, loading } = useProducts();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gerobak Jogja",
    "alternateName": ["Gerobak Jogja Official", "Pusat Gerobak Jogja"],
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/katalog?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gerobak Jogja",
    "url": window.location.origin,
    "logo": `${window.location.origin}/images/logo.webp`,
    "sameAs": [
      "https://www.instagram.com/gerobakjogja",
      "https://www.facebook.com/gerobakjogja"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+6282327220077",
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": "Indonesian"
    }
  };

  const features = [
    { icon: <Award className="w-6 h-6" />, title: 'Kualitas Terjamin', desc: 'Material pilihan dan pengerjaan profesional', colorTheme: 'blue' },
    { icon: <Wrench className="w-6 h-6" />, title: 'Custom Design', desc: 'Desain sesuai kebutuhan bisnis Anda', colorTheme: 'emerald' },
    { icon: <Users className="w-6 h-6" />, title: 'Berpengalaman', desc: 'Lebih dari 10 tahun melayani pelanggan', colorTheme: 'orange' },
    { icon: <ShoppingCart className="w-6 h-6" />, title: 'Harga Kompetitif', desc: 'Harga terbaik dengan kualitas premium', colorTheme: 'purple' },
  ];

  // Get only featured products (max 3)
  const featuredProducts = products.filter(p => p.featured === true).slice(0, 3);

  const stats = [
    { value: 100, suffix: '+', label: 'Pelanggan Puas', icon: <Users className="w-8 h-8" />, duration: 2000 },
    { value: 10, suffix: '+', label: 'Tahun Pengalaman', icon: <Award className="w-8 h-8" />, duration: 1500 },
    { value: 100, suffix: '+', label: 'Gerobak Terjual', icon: <TrendingUp className="w-8 h-8" />, duration: 2500 },
    { value: 15, suffix: '+', label: 'Kota Terjangkau', icon: <ShoppingCart className="w-8 h-8" />, duration: 1800 },
  ];

  return (
    <div className="pt-16">
      <SEO
        title="Spesialis Gerobak & Booth Custom"
        description="Jasa pembuatan gerobak aluminium, kayu, dan baja ringan di Jogja. Desain custom, harga kompetitif, dan pengerjaan rapi. Gratis konsultasi!"
        schema={[websiteSchema, organizationSchema]}
      />
      {/* Hero Section */}
      <section className="relative text-white section-padding overflow-hidden">
        {/* Blurred Background Image */}
        <div className="absolute inset-0">
          <LazyImage
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Workshop Gerobak Jogja"
            className="w-full h-full object-cover filter blur-sm scale-110"
            loading="eager"
            fetchPriority="high"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/80 to-primary-900/90"></div>
        </div>

        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        {/* Subtle Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white/30 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/20 rotate-12"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/4 right-1/4 w-20 h-20 border border-accent-300/20 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto container-padding relative z-10">
          <div className="text-center">
            <RevealOnScroll delay={200}>
              <div className="inline-block mb-6 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-sm font-semibold border border-white/20 shadow-lg">
                ✨ Dipercaya oleh 100+ Pelanggan
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <h1 className="hero-title mb-6">
                <span className="block">Gerobak Premium</span>
                <span className="text-accent-300 block bg-gradient-to-r from-accent-300 to-accent-200 bg-clip-text text-transparent">Bisnis Sukses</span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={600}>
              <p className="hero-subtitle mb-8 text-blue-100 drop-shadow-sm">
                Dari <span className="font-bold text-accent-300">Rp 2.5 juta</span> sudah bisa punya gerobak berkualitas tinggi
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={800}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                <Link
                  to="/katalog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 hover:scale-105 active:scale-95"
                >
                  Lihat Katalog
                  <ArrowRight size={20} />
                </Link>
                <WhatsAppButton
                  message={CONTACT_INFO.messages.consultation}
                  className="btn-whatsapp justify-center hover:scale-105 active:scale-95 transition-transform duration-200"
                >
                  Konsultasi Gratis
                </WhatsAppButton>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Stats with Enhanced Glassmorphism */}
        <div className="max-w-7xl mx-auto container-padding mt-16">
          <RevealOnScroll delay={1000}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center glass rounded-2xl p-6 hover:bg-white/25 transition-all duration-300 group border border-white/20 backdrop-blur-lg shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <div className="flex justify-center mb-3 text-accent-300 group-hover:scale-105 transition-all duration-300">
                    {stat.icon}
                  </div>
                  <CountUpNumber
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={stat.duration}
                    className="text-3xl md:text-4xl font-display font-bold mb-2"
                  />
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Features with Scroll Reveal */}
      <section className="section-padding gradient-subtle">
        <div className="max-w-7xl mx-auto container-padding">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="section-title">Mengapa Pilih Kami?</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Kami berkomitmen memberikan produk terbaik dengan layanan yang memuaskan
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="feature-card group cursor-pointer">
                  <div className={`feature-card-icon ${feature.colorTheme}`}>
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="section-title">Produk Unggulan</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
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
                <RevealOnScroll key={product.id} delay={index * 150}>
                  <div className="h-full">
                    <PremiumProductCard product={product} />
                  </div>
                </RevealOnScroll>
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
      <section className="section-padding gradient-primary text-white">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Siap Memulai Bisnis Gerobak Anda?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
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
