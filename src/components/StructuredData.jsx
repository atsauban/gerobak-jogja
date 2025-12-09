import { Helmet } from 'react-helmet-async';

/**
 * StructuredData Component
 * Adds JSON-LD structured data to pages for better SEO
 */

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gerobak Jogja",
    "url": "https://gerobakjogja.vercel.app",
    "logo": "https://gerobakjogja.vercel.app/images/logo.webp",
    "description": "Spesialis pembuatan gerobak aluminium, kayu, dan stainless steel berkualitas tinggi di Yogyakarta",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Yogyakarta",
      "addressRegion": "DI Yogyakarta",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-823-2722-0077",
      "contactType": "Customer Service",
      "availableLanguage": ["Indonesian"]
    },
    "sameAs": [
      "https://www.instagram.com/gerobakjogja",
      "https://www.facebook.com/gerobakjogja"
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}

// LocalBusiness Schema
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Gerobak Jogja",
    "image": "https://gerobakjogja.vercel.app/images/logo.webp",
    "url": "https://gerobakjogja.vercel.app",
    "telephone": "+62-823-2722-0077",
    "priceRange": "Rp 2.500.000 - Rp 5.000.000",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Yogyakarta",
      "addressRegion": "DI Yogyakarta",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -7.7956,
      "longitude": 110.3695
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}

// Product Schema
export function ProductSchema({ product }) {
  if (!product) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0] || product.image,
    "description": product.description || product.shortDesc,
    "brand": {
      "@type": "Brand",
      "name": "Gerobak Jogja"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://gerobakjogja.vercel.app/produk/${product.id}`,
      "priceCurrency": "IDR",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Gerobak Jogja"
      }
    }
  };

  // Add rating if available
  if (product.rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": product.reviewCount || 1
    };
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://gerobakjogja.vercel.app${item.path}`
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}

// Article Schema (for blog posts)
export function ArticleSchema({ article }) {
  if (!article) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "image": article.image,
    "author": {
      "@type": "Person",
      "name": article.author || "Gerobak Jogja"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gerobak Jogja",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gerobakjogja.vercel.app/images/logo.webp"
      }
    },
    "datePublished": article.createdAt?.toDate?.()?.toISOString() || article.createdAt,
    "dateModified": article.updatedAt?.toDate?.()?.toISOString() || article.updatedAt || article.createdAt,
    "description": article.excerpt || article.description
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}

// FAQ Schema
export function FAQSchema({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}

// Website Schema
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gerobak Jogja",
    "url": "https://gerobakjogja.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://gerobakjogja.vercel.app/katalog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}

// Combined Schema for Homepage
export function HomepageSchema() {
  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <WebsiteSchema />
    </>
  );
}

export default {
  OrganizationSchema,
  LocalBusinessSchema,
  ProductSchema,
  BreadcrumbSchema,
  ArticleSchema,
  FAQSchema,
  WebsiteSchema,
  HomepageSchema
};
