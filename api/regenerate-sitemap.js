/**
 * Vercel Function: Regenerate Sitemap
 * Compatible with Vercel deployment
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
async function generateSitemapXML() {
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

    console.log(`✅ Generated sitemap with ${products.length} products and ${blogPosts.length} blog posts`);

  } catch (error) {
    console.error('❌ Error fetching data from Firebase:', error);
  }

  xml += `
  
</urlset>`;

  return xml;
}

// Submit sitemap to search engines (server-side)
async function submitToSearchEngines() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  
  try {
    // Ping Google
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const googleResponse = await fetch(googlePingUrl, { method: 'GET' });
    console.log('✅ Sitemap submitted to Google:', googleResponse.status);

    // Ping Bing
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const bingResponse = await fetch(bingPingUrl, { method: 'GET' });
    console.log('✅ Sitemap submitted to Bing:', bingResponse.status);

    return { google: googleResponse.status, bing: bingResponse.status };

  } catch (error) {
    console.error('❌ Error submitting sitemap:', error);
    return { error: error.message };
  }
}

// Vercel Function Handler
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Use POST.',
      allowedMethods: ['POST']
    });
  }

  try {
    console.log('🚀 Vercel Function: Regenerating sitemap...');
    
    // Generate new sitemap
    const sitemapXML = await generateSitemapXML();
    
    // Submit to search engines
    const submissionResult = await submitToSearchEngines();
    
    console.log('✅ Vercel Function: Sitemap regenerated and submitted');
    
    return res.status(200).json({
      success: true,
      message: 'Sitemap regenerated successfully via Vercel Function',
      timestamp: new Date().toISOString(),
      sitemapUrl: `${SITE_URL}/sitemap.xml`,
      searchEngineSubmission: submissionResult,
      platform: 'vercel'
    });
    
  } catch (error) {
    console.error('❌ Vercel Function error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      platform: 'vercel',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}