# Vercel Sitemap Cache Troubleshooting

## 🚨 **Masalah: Sitemap Tidak Update Setelah Tambah Produk**

### 🔍 **Penyebab:**
1. **Browser Cache**: Browser menyimpan response sitemap
2. **Vercel Edge Cache**: CDN Vercel cache response API
3. **Function Cache**: API function di-cache oleh Vercel

### ✅ **Solusi:**

#### **1. Force Fresh Sitemap (Bypass All Cache)**
```
https://gerobakjogja.vercel.app/api/sitemap?fresh=true&t=123456789
```

#### **2. Cache-Busting dengan Timestamp**
```
https://gerobakjogja.vercel.app/api/sitemap?t=1733842800
```

#### **3. Hard Refresh Browser**
- **Chrome/Firefox**: `Ctrl + F5` atau `Ctrl + Shift + R`
- **Safari**: `Cmd + Shift + R`

#### **4. Incognito/Private Mode**
Buka sitemap di incognito mode untuk bypass browser cache

### 🔧 **Cache Settings yang Sudah Diperbaiki:**

#### **Sebelum:**
```javascript
res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 jam
```

#### **Sesudah:**
```javascript
// Normal request: 1 menit cache
res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');

// Fresh request: No cache
res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
```

### 📊 **Testing Steps:**

1. **Tambah produk di admin panel**
2. **Tunggu 30 detik** (untuk sinkronisasi Firebase)
3. **Test sitemap dengan fresh parameter:**
   ```
   https://gerobakjogja.vercel.app/api/sitemap?fresh=true&t=$(date +%s)
   ```
4. **Cek apakah produk baru muncul**

### 🎯 **Expected Behavior:**

- **Normal access**: Cache 1 menit (untuk performance)
- **Fresh parameter**: No cache (untuk testing)
- **Auto-regenerate**: Trigger saat ada perubahan produk/blog
- **Real-time data**: Langsung dari Firebase

### 🚀 **Production URLs:**

#### **Normal Sitemap (Cached)**
```
https://gerobakjogja.vercel.app/api/sitemap
```

#### **Fresh Sitemap (No Cache)**
```
https://gerobakjogja.vercel.app/api/sitemap?fresh=true
```

#### **Regenerate Function**
```
POST https://gerobakjogja.vercel.app/api/regenerate-sitemap
```

### 💡 **Tips:**

1. **Untuk SEO**: Gunakan URL normal (dengan cache)
2. **Untuk testing**: Gunakan parameter `fresh=true`
3. **Untuk debugging**: Cek header `X-Generated-At` dan `X-Cache-Buster`
4. **Auto-update**: Sistem otomatis regenerate saat ada perubahan

### 🔍 **Debug Headers:**

Response headers yang bisa dicek:
```
X-Generated-At: 2025-12-10T14:30:00.000Z
X-Cache-Buster: 1733842800123
Cache-Control: no-cache, no-store, must-revalidate
```

Dengan perbaikan ini, sitemap akan update lebih cepat dan ada cara untuk bypass cache saat testing! 🎉