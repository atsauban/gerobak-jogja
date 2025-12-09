# 📝 Cara Populate Data Default ke Firebase

## Langkah Cepat:

### 1. Pastikan sudah login ke Admin Panel

### 2. Buka Browser Console (F12)

### 3. Load script:

```javascript
const script = document.createElement('script');
script.src = '/populate-default-data.js';
document.head.appendChild(script);
```

### 4. Tunggu 2 detik, lalu jalankan:

```javascript
populateDefaultData()
```

### 5. Tunggu sampai selesai

Script akan menambahkan:
- ✅ 6 Testimoni pelanggan
- ✅ 3 Blog posts
- ✅ 8 FAQs

### 6. Refresh halaman

### 7. Cek hasilnya:
- Home → Testimoni muncul
- Blog → 3 artikel muncul
- FAQ → 8 pertanyaan muncul

### 8. Verifikasi di Firebase Console:
- Buka: https://console.firebase.google.com
- Pilih: gerobak-jogja-123
- Firestore Database
- Cek collections: `testimonials`, `blogPosts`, `faqs`

## ✅ SELESAI!

Sekarang semua data (produk, testimoni, blog, FAQ) tersimpan di Firebase! 🎉

---

**Catatan:** Data ini adalah contoh. Anda bisa edit/hapus via Admin Panel sesuai kebutuhan.
