import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  Search,
  BookOpen,
  FileText,
  X,
} from 'lucide-react';
import { getBlogPosts } from '../services/firebaseService';
import { handleError } from '../utils/errorHandler';
import LazyImage from '../components/LazyImage';
import { BlogGridSkeleton } from '../components/LoadingSkeleton';
import PageTransition from '../components/PageTransition';

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
      handleError(error, 'Gagal memuat artikel blog. Silakan refresh halaman.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'semua', name: 'Semua', icon: '📚' },
    { id: 'Tips', name: 'Tips', icon: '💡' },
    { id: 'Panduan', name: 'Panduan', icon: '📖' },
    { id: 'Berita', name: 'Berita', icon: '📰' },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchCategory =
      selectedCategory === 'semua' || article.category === selectedCategory;
    const matchSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredArticle = articles.find((article) => article.featured === true);
  const hasActiveFilters = selectedCategory !== 'semua' || searchQuery.trim();

  const clearFilters = () => {
    setSelectedCategory('semua');
    setSearchQuery('');
  };

  return (
    <PageTransition className="pt-16 min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                <BookOpen size={14} />
                Artikel & Tips
              </span>
              {articles.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <FileText size={14} />
                  {articles.length} Artikel
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
              Blog
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Tips, panduan, dan inspirasi seputar bisnis gerobak untuk membantu
              kesuksesan usaha Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredArticles.length}
                </span>{' '}
                artikel ditemukan
              </p>

              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  {selectedCategory !== 'semua' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                      {categories.find((c) => c.id === selectedCategory)?.icon}{' '}
                      {categories.find((c) => c.id === selectedCategory)?.name}
                      <button
                        onClick={() => setSelectedCategory('semua')}
                        className="hover:text-primary-900 ml-1"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {searchQuery.trim() && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="hover:text-gray-900 ml-1"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Reset filter
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && <BlogGridSkeleton count={6} />}

        {/* Featured Article */}
        {!loading && featuredArticle && !hasActiveFilters && (
          <div className="mb-10">
            <Link
              to={`/blog/${featuredArticle.slug}`}
              className="block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-100">
                  {featuredArticle.image ? (
                    <LazyImage
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-lg shadow-lg">
                    ⭐ Featured
                  </span>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="inline-block w-fit text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md mb-3">
                    {featuredArticle.category}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(featuredArticle.date).toLocaleDateString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </span>
                    <span>•</span>
                    <span>{featuredArticle.readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    Baca Selengkapnya
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles
              .filter(
                (article) =>
                  hasActiveFilters || article.id !== featuredArticle?.id
              )
              .map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {article.image ? (
                      <LazyImage
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                      {categories.find((c) => c.id === article.category)
                        ?.icon || '📄'}{' '}
                      {article.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar size={12} />
                      {new Date(article.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {article.author}
                      </span>
                      <span className="text-primary-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Baca
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="text-gray-400" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak Ada Artikel
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              {hasActiveFilters
                ? 'Tidak ditemukan artikel yang sesuai dengan filter Anda.'
                : 'Belum ada artikel yang dipublikasikan.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
