# ✅ Cloudinary Auto-Delete Setup

## Status: READY TO USE! 🚀

Auto-delete Cloudinary sudah diimplementasi menggunakan Netlify Functions.

## Cara Kerja

Ketika admin menghapus gambar:

1. **Frontend** memanggil `deleteImageFromCloudinary(imageUrl)`
2. **Netlify Function** menerima request dan menghapus dari Cloudinary
3. **Frontend** menghapus data dari Firebase
4. **Selesai!** Gambar terhapus dari Cloudinary dan Firebase

## Setup untuk Development (Local)

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Dapatkan Cloudinary API Credentials

1. Login ke Cloudinary: https://console.cloudinary.com/
2. Buka Dashboard
3. Copy credentials:
   - Cloud Name: `dpjpj7l1y` (sudah ada)
   - API Key: (copy dari dashboard)
   - API Secret: (copy dari dashboard)

### 3. Buat File .env

Buat file `.env` di root folder `gerobak-jogja/`:

```env
# Cloudinary API Credentials
CLOUDINARY_CLOUD_NAME=dpjpj7l1y
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**PENTING:** Jangan commit file `.env` ke Git! (sudah ada di `.gitignore`)

### 4. Test di Local

```bash
cd gerobak-jogja

# Jalankan dengan Netlify Dev (akan load .env otomatis)
netlify dev
```

Netlify Dev akan:
- Menjalankan Vite dev server
- Menjalankan Netlify Functions
- Load environment variables dari `.env`

### 5. Test Delete

1. Buka http://localhost:8888 (bukan 5173!)
2. Login ke admin
3. Hapus gambar di galeri
4. Cek console - harus muncul: `✅ Deleted from Cloudinary`
5. Verifikasi di Cloudinary dashboard - gambar harus hilang

## Setup untuk Production (Netlify)

### 1. Push ke Git

```bash
git add .
git commit -m "Add Cloudinary auto-delete"
git push
```

### 2. Set Environment Variables di Netlify

1. Buka Netlify Dashboard
2. Pilih site "gerobak-jogja"
3. Go to: **Site settings → Environment variables**
4. Add variables:

```
CLOUDINARY_CLOUD_NAME = dpjpj7l1y
CLOUDINARY_API_KEY = your_api_key_here
CLOUDINARY_API_SECRET = your_api_secret_here
```

### 3. Deploy

Netlify akan auto-deploy setelah push ke Git.

### 4. Test di Production

1. Buka website production
2. Login ke admin
3. Hapus gambar
4. Cek console - harus muncul: `✅ Deleted from Cloudinary`

## Troubleshooting

### Error: "Failed to delete from Cloudinary"

**Kemungkinan:**
1. Environment variables belum di-set
2. API credentials salah
3. Network error

**Solusi:**
1. Cek Netlify environment variables
2. Verifikasi API credentials di Cloudinary dashboard
3. Cek Netlify Function logs

### Error: "Invalid Cloudinary URL"

**Kemungkinan:**
- URL bukan dari Cloudinary
- URL format tidak sesuai

**Solusi:**
- Pastikan gambar di-upload via ImageUpload component
- Cek URL format: `https://res.cloudinary.com/...`

### Function tidak jalan di local

**Solusi:**
```bash
# Pastikan pakai netlify dev, bukan npm run dev
netlify dev

# Atau install ulang Netlify CLI
npm install -g netlify-cli
```

### Environment variables tidak terbaca

**Solusi:**
1. Pastikan file `.env` ada di root folder `gerobak-jogja/`
2. Restart `netlify dev`
3. Cek format `.env` (tidak ada spasi di sekitar `=`)

## File Structure

```
gerobak-jogja/
├── netlify/
│   └── functions/
│       └── cloudinary-delete.js    # Netlify Function
├── src/
│   └── services/
│       └── firebaseService.js      # Updated with auto-delete
├── .env                             # Local env vars (jangan commit!)
├── .env.example                     # Template env vars
├── netlify.toml                     # Netlify config
└── package.json                     # Added cloudinary package
```

## Testing Checklist

- [ ] Install dependencies: `npm install`
- [ ] Setup `.env` file dengan Cloudinary credentials
- [ ] Run `netlify dev`
- [ ] Upload gambar baru di admin
- [ ] Hapus gambar
- [ ] Cek console: `✅ Deleted from Cloudinary`
- [ ] Verifikasi di Cloudinary dashboard (gambar hilang)
- [ ] Verifikasi di Firebase (data hilang)
- [ ] Verifikasi di website (gambar tidak tampil)

## Cloudinary Dashboard

- **Media Library:** https://console.cloudinary.com/console/dpjpj7l1y/media_library
- **API Keys:** https://console.cloudinary.com/console/dpjpj7l1y/settings/api-keys
- **Usage:** https://console.cloudinary.com/console/dpjpj7l1y/settings/usage

## Security Notes

✅ **Aman:**
- API Secret tidak exposed di frontend
- API Secret hanya ada di Netlify Functions (server-side)
- Environment variables di-encrypt oleh Netlify

❌ **Jangan:**
- Commit file `.env` ke Git
- Hardcode API Secret di code
- Share API credentials

## FAQ

**Q: Apakah harus pakai Netlify?**
A: Ya, karena menggunakan Netlify Functions. Alternatif: Vercel Functions atau backend sendiri.

**Q: Berapa biaya Netlify Functions?**
A: Free tier: 125,000 requests/month. Cukup untuk ribuan delete operations.

**Q: Apa yang terjadi jika function gagal?**
A: Gambar tetap terhapus dari Firebase, tapi masih ada di Cloudinary. Bisa delete manual.

**Q: Bisa test tanpa deploy?**
A: Bisa! Pakai `netlify dev` untuk test di local.

**Q: Bagaimana cara lihat logs?**
A: Netlify Dashboard → Functions → cloudinary-delete → View logs

## Next Steps

1. ✅ Setup `.env` file
2. ✅ Test di local dengan `netlify dev`
3. ✅ Set environment variables di Netlify
4. ✅ Deploy dan test di production
5. ✅ Monitor usage di Cloudinary dashboard

---

**Status:** Ready to use! Just need to setup environment variables. 🎉
