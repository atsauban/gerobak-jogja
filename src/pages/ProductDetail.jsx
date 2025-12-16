import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import SEO from '../components/SEO';

// Sub-components
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductContent from '../components/product/ProductContent';
import ProductCTA from '../components/product/ProductCTA';
import RelatedProducts from '../components/product/RelatedProducts';
import StickyBottomBar from '../components/product/StickyBottomBar';

export default function ProductDetail() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug, loading } = useProducts();

  const product = getProductBySlug(slug);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50/50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                <div className="aspect-square bg-gray-100 rounded-2xl mb-3"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-100 rounded w-1/4"></div>
                <div className="h-10 bg-gray-100 rounded w-3/4"></div>
                <div className="h-8 bg-gray-100 rounded w-1/3"></div>
                <div className="h-24 bg-gray-100 rounded"></div>
                <div className="h-12 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <>
        <SEO
          title="Produk Tidak Ditemukan"
          description="Maaf, produk yang Anda cari tidak tersedia."
        />
        <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50/50">
          <div className="text-center px-4">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Produk Tidak Ditemukan
            </h2>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Produk yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Kembali ke Katalog
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
        name: 'Katalog',
        item: `${window.location.origin}/katalog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: window.location.href,
      },
    ],
  };

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.description || product.shortDesc,
    brand: {
      '@type': 'Brand',
      name: 'Gerobak Jogja',
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: 'IDR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <SEO
        title={product.name}
        description={product.shortDesc}
        image={product.images && product.images[0]}
        type="product"
        schema={[productSchema, breadcrumbSchema]}
      />
      <div className="pt-16 min-h-screen bg-gray-50/50">
        {/* Breadcrumb Bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Home size={16} />
              </Link>
              <ChevronRight size={14} className="text-gray-300" />
              <Link
                to="/katalog"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Katalog
              </Link>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Main Content */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Images */}
              <div className="p-6 lg:p-8 bg-gray-50/50">
                <ProductImageGallery product={product} />
              </div>

              {/* Product Info */}
              <div className="p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-100">
                <ProductInfo product={product} />
              </div>
            </div>
          </div>

          {/* Content Tabs/Sections */}
          <ProductContent product={product} />

          {/* CTA */}
          <ProductCTA product={product} />

          {/* Related Products */}
          <RelatedProducts currentProduct={product} />
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <StickyBottomBar product={product} />
    </>
  );
}
