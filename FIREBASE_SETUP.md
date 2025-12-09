# 🔥 Firebase Setup Guide - Gerobak Jogja

Panduan lengkap setup Firebase untuk website Gerobak Jogja.

## 📋 Langkah-langkah Setup

### 1. Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"** atau **"Tambah project"**
3. Masukkan nama project: `gerobak-jogja` (atau nama lain)
4. (Optional) Aktifkan Google Analytics
5. Klik **"Create project"**

### 2. Daftarkan Web App

1. Di Firebase Console, klik icon **Web** (</>) untuk menambah web app
2. Masukkan nickname: `Gerobak Jogja Website`
3. (Optional) Centang **"Also set up Firebase Hosting"**
4. Klik **"Register app"**
5. **SIMPAN** Firebase configuration yang muncul (akan dipakai di step 4)

```javascript
// Contoh Firebase Config (JANGAN PAKAI INI, pakai punya kamu!)
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "gerobak-jogja.firebaseapp.com",
  projectId: "gerobak-jogja",
  storageBucket: "gerobak-jogja.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 3. Setup Firestore Database

1. Di sidebar Firebase Console, klik **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih lokasi: **asia-southeast1** (Singapore) atau **asia-southeast2** (Jakarta)
4. Pilih mode:
   - **Production mode** (lebih aman, perlu setup rules)
   - **Test mode** (untuk development, rules terbuka 30 hari)
5. Klik **"Enable"**

#### Setup Security Rules (Production Mode)

Jika pilih production mode, update Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products - Public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Hanya user yang login
    }
    
    // Blog Posts - Public read, admin write
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Contact Messages - Anyone can create, admin can read
    match /contactMessages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### 4. Setup Firebase Storage

1. Di sidebar Firebase Console, klik **"Storage"**
2. Klik **"Get started"**
3. Pilih mode:
   - **Production mode** (lebih aman)
   - **Test mode** (untuk development)
4. Pilih lokasi yang sama dengan Firestore
5. Klik **"Done"**

#### Setup Storage Rules (Production Mode)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Products images - Public read, admin write
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Blog images - Public read, admin write
    match /blog/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Setup Authentication (untuk Admin)

1. Di sidebar Firebase Console, klik **"Authentication"**
2. Klik **"Get started"**
3. Pilih tab **"Sign-in method"**
4. Enable **"Email/Password"**
5. Klik **"Save"**

#### Buat Admin User

1. Klik tab **"Users"**
2. Klik **"Add user"**
3. Masukkan:
   - Email: `admin@gerobakjogja.com` (atau email kamu)
   - Password: (buat password yang kuat)
4. Klik **"Add user"**

### 6. Konfigurasi Environment Variables

1. Copy file `.env.example` menjadi `.env`:

```bash
copy .env.example .env
```

2. Buka file `.env` dan isi dengan Firebase Config dari step 2:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=gerobak-jogja.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gerobak-jogja
VITE_FIREBASE_STORAGE_BUCKET=gerobak-jogja.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 7. Update ProductContext untuk Firebase

Sekarang kita perlu update `ProductContext.jsx` untuk menggunakan Firebase:

```javascript
// src/context/ProductContext.jsx
import { createContext, useState, useEffect } from 'react';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/firebaseService';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from Firebase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    try {
      const newProduct = await createProduct(product);
      setProducts([newProduct, ...products]);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const editProduct = async (id, updatedProduct) => {
    try {
      await updateProduct(id, updatedProduct);
      setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      addProduct,
      editProduct,
      removeProduct,
      refreshProducts: loadProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};
```

### 8. Update ContactForm untuk Firebase

```javascript
// src/components/ContactForm.jsx
import { useState } from 'react';
import { saveContactMessage } from '../services/firebaseService';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await saveContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  // ... rest of component
}
```

### 9. Test Firebase Connection

1. Restart development server:

```bash
npm run dev
```

2. Buka browser dan cek Console (F12)
3. Seharusnya tidak ada error Firebase
4. Coba buka halaman Admin dan tambah produk baru
5. Cek di Firebase Console > Firestore Database, seharusnya ada data baru

### 10. Seed Initial Data (Optional)

Jika mau import data awal ke Firebase:

```javascript
// src/utils/seedData.js
import { createProduct } from '../services/firebaseService';

const initialProducts = [
  {
    name: 'Gerobak Aluminium Premium',
    category: 'Aluminium',
    price: 3500000,
    description: 'Gerobak aluminium berkualitas tinggi...',
    image: '/images/products/gerobak-aluminium-1.jpg',
    images: [
      '/images/products/gerobak-aluminium-1.jpg',
      '/images/products/gerobak-aluminium-2.jpg'
    ],
    specifications: {
      material: 'Aluminium',
      ukuran: '120cm x 80cm x 100cm',
      berat: '25kg',
      kapasitas: '100kg'
    },
    features: [
      'Tahan karat dan cuaca',
      'Ringan dan mudah dipindahkan',
      'Desain modern dan elegan'
    ],
    includes: [
      '1x Gerobak Aluminium',
      '4x Roda dengan rem',
      'Garansi 2 tahun'
    ]
  },
  // ... tambah produk lainnya
];

export const seedProducts = async () => {
  try {
    for (const product of initialProducts) {
      await createProduct(product);
      console.log(`Created: ${product.name}`);
    }
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};
```

Jalankan di browser console:

```javascript
import { seedProducts } from './utils/seedData';
seedProducts();
```

## 🔐 Setup Admin Login (Optional)

Jika mau protect halaman admin dengan login:

1. Buat `src/context/AuthContext.jsx`
2. Implement login/logout dengan Firebase Auth
3. Protect route `/admin` dengan authentication check

Lihat file `BACKEND_INTEGRATION.md` untuk detail lengkap.

## 📊 Monitoring & Analytics

### Firebase Console

- **Firestore Database**: Lihat semua data products, blog posts, messages
- **Storage**: Lihat semua gambar yang diupload
- **Authentication**: Manage admin users
- **Usage**: Monitor quota dan billing

### Quota Gratis Firebase

- **Firestore**: 50K reads, 20K writes, 20K deletes per hari
- **Storage**: 5GB storage, 1GB download per hari
- **Authentication**: Unlimited

Untuk website kecil-menengah, quota gratis sudah cukup!

## 🚀 Deploy ke Production

### Option 1: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 2: Netlify/Vercel

1. Build project: `npm run build`
2. Upload folder `dist` ke Netlify/Vercel
3. Set environment variables di dashboard hosting

**PENTING**: Jangan lupa set environment variables di hosting!

## 🔧 Troubleshooting

### Error: Firebase not initialized

- Cek file `.env` sudah ada dan terisi dengan benar
- Restart development server setelah update `.env`

### Error: Permission denied

- Cek Firestore Rules dan Storage Rules
- Pastikan rules allow read/write sesuai kebutuhan

### Error: Quota exceeded

- Cek usage di Firebase Console
- Upgrade ke Blaze plan jika perlu (pay as you go)

### Images tidak muncul

- Cek Storage Rules allow public read
- Cek URL image sudah benar (gunakan Firebase Storage URL)

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Storage Guide](https://firebase.google.com/docs/storage)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)

## 💡 Tips

1. **Backup Data**: Export Firestore data secara berkala
2. **Security Rules**: Selalu gunakan production mode untuk website live
3. **Image Optimization**: Compress gambar sebelum upload (max 500KB)
4. **Monitoring**: Setup Firebase Analytics untuk track user behavior
5. **Budget Alert**: Set budget alert di Google Cloud Console

---

**Selamat! Firebase sudah siap digunakan! 🎉**

Jika ada pertanyaan atau error, silakan hubungi developer.
