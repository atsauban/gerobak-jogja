import { CheckCircle, Target, Eye, Award, Users, TrendingUp, Heart } from 'lucide-react';

export default function Tentang() {
  const values = [
    { icon: <Award className="w-8 h-8" />, title: 'Kualitas', desc: 'Mengutamakan kualitas dalam setiap produk', color: 'from-blue-500 to-blue-600' },
    { icon: <Users className="w-8 h-8" />, title: 'Kepercayaan', desc: 'Membangun kepercayaan dengan pelanggan', color: 'from-green-500 to-green-600' },
    { icon: <TrendingUp className="w-8 h-8" />, title: 'Inovasi', desc: 'Terus berinovasi dalam desain', color: 'from-purple-500 to-purple-600' },
    { icon: <Heart className="w-8 h-8" />, title: 'Dedikasi', desc: 'Dedikasi penuh untuk kepuasan pelanggan', color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900 animate-fade-in">Tentang Kami</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-slide-up">
            Lebih dari sekedar pembuat gerobak, kami adalah mitra bisnis Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Profile */}
        <div className="card p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Sejak 2014
              </div>
              <h2 className="text-4xl font-display font-bold mb-6 text-gray-900">Gerobak Jogja</h2>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                Gerobak Jogja adalah perusahaan yang bergerak di bidang pembuatan dan penjualan berbagai jenis gerobak berkualitas tinggi. 
                Dengan pengalaman lebih dari <span className="font-bold text-primary-600">10 tahun</span>, kami telah melayani 
                <span className="font-bold text-primary-600"> ratusan pelanggan</span> di seluruh Indonesia.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Kami mengutamakan kualitas material, desain yang menarik, dan harga yang kompetitif. 
                Setiap gerobak dibuat dengan teliti oleh tenaga ahli yang berpengalaman.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kepuasan pelanggan adalah prioritas utama kami. Kami siap membantu mewujudkan bisnis impian Anda 
                dengan gerobak yang sesuai kebutuhan.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src="https://via.placeholder.com/600x500?text=Workshop+Gerobak+Jogja" 
                alt="Workshop"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card p-8 bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white">
                <Eye size={28} />
              </div>
              <h3 className="text-3xl font-display font-bold text-gray-900">Visi</h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Menjadi produsen gerobak <span className="font-bold">terpercaya dan terdepan</span> di Indonesia yang mengutamakan 
              kualitas, inovasi, dan kepuasan pelanggan.
            </p>
          </div>

          <div className="card p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white">
                <Target size={28} />
              </div>
              <h3 className="text-3xl font-display font-bold text-gray-900">Misi</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={22} />
                <span className="text-gray-700">Menyediakan produk gerobak berkualitas tinggi</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={22} />
                <span className="text-gray-700">Memberikan pelayanan terbaik kepada pelanggan</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={22} />
                <span className="text-gray-700">Terus berinovasi dalam desain dan material</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-display font-bold mb-4 text-gray-900">Nilai-Nilai Kami</h3>
            <p className="text-xl text-gray-600">Prinsip yang kami pegang dalam setiap pekerjaan</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="card p-6 text-center group">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} text-white mb-4 
                              group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">{value.title}</h4>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="card p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white">
          <h3 className="text-4xl font-display font-bold mb-12 text-center text-gray-900">Keunggulan Kami</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 
                            group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900">Material Berkualitas</h4>
              <p className="text-gray-600">Menggunakan material pilihan yang tahan lama dan berkualitas tinggi</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 
                            group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900">Desain Custom</h4>
              <p className="text-gray-600">Bisa disesuaikan dengan kebutuhan dan keinginan Anda</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 
                            group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900">Garansi Produk</h4>
              <p className="text-gray-600">Garansi untuk kualitas dan ketahanan produk kami</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
