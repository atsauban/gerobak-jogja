# 🚀 Cara Cepat Migrasi Data ke Firebase

## Langkah Singkat:

### 1. Buka website (npm run dev)

### 2. Login ke Admin Panel

### 3. Buka Browser Console (F12)

### 4. Jalankan perintah ini:

```javascript
// Load script
const script = document.createElement('script');
script.src = '/migrate-to-firebase.js';
document.head.appendChild(script);
```

### 5. Tunggu 2 detik, lalu jalankan:

```javascript
migrateToFirebase()
```

### 6. Tunggu sampai selesai (lihat progress di console)

### 7. Cek data di Firebase Console:
- Buka: https://console.firebase.google.com
- Pilih project: gerobak-jogja-123
- Buka: Firestore Database
- Cek collections: products, testimonials, blogPosts, faqs

### 8. Refresh website dan cek apakah data muncul

### 9. Jika sudah OK, hapus localStorage:

```javascript
clearLocalStorage()
```

### 10. Refresh website lagi

## ✅ SELESAI!

Data sekarang 100% tersimpan di Firebase Cloud!

---

**Detail lengkap:** Lihat file `MIGRATION_GUIDE.md`
