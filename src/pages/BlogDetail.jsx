import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import { getBlogPosts } from '../services/firebaseService';
import { marked } from 'marked';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const posts = await getBlogPosts();
      const foundArticle = posts.find(post => post.slug === slug);
      
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        setArticle(null);
      }
    } catch (error) {
      console.error('Error loading article:', error);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data for demo purposes
  const fallbackArticles = {
    'tips-memilih-gerobak-bisnis-kuliner': {
      title: 'Tips Memilih Gerobak yang Tepat untuk Bisnis Kuliner Anda',
      image: 'https://via.placeholder.com/1200x600?text=Tips+Memilih+Gerobak',
      category: 'Tips Bisnis',
      author: 'Admin Gerobak Jogja',
      date: '2024-12-01',
      readTime: '5 menit',
      content: `
        <p>Memilih gerobak yang tepat adalah langkah penting dalam memulai bisnis kuliner. Gerobak yang sesuai tidak hanya akan memudahkan operasional, tetapi juga menarik perhatian pelanggan dan meningkatkan brand image bisnis Anda.</p>

        <h2>1. Tentukan Jenis Usaha Anda</h2>
        <p>Sebelum memilih gerobak, tentukan dulu jenis usaha kuliner yang akan Anda jalankan:</p>
        <ul>
          <li><strong>Minuman:</strong> Kopi, teh, jus, atau minuman lainnya</li>
          <li><strong>Makanan Ringan:</strong> Gorengan, cemilan, atau snack</li>
          <li><strong>Makanan Berat:</strong> Nasi, mie, atau menu utama lainnya</li>
        </ul>

        <h2>2. Pilih Material yang Sesuai</h2>
        <p>Setiap material memiliki kelebihan masing-masing:</p>
        
        <h3>Gerobak Aluminium</h3>
        <ul>
          <li>Ringan dan mudah dipindahkan</li>
          <li>Tahan karat dan cuaca</li>
          <li>Desain modern dan elegan</li>
          <li>Cocok untuk: Kopi, minuman, makanan ringan</li>
        </ul>

        <h3>Gerobak Kayu</h3>
        <ul>
          <li>Tampilan klasik dan natural</li>
          <li>Kokoh dan tahan lama</li>
          <li>Memberikan kesan hangat</li>
          <li>Cocok untuk: Konsep vintage, traditional food</li>
        </ul>

        <h3>Gerobak Stainless Steel</h3>
        <ul>
          <li>Hygienis dan mudah dibersihkan</li>
          <li>Food grade dan aman</li>
          <li>Tahan panas dan air</li>
          <li>Cocok untuk: Makanan berat, catering</li>
        </ul>

        <h2>3. Pertimbangkan Budget</h2>
        <p>Sesuaikan pilihan gerobak dengan budget yang Anda miliki:</p>
        <ul>
          <li><strong>Budget Terbatas (2-3 juta):</strong> Gerobak kayu pinus atau aluminium standard</li>
          <li><strong>Budget Menengah (3-4 juta):</strong> Gerobak aluminium premium atau kombinasi</li>
          <li><strong>Budget Besar (4-5 juta+):</strong> Gerobak kayu jati atau stainless steel</li>
        </ul>

        <h2>4. Perhatikan Fitur dan Kelengkapan</h2>
        <p>Pastikan gerobak memiliki fitur yang Anda butuhkan:</p>
        <ul>
          <li>Ruang penyimpanan yang cukup</li>
          <li>Roda yang mudah digerakkan</li>
          <li>Tempat untuk peralatan</li>
          <li>Area display yang menarik</li>
          <li>Lampu (jika berjualan malam)</li>
        </ul>

        <h2>5. Custom Design</h2>
        <p>Jangan ragu untuk request custom design yang sesuai dengan brand Anda. Gerobak yang unik akan lebih mudah diingat pelanggan.</p>

        <h2>Kesimpulan</h2>
        <p>Memilih gerobak yang tepat memerlukan pertimbangan matang. Konsultasikan kebutuhan Anda dengan kami untuk mendapatkan rekomendasi terbaik!</p>
      `
    },
    'keunggulan-gerobak-aluminium-vs-kayu': {
      title: 'Keunggulan Gerobak Aluminium vs Kayu: Mana yang Lebih Baik?',
      image: 'https://via.placeholder.com/1200x600?text=Aluminium+vs+Kayu',
      category: 'Panduan',
      author: 'Admin Gerobak Jogja',
      date: '2024-11-28',
      readTime: '7 menit',
      content: `
        <p>Dalam memilih gerobak, material adalah faktor penting yang perlu dipertimbangkan. Dua material paling populer adalah aluminium dan kayu. Mari kita bandingkan keduanya secara detail.</p>

        <h2>Gerobak Aluminium</h2>
        
        <h3>Kelebihan:</h3>
        <ul>
          <li><strong>Ringan:</strong> Mudah dipindahkan dan dimobilisasi</li>
          <li><strong>Anti Karat:</strong> Tahan terhadap air dan cuaca</li>
          <li><strong>Low Maintenance:</strong> Tidak perlu perawatan khusus</li>
          <li><strong>Modern:</strong> Tampilan sleek dan contemporary</li>
          <li><strong>Higienis:</strong> Mudah dibersihkan</li>
        </ul>

        <h3>Kekurangan:</h3>
        <ul>
          <li>Harga relatif lebih mahal dari kayu pinus</li>
          <li>Kurang cocok untuk konsep vintage/klasik</li>
          <li>Bisa penyok jika terkena benturan keras</li>
        </ul>

        <h2>Gerobak Kayu</h2>
        
        <h3>Kelebihan:</h3>
        <ul>
          <li><strong>Estetika:</strong> Tampilan natural dan hangat</li>
          <li><strong>Kokoh:</strong> Struktur yang kuat dan stabil</li>
          <li><strong>Customizable:</strong> Mudah dimodifikasi dan dicat</li>
          <li><strong>Klasik:</strong> Cocok untuk berbagai konsep</li>
          <li><strong>Harga Variatif:</strong> Ada pilihan dari ekonomis hingga premium</li>
        </ul>

        <h3>Kekurangan:</h3>
        <ul>
          <li>Memerlukan perawatan rutin (cat/vernis)</li>
          <li>Lebih berat dari aluminium</li>
          <li>Rentan terhadap rayap (jika tidak dirawat)</li>
          <li>Bisa lapuk jika terkena air terus-menerus</li>
        </ul>

        <h2>Perbandingan Harga</h2>
        <table>
          <tr>
            <th>Material</th>
            <th>Range Harga</th>
          </tr>
          <tr>
            <td>Kayu Pinus</td>
            <td>Rp 2.5 - 3 juta</td>
          </tr>
          <tr>
            <td>Aluminium Standard</td>
            <td>Rp 3 - 3.5 juta</td>
          </tr>
          <tr>
            <td>Aluminium Premium</td>
            <td>Rp 3.5 - 4 juta</td>
          </tr>
          <tr>
            <td>Kayu Jati</td>
            <td>Rp 4 - 5 juta</td>
          </tr>
        </table>

        <h2>Mana yang Lebih Baik?</h2>
        <p>Tidak ada jawaban mutlak. Pilihan tergantung pada:</p>
        <ul>
          <li><strong>Budget:</strong> Sesuaikan dengan dana yang tersedia</li>
          <li><strong>Konsep Bisnis:</strong> Modern = Aluminium, Klasik = Kayu</li>
          <li><strong>Lokasi:</strong> Outdoor = Aluminium, Indoor = Bebas</li>
          <li><strong>Maintenance:</strong> Sibuk = Aluminium, Ada waktu = Kayu</li>
        </ul>

        <h2>Kesimpulan</h2>
        <p>Baik aluminium maupun kayu memiliki kelebihan masing-masing. Konsultasikan dengan kami untuk mendapatkan rekomendasi yang paling sesuai dengan kebutuhan bisnis Anda!</p>
      `
    },
    'cara-merawat-gerobak-awet': {
      title: 'Cara Merawat Gerobak Agar Awet dan Tahan Lama',
      image: 'https://via.placeholder.com/1200x600?text=Cara+Merawat+Gerobak',
      category: 'Tips Perawatan',
      author: 'Admin Gerobak Jogja',
      date: '2024-11-25',
      readTime: '4 menit',
      content: `
        <p>Perawatan rutin adalah kunci agar gerobak Anda tetap awet dan terlihat baru. Berikut tips perawatan berdasarkan jenis material.</p>

        <h2>Perawatan Gerobak Aluminium</h2>
        
        <h3>Pembersihan Rutin:</h3>
        <ul>
          <li>Bersihkan dengan lap lembut dan air sabun</li>
          <li>Hindari spons kasar yang bisa menggores</li>
          <li>Keringkan dengan lap kering setelah dibersihkan</li>
          <li>Lakukan minimal 2x seminggu</li>
        </ul>

        <h3>Perawatan Khusus:</h3>
        <ul>
          <li>Cek baut dan sambungan secara berkala</li>
          <li>Lumasi roda setiap 3 bulan</li>
          <li>Hindari benturan keras</li>
          <li>Simpan di tempat teduh saat tidak digunakan</li>
        </ul>

        <h2>Perawatan Gerobak Kayu</h2>
        
        <h3>Pembersihan Rutin:</h3>
        <ul>
          <li>Lap dengan kain lembab (jangan terlalu basah)</li>
          <li>Keringkan segera setelah terkena air</li>
          <li>Bersihkan noda segera agar tidak meresap</li>
          <li>Gunakan pembersih kayu khusus jika perlu</li>
        </ul>

        <h3>Perawatan Berkala:</h3>
        <ul>
          <li><strong>Setiap 6 bulan:</strong> Aplikasikan vernis/cat ulang</li>
          <li><strong>Setiap 3 bulan:</strong> Cek kondisi kayu, perbaiki jika ada kerusakan</li>
          <li><strong>Setiap bulan:</strong> Bersihkan dan poles dengan furniture polish</li>
        </ul>

        <h2>Perawatan Gerobak Stainless Steel</h2>
        
        <h3>Pembersihan:</h3>
        <ul>
          <li>Gunakan lap microfiber dan pembersih stainless</li>
          <li>Lap searah dengan grain stainless</li>
          <li>Hindari pembersih yang mengandung klorin</li>
          <li>Keringkan dengan lap kering untuk menghindari water spot</li>
        </ul>

        <h3>Tips Tambahan:</h3>
        <ul>
          <li>Bersihkan noda segera agar tidak mengering</li>
          <li>Gunakan polish stainless untuk hasil mengkilap</li>
          <li>Hindari goresan dari benda tajam</li>
        </ul>

        <h2>Perawatan Umum Semua Jenis Gerobak</h2>
        
        <h3>Roda:</h3>
        <ul>
          <li>Bersihkan dari kotoran dan debu</li>
          <li>Lumasi bearing secara berkala</li>
          <li>Ganti jika sudah aus atau rusak</li>
        </ul>

        <h3>Penyimpanan:</h3>
        <ul>
          <li>Simpan di tempat kering dan teduh</li>
          <li>Tutup dengan terpal jika disimpan outdoor</li>
          <li>Hindari paparan sinar matahari langsung</li>
        </ul>

        <h2>Checklist Perawatan Bulanan</h2>
        <ul>
          <li>☐ Bersihkan seluruh permukaan gerobak</li>
          <li>☐ Cek kondisi roda dan lumasi jika perlu</li>
          <li>☐ Periksa baut dan kencangkan yang longgar</li>
          <li>☐ Cek kondisi cat/finishing</li>
          <li>☐ Bersihkan area penyimpanan</li>
          <li>☐ Periksa lampu (jika ada)</li>
        </ul>

        <h2>Kesimpulan</h2>
        <p>Perawatan rutin akan membuat gerobak Anda awet dan selalu terlihat menarik. Investasi waktu untuk perawatan akan menghemat biaya perbaikan di masa depan!</p>
      `
    }
  };

  // Use fallback if article not found in Firebase
  const displayArticle = article || fallbackArticles[slug];

  // Convert markdown to HTML
  const getHtmlContent = (content) => {
    if (!content) return '';
    return marked(content);
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (!displayArticle) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h2>
          <Link to="/blog" className="btn-primary">
            Kembali ke Blog
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = displayArticle.title;

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600">Beranda</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-primary-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{displayArticle.title}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-semibold">
              {displayArticle.category}
            </span>
            {displayArticle.readTime && (
              <span className="text-gray-600 text-sm">{displayArticle.readTime}</span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900">
            {displayArticle.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <User size={18} />
                {displayArticle.author || 'Admin Gerobak Jogja'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Calendar size={18} />
                {new Date(displayArticle.date).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">Bagikan:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                title="Share on Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                title="Share on Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href={`https://wa.me/?text=${shareTitle} ${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                title="Share on WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {displayArticle.image && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={displayArticle.image}
              alt={displayArticle.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-12 blog-content"
          dangerouslySetInnerHTML={{ __html: getHtmlContent(displayArticle.content) }}
          style={{
            lineHeight: '1.8',
          }}
        />
        
        <style>{`
          .blog-content h1 {
            font-size: 2.25rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #1a202c;
          }
          .blog-content h2 {
            font-size: 1.875rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #2d3748;
          }
          .blog-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: #2d3748;
          }
          .blog-content p {
            margin-bottom: 1.25rem;
            color: #4a5568;
            font-size: 1.125rem;
          }
          .blog-content ul, .blog-content ol {
            margin-bottom: 1.25rem;
            padding-left: 2rem;
          }
          .blog-content li {
            margin-bottom: 0.5rem;
            color: #4a5568;
            font-size: 1.125rem;
          }
          .blog-content strong {
            font-weight: 600;
            color: #2d3748;
          }
          .blog-content table {
            width: 100%;
            margin: 1.5rem 0;
            border-collapse: collapse;
          }
          .blog-content th {
            background-color: #f7fafc;
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
            border: 1px solid #e2e8f0;
          }
          .blog-content td {
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
          }
          .blog-content blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #4a5568;
          }
          .blog-content code {
            background-color: #f7fafc;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-family: monospace;
            font-size: 0.875rem;
          }
          .blog-content pre {
            background-color: #2d3748;
            color: #f7fafc;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
          }
          .blog-content pre code {
            background-color: transparent;
            padding: 0;
            color: inherit;
          }
        `}</style>

        {/* CTA */}
        <div className="card p-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Tertarik dengan Gerobak Kami?</h3>
          <p className="text-lg mb-6 text-blue-100">
            Konsultasikan kebutuhan bisnis Anda dengan tim kami!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/katalog" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Lihat Katalog
              <ArrowRight size={20} />
            </Link>
            <WhatsAppButton className="btn-whatsapp justify-center">
              Hubungi Kami
            </WhatsAppButton>
          </div>
        </div>
      </article>
    </div>
  );
}
