# Quick Start Guide - Gerobak Jogja

## 🚀 Setup Cepat

### 1. Install Dependencies
```bash
cd gerobak-jogja
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```
Website akan buka di `http://localhost:5173`

### 3. Build untuk Production
```bash
npm run build
```

## ⚙️ Konfigurasi Penting

### Update Kontak Info
Edit `src/config/contact.js`:
```javascript
export const CONTACT_INFO = {
  whatsapp: '6282327220077',  // Ganti dengan nomor Anda
  email: 'info@gerobakjogja.com',  // Ganti dengan email Anda
  address: 'Yogyakarta, Indonesia',  // Ganti dengan alamat Anda
  // ...
};
```

### Upload Foto Produk
1. Simpan foto di `public/images/products/`
2. Update path di:
   - `src/pages/Home.jsx` (produk unggulan)
   - `src/pages/Katalog.jsx` (katalog)
   - `src/pages/Galeri.jsx` (galeri)

Contoh:
```javascript
image: '/images/products/aluminium/gerobak-1.jpg'
```

### Update Harga Produk
Edit di `src/pages/Katalog.jsx`:
```javascript
const products = [
  { 
    id: 1, 
    name: 'Gerobak Aluminium Premium', 
    price: '3.500.000',  // Ganti harga di sini
    // ...
  },
];
```

### Setup Google Analytics
1. Buka `index.html`
2. Uncomment script Google Analytics
3. Ganti `G-XXXXXXXXXX` dengan ID Anda

## 📱 Fitur Utama

### WhatsApp Integration
- Floating button (kanan bawah)
- Button di navbar
- Button di setiap produk
- Auto-generated messages

### Admin Panel
Akses: `/admin`
- Username: `admin`
- Password: `admin123`

**Fitur Admin:**
- Tambah produk baru
- Edit produk existing
- Hapus produk
- Preview produk langsung
- Statistics dashboard
- Data tersimpan di localStorage

⚠️ **Penting**: 
- Data disimpan di localStorage browser
- Untuk production, implementasikan backend authentication yang proper
- Integrasikan dengan database untuk data persistence

### Halaman yang Tersedia
- `/` - Beranda
- `/katalog` - Katalog Produk
- `/produk/:id` - Detail Produk
- `/galeri` - Galeri Foto
- `/tentang` - Tentang Kami
- `/kontak` - Kontak & Form
- `/blog` - Blog Listing
- `/blog/:slug` - Blog Detail
- `/admin` - Admin Panel

## 🎨 Customization

### Ubah Warna Tema
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#0284c7',  // Warna utama
  }
}
```

### Ubah Font
Edit `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

## 🚀 Deploy

### Vercel (Tercepat)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Build: `npm run build`
2. Upload folder `dist` ke Netlify

### GitHub Pages
```bash
npm install -D gh-pages
npm run deploy
```

## 📚 Dokumentasi Lengkap

- `README.md` - Dokumentasi utama
- `FEATURES.md` - Daftar fitur
- `STYLE_GUIDE.md` - Panduan styling
- `CHANGELOG.md` - Riwayat perubahan

## 🆘 Troubleshooting

### Style tidak muncul?
```bash
# Clear cache dan restart
rm -rf node_modules/.vite
npm run dev
```

### Build error?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### WhatsApp button tidak berfungsi?
Cek nomor di `src/config/contact.js` (format: 62xxx tanpa +)

## 📞 Support

Butuh bantuan? Hubungi:
- WhatsApp: +62 823-2722-0077
- Email: info@gerobakjogja.com


## 🚀 Backend Integration

Website ini sudah siap untuk integrasi backend!

### Dokumentasi Backend
- `BACKEND_INTEGRATION.md` - Panduan lengkap integrasi backend
- `backend-template/` - Template backend Node.js + Express
- `src/services/api.js` - API service layer (ready to use)

### Pilihan Backend
1. **Firebase** - Cepat, mudah, gratis untuk MVP
2. **Node.js + MongoDB** - Full control, scalable
3. **Supabase** - Modern, PostgreSQL, open source

### Quick Start Backend
```bash
# Copy template
cp -r backend-template backend

# Install dependencies
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Run server
npm run dev
```

Lihat `BACKEND_INTEGRATION.md` untuk panduan lengkap!
