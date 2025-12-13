import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
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
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug, loading } = useProducts();

  const product = getProductBySlug(slug);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="h-96 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
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
        <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center px-4">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-50 animate-pulse"></div>
              <div className="relative flex items-center justify-center h-full">
                <span className="text-7xl opacity-50">❌</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Produk Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Produk yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Link to="/katalog" className="btn-primary inline-flex">
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Katalog",
        "item": `${window.location.origin}/katalog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": window.location.href
      }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.description || product.shortDesc,
    "brand": {
      "@type": "Brand",
      "name": "Gerobak Jogja"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "IDR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  // Main Render
  return (
    <>
      <SEO
        title={product.name}
        description={product.shortDesc}
        image={product.images && product.images[0]}
        type="product"
        schema={[productSchema, breadcrumbSchema]}
      />
      <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <Breadcrumbs
            items={[
              { label: 'Katalog', href: '/katalog' },
              { label: product.name }
            ]}
          />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <ProductImageGallery product={product} />

            {/* Product Info */}
            <ProductInfo product={product} />
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
