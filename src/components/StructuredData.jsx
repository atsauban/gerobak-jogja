import { Helmet } from 'react-helmet-async';

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gerobak Jogja",
    "url": "https://gerobakjogja.com",
    "logo": "https://gerobakjogja.com/images/logo.webp",
    "description": "Spesialis pembuatan gerobak aluminium, kayu, dan stainless steel berkualitas tinggi di Yogyakarta",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Yogyakarta",
      "addressRegion": "DIY",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-823-2722-0077",
      "contactType": "sales"
    },
    "sameAs": [
      "https://www.instagram.com/gerobakjogja",
      "https://www.facebook.com/gerobakjogja"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// Product Schema
export function ProductSchema({ product }) {
  if (!product) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images?.[0] || '',
    "brand": {
      "@type": "Brand",
      "name": "Gerobak Jogja"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Gerobak Jogja"
      }
    },
    "category": product.category
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// Article Schema for Blog
export function ArticleSchema({ article }) {
  if (!article) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "author": {
      "@type": "Organization",
      "name": "Gerobak Jogja"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gerobak Jogja",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gerobakjogja.com/images/logo.webp"
      }
    },
    "datePublished": article.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    "dateModified": article.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
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
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
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
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// Local Business Schema
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Gerobak Jogja",
    "image": "https://gerobakjogja.com/images/logo.webp",
    "priceRange": "Rp 1.000.000 - Rp 50.000.000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Yogyakarta",
      "addressLocality": "Yogyakarta",
      "addressRegion": "DIY",
      "postalCode": "55000",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -7.7956,
      "longitude": 110.3695
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "telephone": "+62-823-2722-0077"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
