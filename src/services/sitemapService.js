/**
 * Sitemap Service
 * Auto-generate sitemap when content changes
 */

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const SITE_URL = 'https://gerobakjogja.vercel.app';

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
  console.log('🗺️ Generating sitemap...');

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
  <url>
    <loc>${SITE_URL}/katalog?category=aluminium</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/katalog?category=kayu</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/katalog?category=stainless</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/katalog?category=kombinasi</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  try {
    // Get products from Firebase
    console.log('📦 Fetching products...');
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
    console.log('📝 Fetching blog posts...');
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

    console.log(`✅ Generated sitemap with ${products.length} products and ${blogPosts.length} blog posts`);

  } catch (error) {
    console.error('❌ Error fetching data from Firebase:', error);
  }

  xml += `
  
</urlset>`;

  return xml;
};

// Submit sitemap to search engines
export const submitSitemapToSearchEngines = async () => {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  
  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    console.log('🔧 Development mode: Skipping search engine submission (CORS restrictions)');
    console.log(`📋 Sitemap URL: ${sitemapUrl}`);
    console.log('💡 In production, sitemap will be automatically submitted to:');
    console.log('   • Google: https://www.google.com/ping');
    console.log('   • Bing: https://www.bing.com/ping');
    return;
  }
  
  try {
    // Ping Google
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    await fetch(googlePingUrl, { method: 'GET' });
    console.log('✅ Sitemap submitted to Google');

    // Ping Bing
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    await fetch(bingPingUrl, { method: 'GET' });
    console.log('✅ Sitemap submitted to Bing');

  } catch (error) {
    console.warn('⚠️ Could not submit sitemap to search engines:', error.message);
    console.log('💡 This is normal in development. Sitemap submission works in production.');
  }
};

// Main function to regenerate and submit sitemap
export const regenerateSitemap = async () => {
  try {
    console.log('🚀 Starting sitemap regeneration...');
    
    // Check if we're in development or production
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      // In development, just log the change and skip actual submission
      console.log('🔧 Development mode: Logging sitemap change');
      await submitSitemapToSearchEngines();
      console.log('✅ Development: Sitemap change logged successfully');
      return true;
    }
    
    // In production, call Netlify function to regenerate sitemap
    const response = await fetch('/.netlify/functions/regenerate-sitemap', {
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
      const result = await response.json();
      console.log('✅ Production: Sitemap regeneration completed!', result);
      return true;
    } else {
      console.error('❌ Production: Sitemap regeneration failed:', response.statusText);
      // Fallback to search engine submission
      await submitSitemapToSearchEngines();
      return false;
    }
    
  } catch (error) {
    console.error('❌ Sitemap regeneration failed:', error);
    
    // Fallback: try to submit existing sitemap to search engines
    try {
      await submitSitemapToSearchEngines();
      console.log('✅ Fallback: Submitted existing sitemap to search engines');
    } catch (submitError) {
      console.warn('⚠️ Fallback submission also failed:', submitError.message);
      console.log('💡 This is normal in development mode due to CORS restrictions');
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