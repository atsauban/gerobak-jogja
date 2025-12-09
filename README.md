# Gerobak Jogja - Website

Website untuk bisnis Gerobak Jogja yang melayani pembuatan dan pemesanan berbagai jenis gerobak.

## Fitur

- 🏠 **Landing Page** - Halaman utama dengan hero section dan highlight produk
- 📦 **Katalog Produk** - Menampilkan berbagai jenis gerobak dengan filter kategori
- 🖼️ **Galeri** - Galeri foto produk dengan lightbox
- ℹ️ **Tentang Kami** - Informasi tentang perusahaan, visi, dan misi
- 💬 **Pemesanan WhatsApp** - Tombol pemesanan langsung via WhatsApp
- 🔐 **Admin Panel** - Panel admin untuk mengelola produk

## Teknologi

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React (icons)

## Instalasi

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
```

## Konfigurasi Kontak

Semua informasi kontak tersimpan di `src/config/contact.js`:
- Nomor WhatsApp: 6282327220077
- Email: info@gerobakjogja.com
- Alamat, jam operasional, social media

Edit file ini untuk mengubah semua kontak info sekaligus.

## Admin Panel

Akses admin panel di `/admin`

**Login Demo:**
- Username: `admin`
- Password: `admin123`

⚠️ **Penting:** Untuk production, implementasikan autentikasi yang proper dengan backend!

## Customisasi

### Warna
Edit `tailwind.config.js` untuk mengubah warna tema:
```js
colors: {
  primary: {
    600: '#0284c7',  // Warna utama
    700: '#0369a1',  // Hover state
  },
  accent: {
    500: '#d97706',  // Accent color
  }
}
```

Lihat `STYLE_GUIDE.md` untuk panduan lengkap styling.

### Gambar Produk
1. Simpan foto produk di folder `public/images/`
2. Struktur folder:
   ```
   public/images/
   ├── products/    # Foto katalog
   ├── gallery/     # Foto galeri
   ├── hero/        # Hero section
   └── about/       # Workshop/tim
   ```
3. Update path di file component
4. Lihat `public/images/README.md` untuk panduan lengkap

### Konten
Edit konten di masing-masing file page sesuai kebutuhan bisnis Anda.

### Google Analytics
Uncomment dan ganti ID di `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Build: `npm run build`
2. Drag & drop folder `dist` ke Netlify
3. Atau connect dengan GitHub

### GitHub Pages
1. Install: `npm install -D gh-pages`
2. Add to `package.json`:
   ```json
   "homepage": "https://username.github.io/repo-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

## Dokumentasi Lengkap

- `FEATURES.md` - Daftar fitur lengkap
- `STYLE_GUIDE.md` - Panduan styling
- `public/images/README.md` - Panduan images

## Lisensi

© 2024 Gerobak Jogja. All rights reserved.
