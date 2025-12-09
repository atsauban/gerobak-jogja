# 🔍 DEBUG GUIDE - Gallery Display Issue

## Masalah
Gambar berhasil upload ke Cloudinary folder `gallery` dan tersimpan di Firebase, tapi tidak tampil di halaman Galeri (muncul placeholder error).

## Langkah Debug

### 1. Test Upload di Admin
1. **Refresh halaman admin** (Ctrl+Shift+R untuk hard refresh)
2. **Buka "Kelola Galeri"** (section dengan background UNGU)
3. **Upload gambar baru**
4. **Lihat console** - harus muncul:
   ```
   📸 GalleryManager - Received URL from upload: [URL]
   📸 URL type: string
   📸 Final URL to save: https://res.cloudinary.com/...
   ```

### 2. Saat Klik "Simpan Gambar"
Console harus menampilkan:
```
💾 Saving gallery image with data: { url: "...", title: "...", category: "..." }
🔗 Image URL: https://res.cloudinary.com/...
🔗 URL type: string
🔗 URL length: [angka > 0]
✅ Gallery image created successfully: { id: "...", url: "...", ... }
✅ Saved data: { ... }
```

### 3. Cek di Firebase Console
1. Buka Firebase Console: https://console.firebase.google.com/
2. Pilih project "gerobak-jogja"
3. Masuk ke Firestore Database
4. Cek collection `gallery`
5. Pastikan ada document dengan field:
   - `url`: string (harus ada URL Cloudinary lengkap)
   - `title`: string
   - `category`: string
   - `createdAt`: string
   - `updatedAt`: string

**PENTING:** Cek apakah field `url` berisi URL lengkap atau kosong!

### 4. Test di Halaman Galeri
1. **Buka halaman Galeri** (http://localhost:5173/galeri)
2. **Lihat console** - harus muncul:
   ```
   🖼️ Gallery images loaded: [array of images]
   📊 Total images: [angka]
   🔍 First image full data: { id: "...", url: "https://...", ... }
   🔗 First image URL: https://res.cloudinary.com/...
   🔗 URL type: string
   🔗 URL is valid: true
   📝 First image title: ...
   🏷️ First image category: ...
   Image 0: { id: "...", url: "...", urlValid: true, ... }
   ```

3. **Cek apakah ada error image load:**
   ```
   ❌ Image failed to load: [URL]
   ```

### 5. Cek Network Tab
1. Buka DevTools → Network tab
2. Filter: "Img"
3. Refresh halaman Galeri
4. Lihat apakah ada request ke Cloudinary
5. Jika ada request yang gagal (merah), klik untuk lihat detailnya

## Yang Perlu Dicopy & Kirim

Tolong copy dan kirim:

1. **Console log lengkap** dari langkah 1-4 (semua yang ada emoji 📸 🔗 💾 ✅ 🖼️)
2. **Screenshot Firebase Console** (collection gallery, buka salah satu document)
3. **Screenshot Network tab** (jika ada error merah)
4. **URL gambar yang tersimpan** di Firebase (copy paste field `url`)

## Kemungkinan Masalah & Solusi

### A. URL Kosong di Firebase ❌
**Gejala:** 
- Di Firebase: `url: ""` atau field `url` tidak ada
- Console: `🔗 Image URL: ` (kosong)

**Solusi:** 
- Cek apakah ImageUpload mengirim URL dengan benar
- Pastikan `onUploadComplete` dipanggil dengan URL string
- Cek console saat upload: `📸 Final URL to save: [harus ada URL]`

### B. URL Tidak Valid ⚠️
**Gejala:** 
- URL tidak dimulai dengan `https://res.cloudinary.com/`
- Console: `🔗 URL is valid: false`

**Solusi:**
- Cek response dari Cloudinary API
- Pastikan menggunakan `secure_url` bukan `url`
- Verifikasi di Network tab saat upload

### C. Data Tidak Tersimpan 🚫
**Gejala:** 
- Collection `gallery` kosong di Firebase
- Console: Error saat save

**Solusi:**
- Cek Firebase Rules (pastikan allow write)
- Cek error di console: `❌ Error saving gallery image:`
- Pastikan sudah login sebagai admin

### D. CORS Error 🌐
**Gejala:** 
- Error di Network tab saat load gambar
- Console: CORS policy error

**Solusi:**
- Cek Cloudinary settings
- Pastikan domain allowed
- Cek apakah URL accessible (buka di tab baru)

### E. URL Berubah Jadi Array 📦
**Gejala:**
- Console: `📸 URL type: object` atau `array`
- Firebase: `url: ["https://..."]` (array, bukan string)

**Solusi:**
- Sudah dihandle di code: `const imageUrl = Array.isArray(url) ? url[0] : url;`
- Tapi cek apakah benar-benar jadi string

## Test Manual di Console

Paste di browser console (halaman Galeri):

```javascript
// Test 1: Cek data yang dimuat
console.log('=== MANUAL TEST ===');
const galleryData = JSON.parse(localStorage.getItem('galleryImages') || '[]');
console.log('LocalStorage gallery:', galleryData);

// Test 2: Cek Firebase connection
import { getGalleryImages } from './src/services/firebaseService';
getGalleryImages().then(data => {
  console.log('Firebase gallery:', data);
  if (data.length > 0) {
    console.log('First image URL:', data[0].url);
    console.log('URL valid:', data[0].url && data[0].url.startsWith('http'));
  }
});
```

## Next Steps

Setelah dapat log lengkap, kita bisa:
1. ✅ Identifikasi di mana URL hilang/berubah
2. ✅ Fix di component yang bermasalah
3. ✅ Test ulang sampai berhasil

## Quick Fix Checklist

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Clear browser cache
- [ ] Restart dev server
- [ ] Cek Firebase Console (collection gallery)
- [ ] Upload gambar baru
- [ ] Copy console logs
- [ ] Cek Network tab
- [ ] Screenshot error (jika ada)

---
**Status:** Waiting for debug logs 🔍

**Last Updated:** Context transfer - gambar upload ke folder gallery berhasil, tapi tidak tampil di halaman
