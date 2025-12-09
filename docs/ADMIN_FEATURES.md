# 🎛️ Fitur Admin Panel - Gerobak Jogja

## 📋 Daftar Fitur

### 1. 🔐 Authentication
- Login dengan email & password (Firebase Auth)
- Protected routes - hanya admin yang bisa akses
- Logout functionality

### 2. 📦 Kelola Produk
**CRUD Operations:**
- ✅ Create - Tambah produk baru
- ✅ Read - Lihat semua produk
- ✅ Update - Edit produk
- ✅ Delete - Hapus produk

**Fields:**
- Nama produk
- Kategori (Aluminium, Kayu, Stainless, Kombinasi)
- Harga
- Deskripsi singkat & lengkap
- Badge (Best Seller, Premium, dll)
- Upload gambar (max 5 gambar via Cloudinary)
- Spesifikasi (key-value pairs)
- Keunggulan/Features (list)
- Yang Anda Dapatkan (list)

**Features:**
- Preview produk (link ke detail page)
- Real-time sync dengan Firebase
- Image upload via Cloudinary

### 3. 💬 Kelola Testimoni
**CRUD Operations:**
- ✅ Create - Tambah testimoni
- ✅ Read - Lihat semua testimoni
- ✅ Update - Edit testimoni
- ✅ Delete - Hapus testimoni

**Fields:**
- Nama pelanggan
- Nama bisnis
- Rating (1-5 bintang)
- Teks testimoni
- Avatar (auto-generate dari nama)

**Features:**
- Rating dengan bintang visual
- Auto-generate avatar colorful
- Tampil di homepage

### 4. 📝 Kelola Blog
**CRUD Operations:**
- ✅ Create - Tambah artikel
- ✅ Read - Lihat semua artikel
- ✅ Update - Edit artikel
- ✅ Delete - Hapus artikel

**Fields:**
- Judul
- Slug (auto-generate dari judul)
- Excerpt (ringkasan)
- Konten lengkap (support Markdown)
- Kategori
- Author
- Featured flag (tampil di home)
- Gambar cover

**Features:**
- Auto-generate slug dari judul
- Featured posts untuk homepage
- Kategori untuk filtering
- Markdown support untuk konten

### 5. ❓ Kelola FAQ
**CRUD Operations:**
- ✅ Create - Tambah FAQ
- ✅ Read - Lihat semua FAQ
- ✅ Update - Edit FAQ
- ✅ Delete - Hapus FAQ

**Fields:**
- Pertanyaan
- Jawaban
- Order/Priority (untuk urutan tampil)

**Features:**
- Sortable by order
- Accordion display di website
- Real-time update

### 6. 🖼️ Kelola Galeri
**CRUD Operations:**
- ✅ Create - Tambah gambar
- ✅ Read - Lihat semua gambar
- ✅ Update - Edit gambar
- ✅ Delete - Hapus gambar

**Fields:**
- Upload gambar (via Cloudinary)
- Judul gambar
- Kategori (Aluminium, Kayu, Stainless, Kombinasi, Custom)

**Features:**
- Grid view dengan preview
- Category badge
- Lightbox view di website
- Filter by category

## 🎯 Cara Menggunakan

### Login ke Admin
1. Buka: `http://localhost:5173/admin`
2. Login dengan email & password yang sudah dibuat di Firebase
3. Akses semua fitur management

### Tambah Data Baru
1. Klik tombol **"Tambah [Item]"** di setiap section
2. Isi form yang muncul
3. Upload gambar jika diperlukan
4. Klik **"Simpan"**
5. Data langsung muncul di website

### Edit Data
1. Klik tombol **"Edit"** pada item yang ingin diedit
2. Form akan terisi dengan data lama
3. Ubah data yang diperlukan
4. Klik **"Update"**
5. Perubahan langsung terlihat

### Hapus Data
1. Klik tombol **"Hapus"** pada item
2. Konfirmasi penghapusan
3. Data terhapus dari Firebase

## 📊 Dashboard Stats

Admin panel menampilkan statistik:
- Total produk
- Jumlah gerobak aluminium
- Jumlah gerobak kayu
- (Bisa ditambah stats lainnya)

## 🔒 Security

- **Authentication Required**: Semua operasi write memerlukan login
- **Firebase Security Rules**: 
  - Public read (semua orang bisa lihat website)
  - Admin write (hanya admin bisa tambah/edit/hapus)
- **Protected Routes**: Halaman admin tidak bisa diakses tanpa login

## 💾 Data Storage

### Firebase Firestore Collections:
- `products` - Data produk
- `testimonials` - Testimoni pelanggan
- `blogPosts` - Artikel blog
- `faqs` - Frequently Asked Questions
- `gallery` - Gambar galeri

### Cloudinary:
- Semua gambar (produk & galeri)
- Free tier: 25GB storage, 25GB bandwidth/month

## 🚀 Production Ready

✅ Real-time sync dengan Firebase
✅ Cloud storage untuk gambar
✅ Responsive design
✅ Error handling
✅ Loading states
✅ Confirmation dialogs
✅ Form validation
✅ SEO friendly

## 📱 Responsive

Admin panel fully responsive:
- Desktop: Full layout dengan sidebar
- Tablet: Optimized grid
- Mobile: Stack layout, touch-friendly buttons

## 🎨 UI/UX Features

- Modern card-based design
- Color-coded buttons (green=save, blue=edit, red=delete)
- Loading spinners
- Success/error messages
- Smooth animations
- Intuitive forms
- Preview before save

## 🔄 Real-time Updates

Semua perubahan di admin langsung terlihat di:
- Homepage (produk featured, testimoni)
- Katalog (semua produk)
- Detail Produk
- Blog page
- Galeri page
- FAQ section

## 📝 Tips

1. **Upload Gambar**: Gunakan gambar berkualitas tinggi (min 800x600px)
2. **SEO**: Isi semua field dengan lengkap untuk SEO
3. **Featured**: Tandai produk/blog sebagai featured untuk tampil di home
4. **Kategori**: Gunakan kategori konsisten untuk filtering
5. **Backup**: Data tersimpan di Firebase (auto-backup by Google)

## 🆘 Troubleshooting

### Tidak bisa login?
- Pastikan user sudah dibuat di Firebase Console
- Cek email & password
- Clear browser cache

### Gambar tidak terupload?
- Cek koneksi internet
- Pastikan file < 5MB
- Format: JPG, PNG, WebP
- Cek Cloudinary credentials di .env

### Data tidak muncul?
- Refresh halaman
- Cek Firebase Console apakah data tersimpan
- Cek browser console untuk error
- Pastikan Firebase Rules sudah di-publish

---

**Butuh bantuan?** Hubungi developer atau cek dokumentasi Firebase.
