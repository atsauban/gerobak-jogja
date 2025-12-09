# 🔐 Update Firebase Security Rules

## Untuk Menambahkan Gallery Collection

### 1. Buka Firebase Console
- https://console.firebase.google.com
- Pilih project: **gerobak-jogja-123**

### 2. Buka Firestore Database
- Klik **Firestore Database** di menu kiri
- Klik tab **Rules** di atas

### 3. Update Rules (Copy-Paste)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products - Public read, Admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Testimonials - Public read, Admin write
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Blog Posts - Public read, Admin write
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // FAQs - Public read, Admin write
    match /faqs/{faqId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Gallery - Public read, Admin write
    match /gallery/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Contact Messages - Admin only
    match /contacts/{contactId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

### 4. Klik **Publish**

### 5. Tunggu 10-30 detik

### 6. Test di Admin Panel

Buka Admin Panel dan coba:
- ✅ Tambah gambar ke galeri
- ✅ Edit gambar
- ✅ Hapus gambar
- ✅ Lihat di halaman Galeri

## ✅ Selesai!

Sekarang fitur Gallery sudah bisa digunakan! 🎉

---

**Catatan:** Rules ini mengizinkan:
- Semua orang bisa **baca** data (untuk tampil di website)
- Hanya admin yang login bisa **tambah/edit/hapus** data
