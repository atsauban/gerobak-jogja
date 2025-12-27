/**
 * Sitemap Service
 * Auto-generate sitemap when content changes
 */

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const SITE_URL = 'https://www.gerobakjogja.com';

// Format date to YYYY-MM-DD
function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toISOString().split('T')[0];
}

// Escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.toString().replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Generate sitemap XML
export const generateSitemapXML = async () => {

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Static Pages -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/katalog</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/galeri</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/tentang</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/kontak</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Product Categories -->
  /* Categories removed from sitemap */
`;

  try {
    // Get products from Firebase
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    productsSnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Add product pages
    products.forEach((product) => {
      const lastmod = formatDate(product.updatedAt || product.createdAt);
      const imageUrl = product.images?.[0] || product.image || '';
      const slug = product.slug || product.id;

      xml += `
  <!-- Product: ${escapeXml(product.name)} -->
  <url>
    <loc>${SITE_URL}/produk/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;

      if (imageUrl) {
        xml += `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(product.name)}</image:title>
    </image:image>`;
      }

      xml += `
  </url>`;
    });

    // Get blog posts from Firebase
    const blogSnapshot = await getDocs(collection(db, 'blogPosts'));
    const blogPosts = [];
    blogSnapshot.forEach((doc) => {
      blogPosts.push({ id: doc.id, ...doc.data() });
    });

    // Add blog post pages
    blogPosts.forEach((post) => {
      const lastmod = formatDate(post.updatedAt || post.createdAt);
      const imageUrl = post.image || '';

      xml += `
  <!-- Blog: ${escapeXml(post.title)} -->
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;

      if (imageUrl) {
        xml += `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>`;
      }

      xml += `
  </url>`;
    });

  } catch (error) {
    console.error('❌ Error fetching data from Firebase:', error);
  }

  xml += `
  
</urlset>`;

  return xml;
};

// Submit sitemap to search engines (development mode only shows info)
export const submitSitemapToSearchEngines = async () => {
  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isDevelopment) {
    return;
  }
};

// Main function to regenerate and submit sitemap
export const regenerateSitemap = async () => {
  try {
    // Check if we're in development or production
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isDevelopment) {
      // In development, regenerate sitemap but skip search engine submission

      try {
        // Call the Netlify function to regenerate sitemap
        const response = await fetch('/.netlify/functions/regenerate-sitemap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          await response.json();
        } else {
          console.warn('⚠️ Development: Sitemap regeneration failed, falling back to logging only');
        }
      } catch (error) {
        console.warn('⚠️ Development: Could not regenerate sitemap, logging change only:', error.message);
      }

      // Always try to submit to search engines (will fail due to CORS but logs the attempt)
      await submitSitemapToSearchEngines();
      return true;
    }

    // In production, detect platform and call appropriate function
    const isVercel = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('gerobakjogja.com');
    const functionUrl = isVercel
      ? '/api/regenerate-sitemap'  // Vercel Function
      : '/.netlify/functions/regenerate-sitemap';  // Netlify Function

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger: 'content_change',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        await response.json();
        return true;
      } else {
        console.error('❌ Production: Sitemap regeneration failed:', response.status, response.statusText);

        // Try to get error details
        try {
          const errorData = await response.text();
          console.error('Error details:', errorData);
        } catch {
          console.error('Could not parse error response');
        }

        // Fallback: just log the attempt
        await submitSitemapToSearchEngines();
        return false;
      }
    } catch (fetchError) {
      console.error('❌ Network error calling Netlify function:', fetchError.message);
      await submitSitemapToSearchEngines();
      return false;
    }

  } catch (error) {
    console.error('❌ Sitemap regeneration failed:', error);

    // Fallback: try to submit existing sitemap to search engines
    try {
      await submitSitemapToSearchEngines();
    } catch (submitError) {
      console.warn('⚠️ Fallback submission also failed:', submitError.message);
    }

    return false;
  }
};

// Debounced regeneration to avoid too frequent updates
let regenerationTimeout;
export const debouncedRegenerateSitemap = () => {
  clearTimeout(regenerationTimeout);
  regenerationTimeout = setTimeout(() => {
    regenerateSitemap();
  }, 5000); // Wait 5 seconds after last change
};