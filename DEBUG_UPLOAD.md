# 🐛 Debug Upload Folder Issue

## Langkah Debug:

### 1. Pastikan File Sudah Tersimpan
Cek apakah perubahan sudah tersimpan dengan benar:

```bash
# Di terminal, cek isi file
cat gerobak-jogja/src/components/GalleryManager.jsx | grep "folder="
```

Harus muncul: `folder="gallery"`

### 2. Restart Dev Server (PENTING!)
```bash
# Stop server (Ctrl+C)
cd gerobak-jogja
npm run dev
```

### 3. Clear Browser Cache TOTAL
**Chrome/Edge:**
1. Buka DevTools (F12)
2. Klik kanan tombol Refresh
3. Pilih "Empty Cache and Hard Reload"

**Firefox:**
1. Ctrl+Shift+Delete
2. Pilih "Cached Web Content"
3. Clear Now

### 4. Buka Admin Panel Fresh
1. Buka tab baru
2. Go to: http://localhost:5173/admin
3. Login
4. Scroll ke **"Kelola Galeri"** (background UNGU/PURPLE)
5. Klik "Tambah Gambar"

### 5. Cek Console Saat Upload
Buka Browser Console (F12), saat upload harus muncul:
```
🔍 ImageUpload - folder parameter: gallery
📁 Uploading to folder: gerobak-jogja/gallery
```

Jika muncul `folder parameter: products` → berarti masih cache!

### 6. Verifikasi di Network Tab
1. Buka DevTools → Network tab
2. Upload gambar
3. Cari request ke `cloudinary.com`
4. Klik request → Payload/Form Data
5. Cek field `folder` → harus `gerobak-jogja/gallery`

## ⚠️ PENTING: Jangan Salah Section!

Ada 2 section upload di Admin:

### ❌ BUKAN INI (Kelola Produk):
- Background: Abu-abu
- Label: "Gambar Produk *"
- Multiple: Ya (max 5)
- Folder: products ✓ (ini benar untuk produk)

### ✅ YANG INI (Kelola Galeri):
- Background: **UNGU/PURPLE** 🟣
- Label: "Upload Gambar *"
- Info box: "📸 Upload Gambar Galeri"
- Multiple: Tidak (max 1)
- Folder: gallery ✓

## 🔍 Jika Masih Gagal:

### Test Manual di Console:
```javascript
// Paste di browser console
console.log('Testing ImageUpload component...');

// Cek apakah component loaded dengan benar
const galleryForm = document.querySelector('.bg-purple-50');
console.log('Gallery form found:', !!galleryForm);
```

### Cek Build Cache:
```bash
# Hapus cache Vite
cd gerobak-jogja
rm -rf node_modules/.vite
npm run dev
```

### Last Resort - Force Rebuild:
```bash
cd gerobak-jogja
npm run build
npm run dev
```

## ✅ Cara Memastikan Berhasil:

1. Console log harus show: `folder parameter: gallery`
2. Network request payload harus: `folder: gerobak-jogja/gallery`
3. Di Cloudinary, gambar muncul di folder `gerobak-jogja/gallery/`
4. Form upload punya background UNGU

## 📝 Catatan:

- Section "Kelola Produk" → folder `products` (BENAR)
- Section "Kelola Galeri" → folder `gallery` (BENAR)
- Keduanya menggunakan component yang sama (ImageUpload)
- Bedanya di prop `folder` yang dikirim

---

Jika sudah ikuti semua langkah tapi masih ke `products`, screenshot console log dan network payload!
