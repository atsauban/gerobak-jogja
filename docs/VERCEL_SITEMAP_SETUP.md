# Vercel Sitemap Setup Guide

## 🚀 Sitemap di Vercel vs Netlify

### Netlify Deployment
✅ **File-based sitemap**: Fungsi dapat menulis ke `public/sitemap.xml`  
✅ **Auto-update**: Sitemap file ter-update otomatis  
✅ **SEO optimal**: Search engine dapat mengakses file statis  

### Vercel Deployment  
⚠️ **Serverless limitation**: Tidak bisa menulis ke filesystem  
✅ **Dynamic sitemap**: Generate sitemap on-demand via API  
✅ **Real-time data**: Selalu menampilkan data terbaru  

## 🔧 Solusi untuk Vercel

### 1. Dynamic Sitemap API
**Endpoint**: `https://gerobakjogja.vercel.app/api/sitemap`

- Generate sitemap secara real-time dari Firebase
- Tidak perlu file statis
- Selalu up-to-date dengan data terbaru

### 2. Regenerate Function
**Endpoint**: `https://gerobakjogja.vercel.app/api/regenerate-sitemap`

- Submit sitemap ke search engines
- Logging dan monitoring
- Response dengan statistik

## 📋 Setup Instructions

### 1. Environment Variables
Pastikan semua Firebase environment variables sudah diset di Vercel dashboard:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Google Search Console Setup
Untuk Vercel deployment, daftarkan sitemap dengan URL:
```
https://gerobakjogja.vercel.app/api/sitemap
```

### 3. Robots.txt Update
Update `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://gerobakjogja.vercel.app/api/sitemap
```

## 🔄 How It Works

### Development (Netlify Dev)
1. Admin panel → "Regenerate Sitemap"
2. Calls `/.netlify/functions/regenerate-sitemap`
3. Writes to `public/sitemap.xml`
4. Submits to search engines

### Production (Vercel)
1. Admin panel → "Regenerate Sitemap"  
2. Calls `/api/regenerate-sitemap`
3. Generates XML (not saved to file)
4. Submits to search engines
5. Search engines access `/api/sitemap` for latest data

## 🎯 Benefits

### Netlify
- ✅ Static file SEO
- ✅ Faster loading
- ✅ CDN cached

### Vercel  
- ✅ Always fresh data
- ✅ No file management
- ✅ Serverless scalability

## 🔧 Testing

### Test Dynamic Sitemap
```bash
curl https://gerobakjogja.vercel.app/api/sitemap
```

### Test Regenerate Function
```bash
curl -X POST https://gerobakjogja.vercel.app/api/regenerate-sitemap
```

## 📊 Monitoring

Both functions provide detailed logging:
- Product count
- Blog post count  
- Total URLs
- Search engine submission status
- Error handling

## 🚀 Deployment

Kedua sistem bekerja otomatis:
- **Netlify**: File-based sitemap dengan auto-update
- **Vercel**: Dynamic API-based sitemap dengan real-time data

Pilih platform sesuai kebutuhan Anda!