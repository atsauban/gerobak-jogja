# 🗑️ Setup Cloudinary Delete

## Status Saat Ini

✅ **Frontend sudah siap** - Saat hapus gambar di admin, akan:
1. Menampilkan warning di console dengan Public ID gambar
2. Menghapus data dari Firebase
3. Memberikan link ke Cloudinary dashboard untuk delete manual

⚠️ **Backend belum ada** - Cloudinary delete memerlukan API Secret yang tidak boleh di frontend

## Cara Kerja Saat Ini

Ketika admin menghapus gambar:

```javascript
// 1. Cari gambar yang akan dihapus
const image = images.find(img => img.id === id);

// 2. Hapus dari Cloudinary (saat ini hanya log warning)
await deleteImageFromCloudinary(image.url);
// Output: ⚠️ Public ID: gerobak-jogja/gallery/1234567890_image.jpg

// 3. Hapus dari Firebase (berhasil)
await deleteGalleryImage(id);
```

## Opsi Solusi

### Opsi 1: Delete Manual (Saat Ini) ✅

**Cara:**
1. Hapus gambar di admin panel
2. Lihat console browser (F12)
3. Copy Public ID yang muncul
4. Buka Cloudinary Dashboard
5. Cari dan hapus gambar manual

**Kelebihan:**
- Tidak perlu backend
- Aman (API secret tidak exposed)

**Kekurangan:**
- Harus manual
- Gambar tetap di Cloudinary (tapi tidak masalah, Cloudinary free tier 25GB)

### Opsi 2: Backend API (Recommended) 🚀

Buat backend endpoint untuk delete Cloudinary image.

#### A. Menggunakan Netlify Functions

**File:** `netlify/functions/cloudinary-delete.js`

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { publicId } = JSON.parse(event.body);

    if (!publicId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Public ID required' })
      };
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        result 
      })
    };
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to delete image',
        details: error.message 
      })
    };
  }
};
```

**Setup:**

1. Install Cloudinary SDK:
```bash
cd gerobak-jogja
npm install cloudinary
```

2. Tambahkan environment variables di Netlify:
```
CLOUDINARY_CLOUD_NAME=dpjpj7l1y
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Update `firebaseService.js`:
```javascript
export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');

    const response = await fetch('/.netlify/functions/cloudinary-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      throw new Error('Failed to delete from Cloudinary');
    }

    console.log('✅ Deleted from Cloudinary:', publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};
```

#### B. Menggunakan Vercel Functions

**File:** `api/cloudinary-delete.js`

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: 'Public ID required' });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to delete',
      details: error.message 
    });
  }
}
```

**Setup:**
1. Install: `npm install cloudinary`
2. Add env vars in Vercel dashboard
3. Update frontend code (sama seperti Netlify)

### Opsi 3: Cloudinary Auto-Delete (Advanced) 🔧

Setup lifecycle policy di Cloudinary untuk auto-delete unused images.

**Cara:**
1. Buka Cloudinary Dashboard
2. Settings → Upload → Upload presets
3. Enable "Auto-tagging"
4. Setup lifecycle rules untuk delete images dengan tag tertentu

## Rekomendasi

### Untuk Development/Testing:
✅ **Gunakan Opsi 1 (Manual Delete)**
- Cukup untuk testing
- Tidak perlu setup backend
- Cloudinary free tier cukup besar (25GB)

### Untuk Production:
🚀 **Gunakan Opsi 2 (Backend API)**
- Lebih profesional
- User experience lebih baik
- Otomatis cleanup

## Cara Implementasi Backend (Step by Step)

### 1. Install Dependencies
```bash
cd gerobak-jogja
npm install cloudinary
```

### 2. Buat Netlify Function
```bash
mkdir -p netlify/functions
```

Copy code dari Opsi 2A ke `netlify/functions/cloudinary-delete.js`

### 3. Update netlify.toml
```toml
[build]
  functions = "netlify/functions"
```

### 4. Set Environment Variables

Di Netlify Dashboard:
- Site settings → Environment variables
- Add:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

### 5. Update Frontend Code

Uncomment code di `firebaseService.js`:

```javascript
export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // ... extract publicId ...
    
    const response = await fetch('/.netlify/functions/cloudinary-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      throw new Error('Failed to delete');
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};
```

### 6. Test

1. Deploy ke Netlify
2. Hapus gambar di admin
3. Cek console - harus muncul: `✅ Deleted from Cloudinary`
4. Verifikasi di Cloudinary dashboard

## FAQ

**Q: Apakah wajib setup backend?**
A: Tidak wajib. Untuk development/testing, manual delete sudah cukup.

**Q: Berapa biaya Cloudinary?**
A: Free tier: 25GB storage, 25GB bandwidth/month. Cukup untuk ratusan gambar.

**Q: Apa yang terjadi jika tidak delete dari Cloudinary?**
A: Gambar tetap di Cloudinary tapi tidak tampil di website (karena sudah dihapus dari Firebase). Tidak masalah, tapi storage terpakai.

**Q: Bisa pakai Firebase Storage saja?**
A: Bisa, tapi Cloudinary lebih baik karena:
- Auto image optimization
- Auto format conversion (WebP)
- CDN global
- Image transformation on-the-fly

## Status Implementation

- [x] Frontend delete handler
- [x] Firebase delete
- [x] Cloudinary delete warning/log
- [ ] Backend API endpoint (optional)
- [ ] Auto-delete lifecycle (optional)

---

**Current Status:** Manual delete via console log (working, good enough for now)

**Next Step:** Implement backend API when needed for production
