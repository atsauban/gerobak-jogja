# 🚀 Quick Setup: Cloudinary Auto-Delete

## TL;DR

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Buat file .env
cp .env.example .env
# Edit .env, isi CLOUDINARY_API_KEY dan CLOUDINARY_API_SECRET

# 3. Run dengan Netlify Dev
cd gerobak-jogja
netlify dev

# 4. Test delete gambar di admin
# Buka: http://localhost:8888
```

## Dapatkan Cloudinary Credentials

### Step 1: Login ke Cloudinary
https://console.cloudinary.com/

### Step 2: Copy Credentials
Di Dashboard, copy:
- **API Key** (contoh: 123456789012345)
- **API Secret** (contoh: abcdefghijklmnopqrstuvwxyz)

### Step 3: Paste ke .env

Edit file `.env`:

```env
CLOUDINARY_CLOUD_NAME=dpjpj7l1y
CLOUDINARY_API_KEY=paste_api_key_disini
CLOUDINARY_API_SECRET=paste_api_secret_disini
```

## Test di Local

```bash
# Jalankan dengan Netlify Dev
netlify dev
```

Netlify Dev akan start di: http://localhost:8888

**Jangan pakai `npm run dev`!** Harus pakai `netlify dev` agar Functions jalan.

## Deploy ke Production

### Step 1: Set Environment Variables di Netlify

1. Buka: https://app.netlify.com/
2. Pilih site "gerobak-jogja"
3. **Site settings → Environment variables → Add a variable**
4. Tambahkan 3 variables:

```
Name: CLOUDINARY_CLOUD_NAME
Value: dpjpj7l1y

Name: CLOUDINARY_API_KEY
Value: [paste dari Cloudinary dashboard]

Name: CLOUDINARY_API_SECRET
Value: [paste dari Cloudinary dashboard]
```

### Step 2: Deploy

```bash
git add .
git commit -m "Setup Cloudinary auto-delete"
git push
```

Netlify akan auto-deploy.

### Step 3: Test

1. Buka website production
2. Login admin
3. Hapus gambar
4. Cek console: `✅ Deleted from Cloudinary`

## Verifikasi Berhasil

✅ **Console log:**
```
🗑️ Deleting from Cloudinary: gerobak-jogja/gallery/1234567890_image
✅ Deleted from Cloudinary: Image deleted successfully
```

✅ **Cloudinary dashboard:**
- Gambar hilang dari Media Library

✅ **Website:**
- Gambar tidak tampil lagi

## Troubleshooting

### "Failed to delete from Cloudinary"

**Cek:**
1. Environment variables sudah di-set?
2. API credentials benar?
3. Restart `netlify dev`

### Function tidak jalan

**Solusi:**
```bash
# Pastikan pakai netlify dev
netlify dev

# Bukan npm run dev!
```

### Masih bingung?

Baca dokumentasi lengkap: `CLOUDINARY_AUTO_DELETE.md`

---

**Need help?** Check Netlify Function logs di dashboard.
