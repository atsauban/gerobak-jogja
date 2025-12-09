# Gerobak Jogja - Website

Website untuk bisnis Gerobak Jogja yang melayani pembuatan dan pemesanan berbagai jenis gerobak.

## Fitur

### 🎨 NEW! Design Improvements (Dec 2025)
- ⚡ **Loading Skeletons** - Professional animated placeholders
- 🖼️ **Lazy Image Loading** - Blur-to-clear transitions with error handling
- 🔍 **Real-time Search** - Instant product filtering
- ⚡ **Quick View Modal** - Preview products without leaving page
- 🧭 **Breadcrumbs** - Better navigation
- 📱 **Mobile Optimized** - Fully responsive design
- ♿ **Accessible** - Focus states, ARIA labels, keyboard navigation

### Core Features
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
- Firebase (Firestore, Storage, Authentication)
- Cloudinary (Image hosting)
- Netlify Functions (Serverless backend)
- Marked (Markdown parser untuk blog)

## Instalasi

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Jalankan dengan Netlify Dev (untuk testing Netlify Functions)
netlify dev

# Build untuk production
npm run build
```

## Development dengan Netlify Dev

Untuk menjalankan project dengan Netlify Functions (diperlukan untuk fitur Cloudinary auto-delete):

```bash
# Install Netlify CLI (jika belum)
npm install -g netlify-cli

# Jalankan development server dengan Netlify
netlify dev
```

Server akan berjalan di `http://localhost:8888`

**Fitur yang memerlukan Netlify Dev:**
- Auto-delete gambar dari Cloudinary saat dihapus di admin
- Netlify Functions untuk backend operations

**Environment Variables:**
Buat file `.env.development` dengan isi:
```env
VITE_WHATSAPP_NUMBER=6282327220077
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Konfigurasi Kontak

Semua informasi kontak tersimpan di `src/config/contact.js`:
- Nomor WhatsApp: 6282327220077
- Email: info@gerobakjogja.com
- Alamat, jam operasional, social media

Edit file ini untuk mengubah semua kontak info sekaligus.

## Admin Panel

Akses admin panel di `/admin`

**Autentikasi:**
- Menggunakan Firebase Authentication
- Setup user admin di Firebase Console > Authentication > Users
- Login dengan email dan password yang sudah dibuat

**Fitur Admin:**
- ✅ Kelola Produk (CRUD dengan upload gambar ke Cloudinary)
- ✅ Kelola Galeri (Upload/delete dengan auto-delete dari Cloudinary)
- ✅ Kelola Blog (Markdown support)
- ✅ Kelola Testimoni
- ✅ Kelola FAQ
- ✅ Set Featured Products (max 3 produk unggulan)

⚠️ **Penting:** Pastikan Firebase Rules sudah dikonfigurasi dengan benar untuk keamanan!

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

### Netlify (Recommended)

**Mengapa Netlify?**
- Support Netlify Functions untuk Cloudinary auto-delete
- Automatic deployments dari GitHub
- Environment variables management
- Free SSL certificate

**Deploy Steps:**

1. **Connect ke GitHub:**
   - Login ke Netlify
   - New site from Git
   - Pilih repository `gerobak-jogja`

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables:**
   Tambahkan di Netlify Dashboard > Site settings > Environment variables:
   ```
   VITE_WHATSAPP_NUMBER=6282327220077
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Deploy:**
   - Push ke GitHub main branch
   - Netlify akan auto-deploy

### Vercel
⚠️ **Note:** Vercel tidak support Netlify Functions, fitur Cloudinary auto-delete tidak akan berfungsi.

```bash
npm install -g vercel
vercel
```

### Manual Deploy
```bash
# Build
npm run build

# Upload folder dist ke hosting
```

## 📚 Dokumentasi Lengkap

**Lihat [DOCS.md](DOCS.md) untuk index lengkap semua dokumentasi!**

### 🎨 Design & Components (NEW!)
- [docs/QUICK_DESIGN_GUIDE.md](docs/QUICK_DESIGN_GUIDE.md) - Quick reference komponen baru
- [docs/DESIGN_IMPROVEMENTS.md](docs/DESIGN_IMPROVEMENTS.md) - Detail implementasi
- [docs/BEFORE_AFTER_COMPARISON.md](docs/BEFORE_AFTER_COMPARISON.md) - Perbandingan visual
- [docs/COMPONENT_MIGRATION_GUIDE.md](docs/COMPONENT_MIGRATION_GUIDE.md) - Panduan migrasi
- [docs/IMPLEMENTATION_COMPLETE.md](docs/IMPLEMENTATION_COMPLETE.md) - Summary

### Quick Links
- [docs/START_HERE.md](docs/START_HERE.md) - Setup Cloudinary (5 menit)
- [docs/QUICK_START.md](docs/QUICK_START.md) - Quick start guide
- [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) - Panduan styling
- [docs/FEATURES.md](docs/FEATURES.md) - Daftar fitur lengkap
- [docs/INDEX.md](docs/INDEX.md) - Index semua dokumentasi

## Lisensi

© 2024 Gerobak Jogja. All rights reserved.
