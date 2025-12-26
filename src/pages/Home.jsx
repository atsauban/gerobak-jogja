import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Award,
  Users,
  Wrench,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import EmptyState from '../components/EmptyState';
import LazyImage from '../components/LazyImage';
import RevealOnScroll from '../components/RevealOnScroll';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { CONTACT_INFO } from '../config/contact';
import { useProducts } from '../context/ProductContext';
import PremiumProductCard from '../components/PremiumProductCard';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import AuroraBackground from '../components/AuroraBackground';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

function Hero3DCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative group w-full h-[500px]"
    >
      <div
        className="absolute inset-4 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden"
        style={{ transform: "translateZ(50px)" }}
      >
        <LazyImage
          src="https://res.cloudinary.com/dpjpj7l1y/image/upload/v1766787992/1762505508924_result-removebg-preview_vqntrn.webp"
          alt="Gerobak Premium 3D Design"
          className="w-full h-full object-contain -translate-y-20 scale-[0.9] select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>

        {/* Shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform ease-in-out"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        style={{ transform: "translateZ(80px)" }}
        className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <Award size={24} />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">Premium</p>
          <p className="text-gray-500 text-sm">Quality Guaranteed</p>
        </div>
      </motion.div>

      <motion.div
        style={{ transform: "translateZ(60px)" }}
        className="absolute top-10 -right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="font-bold text-gray-900">Best Seller</p>
            <p className="text-xs text-gray-500">Tahun Ini</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

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
        <AuroraBackground className="min-h-[90vh]">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Left Content */}
              <div className="max-w-2xl text-left mx-0">
                {/* Badge Removed */}

                <RevealOnScroll delay={400}>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] sm:leading-[1.1] mb-4 sm:mb-6 text-white tracking-tight">
                    Gerobak Premium <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 animate-gradient-x">
                      Bisnis Sukses
                    </span>
                  </h1>
                </RevealOnScroll>

                <RevealOnScroll delay={600}>
                  <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-0">
                    Melayani pembuatan dan pemesanan berbagai jenis gerobak, booth, etalase, dan berbagai jenis produk dengan kualitas terjamin.
                  </p>
                </RevealOnScroll>

                <RevealOnScroll delay={800}>
                  <div className="flex flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <Link
                      to="/katalog"
                      className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] text-xs sm:text-base whitespace-nowrap"
                    >
                      Lihat Katalog
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <WhatsAppButton
                      message={CONTACT_INFO.messages.consultation}
                      className="!bg-white/10 !backdrop-blur-md !border-white/20 !text-white hover:!bg-white/20 !px-4 !py-3 !sm:px-8 !sm:py-4 !rounded-xl flex-1 sm:flex-none text-xs sm:text-base justify-center inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      Konsultasi Gratis
                    </WhatsAppButton>
                  </div>
                </RevealOnScroll>


              </div>

              {/* Right Image - 3D Effect */}
              <div className="hidden lg:block perspective-1000">
                <RevealOnScroll delay={600}>
                  <Hero3DCard />
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </AuroraBackground>

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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <RevealOnScroll key={index} delay={index * 100}>
                    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${getColorClasses(feature.color)} group-hover:scale-110 transition-transform`}
                      >
                        <Icon size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
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
            <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
        {/* CTA Section Removed */}
      </div>
    </PageTransition>
  );
}
