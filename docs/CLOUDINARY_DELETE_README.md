# 🗑️ Cloudinary Auto-Delete

## ✅ Status: IMPLEMENTED

Gambar akan otomatis terhapus dari Cloudinary saat dihapus di admin panel.

## 🚀 Quick Start

### Development (Local)

```bash
# 1. Setup environment variables
cp .env.example .env
# Edit .env, isi CLOUDINARY_API_KEY dan CLOUDINARY_API_SECRET

# 2. Install Netlify CLI (sekali saja)
npm install -g netlify-cli

# 3. Run dengan Netlify Dev
npm run dev:netlify
# atau: netlify dev

# 4. Buka http://localhost:8888 (bukan 5173!)
```

### Production (Netlify)

1. **Set environment variables** di Netlify Dashboard:
   - `CLOUDINARY_CLOUD_NAME` = `dpjpj7l1y`
   - `CLOUDINARY_API_KEY` = (dari Cloudinary dashboard)
   - `CLOUDINARY_API_SECRET` = (dari Cloudinary dashboard)

2. **Deploy:**
   ```bash
   git push
   ```

## 📋 Cara Dapatkan Cloudinary Credentials

1. Login: https://console.cloudinary.com/
2. Dashboard → Copy **API Key** dan **API Secret**
3. Paste ke `.env` (local) atau Netlify environment variables (production)

## 🔍 Cara Kerja

```
Admin hapus gambar
    ↓
Frontend extract public_id dari URL
    ↓
Call Netlify Function: /.netlify/functions/cloudinary-delete
    ↓
Function call Cloudinary API dengan API Secret
    ↓
Cloudinary delete gambar
    ↓
Frontend delete data dari Firebase
    ↓
Done! ✅
```

## 📁 Files

- `netlify/functions/cloudinary-delete.js` - Netlify Function
- `src/services/firebaseService.js` - Frontend delete handler
- `netlify.toml` - Netlify config
- `.env` - Local environment variables (jangan commit!)

## 🧪 Testing

```bash
# 1. Run local
npm run dev:netlify

# 2. Buka admin: http://localhost:8888/admin

# 3. Upload gambar baru

# 4. Hapus gambar

# 5. Cek console:
# ✅ Harus muncul: "Deleted from Cloudinary: Image deleted successfully"

# 6. Verifikasi di Cloudinary dashboard
# Gambar harus hilang dari Media Library
```

## ⚠️ Important Notes

- **Jangan pakai `npm run dev`** untuk test delete! Harus pakai `npm run dev:netlify`
- **Jangan commit `.env`** ke Git (sudah ada di `.gitignore`)
- **API Secret** hanya ada di server-side (Netlify Functions), tidak exposed di frontend

## 📚 Documentation

- **Quick Setup:** `SETUP_CLOUDINARY_DELETE.md`
- **Full Guide:** `CLOUDINARY_AUTO_DELETE.md`
- **Old Manual Method:** `CLOUDINARY_DELETE_SETUP.md`

## 🆘 Troubleshooting

### Error: "Failed to delete from Cloudinary"

1. Cek environment variables sudah di-set
2. Verifikasi API credentials benar
3. Restart `netlify dev`
4. Cek Netlify Function logs

### Function tidak jalan di local

```bash
# Pastikan pakai netlify dev
netlify dev

# Atau
npm run dev:netlify
```

### Environment variables tidak terbaca

1. Pastikan file `.env` ada di root `gerobak-jogja/`
2. Format benar (tidak ada spasi di sekitar `=`)
3. Restart `netlify dev`

## 💰 Costs

- **Netlify Functions:** Free tier 125,000 requests/month
- **Cloudinary:** Free tier 25GB storage, 25GB bandwidth/month
- **Total:** $0 untuk usage normal

## ✅ Checklist

- [x] Install cloudinary package
- [x] Create Netlify Function
- [x] Update firebaseService.js
- [x] Update netlify.toml
- [x] Add environment variables template
- [ ] Setup `.env` file (you need to do this)
- [ ] Set Netlify environment variables (for production)
- [ ] Test delete functionality

---

**Ready to use!** Just setup environment variables and test. 🎉
