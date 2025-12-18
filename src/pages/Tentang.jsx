import {
  CheckCircle,
  Target,
  Eye,
  Award,
  Users,
  TrendingUp,
  Heart,
  MapPin,
  Calendar,
  Wrench,
} from 'lucide-react';
import LazyImage from '../components/LazyImage';
import PageTransition, { FadeInView } from '../components/PageTransition';

export default function Tentang() {
  const stats = [
    { value: '10+', label: 'Tahun Pengalaman', icon: Calendar },
    { value: '500+', label: 'Pelanggan Puas', icon: Users },
    { value: '1000+', label: 'Gerobak Dibuat', icon: Wrench },
  ];

  const values = [
    {
      icon: Award,
      title: 'Kualitas',
      desc: 'Mengutamakan kualitas dalam setiap produk',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'Kepercayaan',
      desc: 'Membangun kepercayaan dengan pelanggan',
      color: 'green',
    },
    {
      icon: TrendingUp,
      title: 'Inovasi',
      desc: 'Terus berinovasi dalam desain',
      color: 'purple',
    },
    {
      icon: Heart,
      title: 'Dedikasi',
      desc: 'Dedikasi penuh untuk kepuasan pelanggan',
      color: 'red',
    },
  ];

  const advantages = [
    {
      title: 'Material Berkualitas',
      desc: 'Menggunakan material pilihan yang tahan lama dan berkualitas tinggi',
    },
    {
      title: 'Desain Custom',
      desc: 'Bisa disesuaikan dengan kebutuhan dan keinginan Anda',
    },
    {
      title: 'Garansi Produk',
      desc: 'Garansi untuk kualitas dan ketahanan produk kami',
    },
    {
      title: 'Harga Kompetitif',
      desc: 'Harga terjangkau dengan kualitas terbaik di kelasnya',
    },
    {
      title: 'Pengiriman Luas',
      desc: 'Melayani pengiriman ke seluruh Indonesia',
    },
    {
      title: 'Konsultasi Gratis',
      desc: 'Tim kami siap membantu konsultasi kebutuhan Anda',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <PageTransition className="pt-16 min-h-screen bg-gray-50/50">
      {/* Hero Header - Konsisten dengan Katalog & Galeri */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                <MapPin size={14} />
                Yogyakarta
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                <Calendar size={14} />
                Sejak 2014
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
              Tentang Kami
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Lebih dari sekedar pembuat gerobak, kami adalah mitra bisnis Anda
              dalam mewujudkan usaha kuliner yang sukses.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Company Profile */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div>
            <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
              Profil Perusahaan
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6 text-gray-900">
              Gerobak Jogja
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Gerobak Jogja adalah perusahaan yang bergerak di bidang
                pembuatan dan penjualan berbagai jenis gerobak berkualitas
                tinggi. Dengan pengalaman lebih dari{' '}
                <span className="font-semibold text-gray-900">10 tahun</span>,
                kami telah melayani
                <span className="font-semibold text-gray-900">
                  {' '}
                  ratusan pelanggan
                </span>{' '}
                di seluruh Indonesia.
              </p>
              <p>
                Kami mengutamakan kualitas material, desain yang menarik, dan
                harga yang kompetitif. Setiap gerobak dibuat dengan teliti oleh
                tenaga ahli yang berpengalaman.
              </p>
              <p>
                Kepuasan pelanggan adalah prioritas utama kami. Kami siap
                membantu mewujudkan bisnis impian Anda dengan gerobak yang
                sesuai kebutuhan.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <LazyImage
                src="https://res.cloudinary.com/dpjpj7l1y/image/upload/v1765423271/pexels-watorious-2381463_tv3bk3.webp"
                alt="Workshop Gerobak Jogja"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-gray-100 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                  <Award size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Terpercaya</div>
                  <div className="text-sm text-gray-500">Sejak 2014</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 border border-primary-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white text-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900">
                Visi
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Menjadi produsen gerobak terpercaya dan terdepan di Indonesia yang
              mengutamakan kualitas, inovasi, dan kepuasan pelanggan.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white text-green-600 rounded-xl flex items-center justify-center shadow-sm">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900">
                Misi
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                'Menyediakan produk gerobak berkualitas tinggi',
                'Memberikan pelayanan terbaik kepada pelanggan',
                'Terus berinovasi dalam desain dan material',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
              Prinsip Kami
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
              Nilai-Nilai Kami
            </h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <div
                    className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 ${getColorClasses(value.color)} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={28} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{value.title}</h4>
                  <p className="text-gray-500 text-sm">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 border border-gray-100">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
              Mengapa Memilih Kami
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
              Keunggulan Kami
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle size={20} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
