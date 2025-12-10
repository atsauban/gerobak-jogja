# Auto Sitemap Generation

## Overview
Implementasi sistem auto-generate sitemap.xml yang otomatis ter-trigger saat ada perubahan konten di admin panel.

## 🚀 Features

### ✅ Auto-Trigger Events
- **Product Added**: Sitemap regenerate saat produk baru ditambah
- **Product Updated**: Sitemap regenerate saat produk diupdate
- **Product Deleted**: Sitemap regenerate saat produk dihapus
- **Blog Created**: Sitemap regenerate saat blog post baru
- **Blog Updated**: Sitemap regenerate saat blog post diupdate
- **Blog Deleted**: Sitemap regenerate saat blog post dihapus

### ✅ Debounced Regeneration
- **5 Second Delay**: Menunggu 5 detik setelah perubahan terakhir
- **Prevent Spam**: Menghindari regeneration berlebihan
- **Efficient**: Hanya regenerate sekali meskipun ada multiple changes

### ✅ Search Engine Submission
- **Google**: Auto-ping Google saat sitemap update
- **Bing**: Auto-ping Bing saat sitemap update
- **Real-time**: Search engines langsung tahu ada update

## 🛠️ Technical Implementation

### 1. Sitemap Service (`src/services/sitemapService.js`)
```javascript
// Debounced regeneration
export const debouncedRegenerateSitemap = () => {
  clearTimeout(regenerationTimeout);
  regenerationTimeout = setTimeout(() => {
    regenerateSitemap();
  }, 5000); // Wait 5 seconds after last change
};

// Main regeneration function
export const regenerateSitemap = async () => {
  // Call Netlify function to regenerate sitemap
  const response = await fetch('/.netlify/functions/regenerate-sitemap', {
    method: 'POST',
    body: JSON.stringify({ trigger: 'content_change' })
  });
};
```

### 2. ProductContext Integration
```javascript
// Auto-regenerate on product changes
const addProduct = async (product) => {
  const createdProduct = await createProduct(product);
  setProducts([createdProduct, ...products]);
  
  // Regenerate sitemap
  debouncedRegenerateSitemap();
  
  return createdProduct;
};
```

### 3. Netlify Function (`netlify/functions/regenerate-sitemap.mjs`)
```javascript
export const handler = async (event, context) => {
  // Generate new sitemap from Firebase data
  const sitemapXML = await generateSitemapXML();
  
  // Submit to search engines
  await submitToSearchEngines();
  
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
```

### 4. Admin Panel Integration
```javascript
// Manual trigger button in admin
<button onClick={() => debouncedRegenerateSitemap()}>
  Regenerate Sitemap
</button>
```

## 📊 Sitemap Content

### Static Pages
- Homepage (`/`) - Priority 1.0
- Katalog (`/katalog`) - Priority 0.9
- Galeri, Tentang, Kontak, Blog - Priority 0.7-0.8
- Product Categories - Priority 0.8

### Dynamic Content
- **Products**: `/produk/{slug}` - Priority 0.6
- **Blog Posts**: `/blog/{slug}` - Priority 0.6
- **Image Sitemap**: Include product & blog images

### XML Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <url>
    <loc>https://gerobakjogja.vercel.app/produk/gerobak-premium</loc>
    <lastmod>2024-12-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <image:image>
      <image:loc>https://cloudinary.com/image.jpg</image:loc>
      <image:title>Gerobak Premium</image:title>
    </image:image>
  </url>
  
</urlset>
```

## 🔄 Workflow

### Content Change Flow
1. **User Action**: Admin adds/updates/deletes content
2. **Context Hook**: ProductContext or Admin component calls `debouncedRegenerateSitemap()`
3. **Debounce**: Wait 5 seconds for additional changes
4. **Trigger**: Call Netlify function `regenerate-sitemap`
5. **Generate**: Fetch fresh data from Firebase
6. **Create XML**: Generate new sitemap.xml
7. **Submit**: Ping Google & Bing with new sitemap
8. **Complete**: Search engines crawl updated content

### Manual Trigger Flow
1. **Admin Panel**: Click "Regenerate Sitemap" button
2. **Toast Notification**: Show "Regenerating sitemap..." message
3. **Same Process**: Follow automatic workflow
4. **Feedback**: Success/error toast notification

## 🎯 Benefits

### SEO Advantages
- ✅ **Faster Indexing**: New content indexed within minutes/hours
- ✅ **Fresh Content**: Search engines always have latest sitemap
- ✅ **Image SEO**: Product & blog images properly indexed
- ✅ **Priority System**: Important pages get higher priority

### User Experience
- ✅ **Automatic**: No manual intervention needed
- ✅ **Real-time**: Changes reflected immediately
- ✅ **Reliable**: Fallback mechanisms for errors
- ✅ **Transparent**: Admin can see and trigger manually

### Technical Benefits
- ✅ **Scalable**: Handles growing content automatically
- ✅ **Efficient**: Debounced to prevent spam
- ✅ **Robust**: Error handling and fallbacks
- ✅ **Maintainable**: Clean separation of concerns

## 🔧 Configuration

### Environment Variables
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### Netlify Function Settings
- **Runtime**: Node.js 18+
- **Memory**: 256MB (sufficient for sitemap generation)
- **Timeout**: 30 seconds
- **Triggers**: HTTP POST requests

## 📈 Monitoring

### Success Indicators
- ✅ **Console Logs**: Check browser console for regeneration messages
- ✅ **Toast Notifications**: Visual feedback in admin panel
- ✅ **Sitemap URL**: Verify `/sitemap.xml` has latest content
- ✅ **Search Console**: Monitor indexing status

### Troubleshooting
- **Check Firebase Connection**: Ensure environment variables are set
- **Verify Netlify Function**: Test `/.netlify/functions/regenerate-sitemap`
- **Manual Fallback**: Use "Regenerate Sitemap" button in admin
- **Search Console**: Submit sitemap manually if needed

## 🚀 Future Enhancements

### Potential Improvements
- **RSS Feed**: Auto-generate RSS feed for blog
- **IndexNow**: Add IndexNow protocol for Bing
- **Analytics**: Track regeneration frequency and success rate
- **Caching**: Cache sitemap for better performance
- **Webhooks**: External webhook triggers for CI/CD

The auto-sitemap system ensures optimal SEO performance with zero manual maintenance required!