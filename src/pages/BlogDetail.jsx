import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight, FileText } from 'lucide-react';
import { getBlogPosts } from '../services/firebaseService';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';

// Sub-components
import BlogHeader from '../components/blog/BlogHeader';
import BlogContent from '../components/blog/BlogContent';
import BlogCTA from '../components/blog/BlogCTA';

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
      const foundArticle = posts.find((post) => post.slug === slug);
      setArticle(foundArticle || null);
    } catch (error) {
      console.error('Error loading article:', error);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  // Fallback articles for demo
  const fallbackArticles = {
    'tips-memilih-gerobak-bisnis-kuliner': {
      title: 'Tips Memilih Gerobak yang Tepat untuk Bisnis Kuliner Anda',
      image: 'https://via.placeholder.com/1200x600?text=Tips+Memilih+Gerobak',
      category: 'Tips Bisnis',
      author: 'Admin Gerobak Jogja',
      date: '2024-12-01',
      readTime: '5 menit',
      content: `<p>Memilih gerobak yang tepat adalah langkah penting dalam memulai bisnis kuliner...</p>`,
    },
  };

  const displayArticle = article || fallbackArticles[slug];

  // Loading State
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50/50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-100 rounded w-1/4"></div>
            <div className="h-12 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
            <div className="aspect-[2/1] bg-gray-100 rounded-2xl"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!displayArticle) {
    return (
      <>
        <SEO
          title="Artikel Tidak Ditemukan"
          description="Maaf, artikel yang Anda cari tidak tersedia."
        />
        <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50/50">
          <div className="text-center px-4">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Artikel Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Artikel yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Kembali ke Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: window.location.origin,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${window.location.origin}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: displayArticle.title,
        item: window.location.href,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org/',
    '@type': 'BlogPosting',
    headline: displayArticle.title,
    image: [displayArticle.image],
    datePublished: displayArticle.date,
    author: {
      '@type': 'Person',
      name: displayArticle.author || 'Admin Gerobak Jogja',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gerobak Jogja',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/images/logo.webp`,
      },
    },
    description: `Baca artikel tentang ${displayArticle.title} di Gerobak Jogja Blog.`,
  };

  return (
    <PageTransition>
      <SEO
        title={displayArticle.title}
        description={`Baca artikel tentang ${displayArticle.title} di Gerobak Jogja Blog.`}
        image={displayArticle.image}
        type="article"
        schema={[articleSchema, breadcrumbSchema]}
      />
      <div className="pt-16 min-h-screen bg-gray-50/50">
        {/* Breadcrumb Bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Home size={16} />
              </Link>
              <ChevronRight size={14} className="text-gray-300" />
              <Link
                to="/blog"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {displayArticle.title}
              </span>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Kembali
          </button>

          {/* Article Content */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <BlogHeader article={displayArticle} />
              <BlogContent article={displayArticle} />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <BlogCTA />
          </div>
        </article>
      </div>
    </PageTransition>
  );
}
