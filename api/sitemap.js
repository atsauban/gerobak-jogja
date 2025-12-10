/**
 * Vercel API: Dynamic Sitemap Generator
 * Generates sitemap.xml on-demand for Vercel deployment
 * Usage: https://yourdomain.com/api/sitemap
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
    console.log('📦 Fetching products from Firebase...');
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    productsSnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    console.log(`📦 Found ${products.length} products`);

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
    console.log('📝 Fetching blog posts from Firebase...');
    const blogSnapshot = await getDocs(collection(db, 'blogPosts'));
    const blogPosts = [];
    blogSnapshot.forEach((doc) => {
      blogPosts.push({ id: doc.id, ...doc.data() });
    });
    console.log(`📝 Found ${blogPosts.length} blog posts`);

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
}

// Vercel API Handler
export default async function handler(req, res) {
  try {
    const timestamp = new Date().toISOString();
    const isFresh = req.query.fresh === 'true';
    
    console.log('🚀 Generating dynamic sitemap at:', timestamp);
    console.log('🔍 Request query params:', req.query);
    console.log('🔄 Fresh request:', isFresh);
    
    // Generate sitemap XML
    const sitemapXML = await generateSitemapXML();
    
    // Set appropriate headers for XML
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('X-Generated-At', timestamp);
    res.setHeader('X-Cache-Buster', Date.now().toString());
    
    if (isFresh) {
      // No cache for fresh requests
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      console.log('🚫 Cache disabled for fresh request');
    } else {
      // Minimal cache for normal requests
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
      console.log('⏱️ Cache set to 1 minute');
    }
    
    console.log('✅ Dynamic sitemap generated successfully at:', timestamp);
    
    // Return XML directly
    return res.status(200).send(sitemapXML);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    
    return res.status(500).json({
      error: 'Failed to generate sitemap',
      message: error.message
    });
  }
}