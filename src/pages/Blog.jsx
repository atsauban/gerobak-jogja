import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, Search } from 'lucide-react';
import { getBlogPosts } from '../services/firebaseService';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'semua', name: 'Semua Artikel' },
    { id: 'Tips', name: 'Tips' },
    { id: 'Panduan', name: 'Panduan' },
    { id: 'Berita', name: 'Berita' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchCategory = selectedCategory === 'semua' || article.category === selectedCategory;
    const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredArticle = articles[0];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900 animate-fade-in">Blog Gerobak Jogja</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-slide-up">
            Tips, panduan, dan inspirasi seputar bisnis gerobak
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search & Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Artikel Pilihan</h2>
            <Link to={`/blog/${featuredArticle.slug}`} className="card overflow-hidden group block">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative overflow-hidden h-64 md:h-auto">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(featuredArticle.date).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-primary-600 transition-colors">
                  {featuredArticle.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <Tag size={16} />
                    {featuredArticle.category}
                  </span>
                  <span className="text-primary-600 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                    Baca Selengkapnya
                    <ArrowRight size={20} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
        )}

        {/* Articles Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            {selectedCategory === 'semua' ? 'Semua Artikel' : selectedCategory}
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat artikel...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.filter((article, index, self) => 
                index === self.findIndex(a => a.slug === article.slug) && article.id !== featuredArticle?.id
              ).map((article, index) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="card overflow-hidden group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(article.date).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={16} />
                        {article.author}
                      </span>
                      <span className="text-primary-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Baca
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">Tidak ada artikel yang ditemukan</p>
              {articles.length === 0 && (
                <p className="text-gray-400 text-sm">Admin dapat menambahkan artikel di halaman admin.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
