# Admin Panel Guide

## 🔐 Login

1. Akses `/admin`
2. Username: `admin`
3. Password: `admin123`

## 📊 Dashboard

Setelah login, Anda akan melihat:
- **Total Produk**: Jumlah semua produk
- **Gerobak Aluminium**: Jumlah produk kategori aluminium
- **Gerobak Kayu**: Jumlah produk kategori kayu

## ➕ Menambah Produk

1. Klik tombol **"Tambah Produk"**
2. Isi form:
   - **Nama Produk** (required): Nama lengkap produk
   - **Kategori** (required): Pilih dari dropdown
   - **Harga** (required): Masukkan angka saja (tanpa Rp atau titik)
   - **Badge** (optional): Label seperti "Best Seller", "Premium", dll
   - **Deskripsi Singkat** (required): Deskripsi 1-2 kalimat
3. Klik **"Simpan Produk"**

### Contoh Input:
```
Nama: Gerobak Aluminium Premium
Kategori: aluminium
Harga: 3500000
Badge: Best Seller
Deskripsi: Gerobak aluminium dengan finishing premium dan desain modern
```

## ✏️ Mengedit Produk

1. Klik icon **Edit** (pensil hijau) pada produk yang ingin diedit
2. Form akan muncul dengan data produk
3. Ubah data yang diperlukan
4. Klik **"Update Produk"**

## 👁️ Preview Produk

1. Klik icon **Eye** (mata biru) pada produk
2. Halaman detail produk akan terbuka di tab baru
3. Anda bisa melihat tampilan produk seperti yang dilihat customer

## 🗑️ Menghapus Produk

1. Klik icon **Trash** (tempat sampah merah) pada produk
2. Konfirmasi penghapusan
3. Produk akan dihapus permanent

⚠️ **Perhatian**: Penghapusan tidak bisa di-undo!

## 💾 Penyimpanan Data

### LocalStorage
- Data produk disimpan di localStorage browser
- Data akan tetap ada meskipun browser ditutup
- Data bersifat lokal per browser/device

### Backup Data
Untuk backup data:
1. Buka Developer Tools (F12)
2. Tab **Application** > **Local Storage**
3. Cari key `gerobak_products`
4. Copy value-nya dan simpan

### Restore Data
1. Buka Developer Tools (F12)
2. Tab **Console**
3. Paste dan jalankan:
```javascript
localStorage.setItem('gerobak_products', 'PASTE_BACKUP_DATA_HERE');
location.reload();
```

## 🔄 Sinkronisasi

### Katalog & Home
- Produk yang ditambah/edit akan **langsung muncul** di:
  - Halaman Katalog (`/katalog`)
  - Halaman Home (`/`) - Top 3 produk berdasarkan rating
  - Halaman Detail (`/produk/:id`)

### Sorting
- Home page menampilkan 3 produk dengan rating tertinggi
- Katalog menampilkan semua produk
- Filter kategori bekerja otomatis

## 🎨 Customization

### Default Data
Data produk default ada di `src/context/ProductContext.jsx`

### Struktur Data Produk
```javascript
{
  id: number,
  name: string,
  category: 'aluminium' | 'kayu' | 'stainless' | 'kombinasi',
  price: string, // angka saja
  rating: number,
  reviews: number,
  badge: string | null,
  shortDesc: string,
  description: string,
  images: string[],
  specifications: object,
  features: string[],
  includes: string[]
}
```

## 🚀 Production Ready

### Backend Integration
Untuk production, integrasikan dengan:

1. **Database**
   - Firebase Firestore
   - Supabase
   - MongoDB
   - PostgreSQL

2. **Authentication**
   - JWT tokens
   - OAuth
   - Firebase Auth
   - Auth0

3. **Image Upload**
   - Cloudinary
   - AWS S3
   - Firebase Storage
   - Uploadcare

4. **API Endpoints**
   ```
   GET    /api/products       - Get all products
   GET    /api/products/:id   - Get single product
   POST   /api/products       - Create product
   PUT    /api/products/:id   - Update product
   DELETE /api/products/:id   - Delete product
   ```

## 📝 Best Practices

### Naming
- Gunakan nama yang jelas dan deskriptif
- Konsisten dengan format penamaan

### Pricing
- Masukkan harga dalam format angka saja
- Sistem akan format otomatis dengan separator

### Categories
- Gunakan kategori yang sudah ada
- Jika perlu kategori baru, tambahkan di code

### Badges
- Gunakan badge untuk highlight produk
- Contoh: "Best Seller", "Premium", "Hemat", "Populer"
- Jangan terlalu banyak badge

### Descriptions
- Tulis deskripsi yang menarik dan informatif
- Fokus pada keunggulan produk
- Gunakan bahasa yang mudah dipahami

## 🆘 Troubleshooting

### Data Hilang
- Cek apakah localStorage browser penuh
- Cek apakah ada error di console
- Restore dari backup

### Produk Tidak Muncul
- Refresh halaman (Ctrl+R)
- Clear cache browser
- Cek console untuk error

### Form Tidak Bisa Submit
- Pastikan semua field required terisi
- Cek format harga (angka saja)
- Cek console untuk error

## 📞 Support

Butuh bantuan?
- WhatsApp: +62 823-2722-0077
- Email: info@gerobakjogja.com
