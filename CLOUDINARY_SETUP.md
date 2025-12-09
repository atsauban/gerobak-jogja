# ☁️ Cloudinary Setup Guide - Gerobak Jogja

Panduan setup Cloudinary untuk upload gambar produk (100% GRATIS, tanpa kartu kredit!)

## 🎯 Kenapa Cloudinary?

- ✅ **Gratis 25GB/bulan** bandwidth
- ✅ **Gratis 25GB** storage
- ✅ **Tidak perlu kartu kredit**
- ✅ **Auto image optimization** (WebP, resize, compress)
- ✅ **CDN global** (loading cepat di seluruh dunia)
- ✅ **Unlimited transformations**

## 📋 Langkah Setup (5 Menit)

### 1. Daftar Cloudinary

1. Buka https://cloudinary.com/users/register_free
2. Isi form:
   - Email
   - Password
   - Nama
3. Klik **"Sign Up"**
4. Verifikasi email (cek inbox)

### 2. Get Cloud Name

Setelah login, kamu akan lihat **Dashboard**:

```
Cloud name: demo123456
API Key: 123456789012345
API Secret: xxxxxxxxxxxxxxxxx
```

**COPY** Cloud Name kamu (contoh: `demo123456`)

### 3. Create Upload Preset

Upload preset memungkinkan upload tanpa API key (aman untuk frontend):

1. Di dashboard, klik **Settings** (⚙️ icon di kanan atas)
2. Klik tab **"Upload"**
3. Scroll ke bawah ke section **"Upload presets"**
4. Klik **"Add upload preset"**
5. Isi:
   - **Preset name**: `gerobak_jogja`
   - **Signing mode**: **Unsigned** (penting!)
   - **Folder**: `gerobak-jogja/products`
   - **Unique filename**: ✅ (centang)
   - **Overwrite**: ❌ (jangan centang)
6. Klik **"Save"**

### 4. Update Code

Buka file `src/components/ImageUpload.jsx` dan update:

```javascript
// Line 4-5
const CLOUDINARY_UPLOAD_PRESET = 'gerobak_jogja'; // Preset name dari step 3
const CLOUDINARY_CLOUD_NAME = 'demo123456'; // Cloud name dari step 2
```

**Ganti `demo123456` dengan Cloud Name kamu!**

### 5. Test Upload

1. Restart dev server (Ctrl+C lalu `npm run dev`)
2. Buka Admin panel (`/admin`)
3. Klik "Tambah Produk"
4. Upload gambar
5. Seharusnya berhasil! ✅

## 🔍 Cek Upload di Cloudinary

1. Buka Cloudinary Dashboard
2. Klik **"Media Library"** di sidebar
3. Lihat folder `gerobak-jogja/products`
4. Semua gambar yang diupload akan muncul di sini

## 🎨 Fitur Cloudinary (Bonus)

### Auto Optimization

Cloudinary otomatis:
- Convert ke WebP (format modern, 30% lebih kecil)
- Compress gambar tanpa loss quality
- Lazy loading
- Responsive images

### Image Transformations

Kamu bisa transform gambar via URL:

```javascript
// Original
https://res.cloudinary.com/demo/image/upload/v1234/products/image.jpg

// Resize 800x600
https://res.cloudinary.com/demo/image/upload/w_800,h_600,c_fill/v1234/products/image.jpg

// Thumbnail 200x200
https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb/v1234/products/image.jpg

// Auto quality & format
https://res.cloudinary.com/demo/image/upload/q_auto,f_auto/v1234/products/image.jpg
```

### Watermark (Optional)

Tambah watermark otomatis:

1. Upload logo di Cloudinary
2. Di Upload Preset settings, tambah transformation:
   ```
   l_logo,g_south_east,x_10,y_10,w_100
   ```

## 📊 Monitor Usage

Di Cloudinary Dashboard:
- **Usage**: Lihat bandwidth & storage usage
- **Reports**: Analytics upload & transformations
- **Quota**: 25GB/bulan (reset setiap bulan)

Untuk website kecil-menengah, quota gratis sangat cukup!

## 🔐 Security Best Practices

### 1. Unsigned Upload (Current)
- ✅ Mudah setup
- ✅ Tidak perlu API secret di frontend
- ⚠️ Anyone bisa upload (tapi limited by preset)

### 2. Signed Upload (Production)
- ✅ Lebih aman
- ✅ Control penuh
- ⚠️ Perlu backend untuk generate signature

Untuk sekarang, unsigned upload sudah cukup aman karena:
- Upload preset limit folder & transformations
- Rate limiting by Cloudinary
- Hanya admin yang bisa akses form upload

## 🚀 Alternative: ImgBB (Jika Cloudinary Penuh)

Jika quota Cloudinary habis, bisa pakai ImgBB:

1. Daftar di https://imgbb.com/
2. Get API key (gratis unlimited)
3. Update `ImageUpload.jsx`:

```javascript
const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=YOUR_API_KEY`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.data.url;
};
```

## 💡 Tips

1. **Compress sebelum upload**: Gunakan TinyPNG.com untuk compress gambar
2. **Optimal size**: 1200x900 pixel untuk foto produk
3. **Format**: JPG untuk foto, PNG untuk logo/icon
4. **Naming**: Gunakan nama file yang descriptive
5. **Backup**: Download semua gambar dari Cloudinary secara berkala

## 🔧 Troubleshooting

### Error: "Upload preset not found"
- Cek preset name di Cloudinary settings
- Pastikan signing mode = "Unsigned"

### Error: "Invalid cloud name"
- Cek cloud name di dashboard
- Update di `ImageUpload.jsx`

### Error: "File too large"
- Max 5MB per file (free plan)
- Compress gambar dulu

### Upload lambat
- Compress gambar sebelum upload
- Cek koneksi internet

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Presets Guide](https://cloudinary.com/documentation/upload_presets)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

---

**Setup selesai! Sekarang kamu bisa upload gambar produk dengan mudah! 🎉**

Jika ada pertanyaan, silakan hubungi developer.
