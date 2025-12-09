# 📦 Panduan Migrasi Data ke Firebase

Panduan ini akan membantu Anda memindahkan semua data dari localStorage ke Firebase Firestore.

## 🎯 Yang Akan Dimigrasikan

- ✅ Produk (products)
- ✅ Testimoni (testimonials)
- ✅ Blog Posts (blogPosts)
- ✅ FAQ (faqs)

## 📋 Langkah-Langkah Migrasi

### 1. Persiapan

Pastikan:
- ✅ Website sudah running (`npm run dev`)
- ✅ Firebase sudah dikonfigurasi dengan benar
- ✅ File `.env` sudah diisi dengan credentials Firebase
- ✅ Sudah login ke admin panel

### 2. Load Script Migrasi

Buka browser console (F12 atau Ctrl+Shift+I), lalu jalankan:

```javascript
// Load script migrasi
const script = document.createElement('script');
script.src = '/migrate-to-firebase.js';
document.head.appendChild(script);
```

Tunggu beberapa detik sampai muncul pesan "CARA MENGGUNAKAN".

### 3. Jalankan Migrasi

Di console, ketik:

```javascript
migrateToFirebase()
```

Script akan:
- Membaca semua data dari localStorage
- Upload satu per satu ke Firebase
- Menampilkan progress di console

**Contoh output:**
```
🚀 Memulai migrasi data ke Firebase...
📦 Ditemukan 6 produk di localStorage
✅ Produk "Gerobak Aluminium Premium" berhasil dimigrasikan
✅ Produk "Gerobak Kayu Klasik" berhasil dimigrasikan
...
💬 Ditemukan 3 testimoni di localStorage
✅ Testimoni dari "Budi Santoso" berhasil dimigrasikan
...
✨ MIGRASI SELESAI! ✨
```

### 4. Verifikasi Data di Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project: **gerobak-jogja-123**
3. Buka **Firestore Database**
4. Cek collections:
   - `products` - harus ada produk yang dimigrasikan
   - `testimonials` - harus ada testimoni
   - `blogPosts` - harus ada blog posts
   - `faqs` - harus ada FAQs

### 5. Verifikasi di Website

1. Refresh halaman website
2. Cek halaman:
   - **Katalog** - produk harus muncul
   - **Home** - testimoni harus muncul
   - **Blog** - blog posts harus muncul
   - **FAQ** - FAQs harus muncul
3. Cek **Admin Panel** - semua data harus terlihat

### 6. Bersihkan localStorage (HATI-HATI!)

⚠️ **PENTING:** Hanya lakukan ini setelah memastikan semua data sudah ada di Firebase!

Di console, ketik:

```javascript
clearLocalStorage()
```

Akan muncul konfirmasi. Klik OK jika yakin.

Setelah itu, refresh halaman. Data sekarang 100% dari Firebase!

## 🔍 Troubleshooting

### Error: "window.addProductToFirebase is not a function"

**Solusi:** Refresh halaman dan pastikan website sudah fully loaded sebelum load script migrasi.

### Data tidak muncul setelah migrasi

**Solusi:**
1. Cek Firebase Console - apakah data benar-benar tersimpan?
2. Cek browser console - ada error?
3. Pastikan Firebase rules mengizinkan read/write
4. Refresh halaman beberapa kali

### Migrasi terhenti di tengah jalan

**Solusi:**
1. Cek console untuk error message
2. Cek koneksi internet
3. Jalankan ulang `migrateToFirebase()` - data yang sudah ada tidak akan duplikat

### Ingin rollback ke localStorage

**Solusi:**
Jika belum menjalankan `clearLocalStorage()`, data masih ada di localStorage. Cukup refresh halaman.

## 📝 Catatan Penting

1. **Gambar produk:** Jika produk di localStorage menggunakan URL placeholder, Anda perlu upload ulang gambar asli via admin panel setelah migrasi.

2. **ID produk:** ID lama dari localStorage akan diganti dengan ID baru dari Firebase (format string panjang).

3. **Backup:** Sebelum clear localStorage, Anda bisa backup data dengan:
   ```javascript
   const backup = {
     products: localStorage.getItem('products'),
     testimonials: localStorage.getItem('testimonials'),
     blogPosts: localStorage.getItem('blogPosts'),
     faqs: localStorage.getItem('faqs')
   };
   console.log(JSON.stringify(backup));
   // Copy output dan simpan di file .txt
   ```

4. **Setelah migrasi:** Website akan 100% menggunakan Firebase. Tidak ada lagi data di localStorage.

## ✅ Checklist Migrasi

- [ ] Website running
- [ ] Firebase configured
- [ ] Login ke admin
- [ ] Load script migrasi
- [ ] Jalankan `migrateToFirebase()`
- [ ] Verifikasi di Firebase Console
- [ ] Verifikasi di website
- [ ] Backup localStorage (optional)
- [ ] Jalankan `clearLocalStorage()`
- [ ] Refresh dan test website
- [ ] Upload gambar produk asli (jika perlu)

## 🎉 Selesai!

Setelah migrasi berhasil, website Anda sudah production-ready dengan:
- ✅ Data tersimpan di cloud (Firebase)
- ✅ Real-time sync
- ✅ Tidak bergantung pada browser localStorage
- ✅ Bisa diakses dari device manapun

---

**Butuh bantuan?** Hubungi developer atau cek dokumentasi Firebase.
