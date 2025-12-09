# 🔐 Admin Authentication Setup Guide

Panduan setup authentication untuk protect admin panel menggunakan Firebase Authentication.

## ✅ Yang Sudah Dibuat:

1. **AuthContext** - Context untuk manage authentication state
2. **Login Page** - Form login dengan Firebase Auth
3. **Protected Admin** - Hanya user yang login bisa akses admin panel
4. **Logout Function** - Logout dengan aman

## 📋 Langkah Setup (5 Menit)

### 1. Aktifkan Firebase Authentication

1. Buka https://console.firebase.google.com/
2. Pilih project `gerobak-jogja-123`
3. Di sidebar, klik **"Authentication"**
4. Klik **"Get started"**
5. Pilih tab **"Sign-in method"**
6. Klik **"Email/Password"**
7. Toggle **"Enable"**
8. Klik **"Save"**

### 2. Buat Admin User

1. Masih di Authentication, klik tab **"Users"**
2. Klik **"Add user"**
3. Isi form:
   - **Email**: `admin@gerobakjogja.com` (atau email kamu)
   - **Password**: Buat password yang kuat (min 6 karakter)
4. Klik **"Add user"**

**SIMPAN** email dan password ini untuk login!

### 3. Update Firestore Security Rules

Sekarang kita perlu update Firestore Rules agar hanya user yang login bisa write data:

1. Di Firebase Console, klik **"Firestore Database"**
2. Klik tab **"Rules"**
3. Replace rules dengan:

```javascript
  
```

4. Klik **"Publish"**

### 4. Test Login

1. Refresh website
2. Buka `/admin`
3. Login dengan email & password yang dibuat di step 2
4. Seharusnya berhasil masuk ke admin panel!

## 🔒 Security Features

### ✅ Yang Sudah Protected:

1. **Admin Panel** - Hanya bisa diakses setelah login
2. **CRUD Operations** - Hanya authenticated user bisa create/update/delete
3. **Firestore Rules** - Database protected di server-side
4. **Auto Logout** - Session expired otomatis setelah 1 jam

### 🔐 Best Practices:

1. **Strong Password** - Min 12 karakter, kombinasi huruf, angka, simbol
2. **Unique Email** - Gunakan email khusus untuk admin
3. **Don't Share** - Jangan share credentials ke orang lain
4. **Regular Update** - Ganti password secara berkala

## 👥 Menambah Admin Baru

Jika mau tambah admin lain:

1. Firebase Console > Authentication > Users
2. Klik "Add user"
3. Masukkan email & password admin baru
4. Share credentials ke admin tersebut

## 🚨 Troubleshooting

### Error: "Email atau password salah"
- Cek email dan password yang dimasukkan
- Pastikan user sudah dibuat di Firebase Console

### Error: "User tidak ditemukan"
- User belum dibuat di Firebase Authentication
- Buat user baru di Firebase Console

### Error: "Terlalu banyak percobaan login"
- Firebase block sementara karena terlalu banyak failed attempts
- Tunggu 15-30 menit atau reset password

### Error: "Permission denied" saat save produk
- Firestore Rules belum diupdate
- Update rules sesuai step 3

## 🔄 Reset Password

Jika lupa password:

### Option 1: Reset di Firebase Console
1. Firebase Console > Authentication > Users
2. Klik user yang mau direset
3. Klik "Reset password"
4. Masukkan password baru

### Option 2: Password Reset Email (Advanced)
Bisa implement forgot password feature dengan Firebase:

```javascript
import { sendPasswordResetEmail } from 'firebase/auth';

const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
  alert('Password reset email sent!');
};
```

## 📊 Monitor Login Activity

Di Firebase Console > Authentication > Users, kamu bisa lihat:
- Last sign-in time
- Created date
- User UID
- Provider (Email/Password)

## 🎯 Next Steps (Optional)

### 1. Multi-Factor Authentication (MFA)
Tambah layer security dengan SMS/App verification

### 2. Role-Based Access
Buat role admin, editor, viewer dengan permission berbeda

### 3. Activity Logs
Track siapa yang edit/delete produk

### 4. Session Management
Set custom session timeout

## 💡 Tips

1. **Backup Admin Credentials** - Simpan di password manager
2. **Test Logout** - Pastikan logout berfungsi dengan baik
3. **Monitor Activity** - Cek Firebase Console secara berkala
4. **Update Rules** - Sesuaikan rules dengan kebutuhan bisnis

---

**Setup selesai! Admin panel sekarang protected dengan Firebase Authentication! 🎉**

Jika ada pertanyaan, silakan hubungi developer.
