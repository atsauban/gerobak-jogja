# 🔧 Troubleshooting: Cloudinary Auto-Delete

## Common Issues & Solutions

### 1. "Failed to delete from Cloudinary"

**Symptoms:**
- Console shows: `❌ Error deleting from Cloudinary`
- Gambar terhapus dari website tapi masih ada di Cloudinary

**Possible Causes:**
- Environment variables tidak di-set
- API credentials salah
- Netlify Function tidak jalan

**Solutions:**

#### A. Check Environment Variables

**Local (.env file):**
```bash
# Cek apakah file .env ada
ls -la .env

# Cek isi file
cat .env
```

Harus ada:
```env
CLOUDINARY_CLOUD_NAME=dpjpj7l1y
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

**Production (Netlify):**
1. Buka Netlify Dashboard
2. Site settings → Environment variables
3. Pastikan ada 3 variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

#### B. Verify API Credentials

1. Login: https://console.cloudinary.com/
2. Dashboard → Copy API Key & Secret
3. Bandingkan dengan yang di `.env` atau Netlify
4. Jika beda, update dan restart

#### C. Restart Development Server

```bash
# Stop server (Ctrl+C)
# Start ulang
npm run dev:netlify
```

---

### 2. Netlify Function Tidak Jalan

**Symptoms:**
- Console shows: `Failed to fetch`
- Error 404 saat call `/.netlify/functions/cloudinary-delete`

**Solutions:**

#### A. Pastikan Pakai Netlify Dev

❌ **SALAH:**
```bash
npm run dev  # Ini tidak jalan Functions!
```

✅ **BENAR:**
```bash
npm run dev:netlify  # Ini jalan Functions
# atau
netlify dev
```

#### B. Install Netlify CLI

```bash
# Check apakah sudah install
netlify --version

# Jika belum, install
npm install -g netlify-cli
```

#### C. Check Port

Netlify Dev jalan di port **8888**, bukan 5173!

- ✅ Buka: http://localhost:8888
- ❌ Jangan: http://localhost:5173

---

### 3. Environment Variables Tidak Terbaca

**Symptoms:**
- Function jalan tapi error: "API credentials missing"
- Console shows: `undefined` untuk API Key/Secret

**Solutions:**

#### A. Check File Location

File `.env` harus di root folder `gerobak-jogja/`:

```
gerobak-jogja/
├── .env          ← Harus disini!
├── package.json
├── netlify/
└── src/
```

#### B. Check File Format

Format harus benar (tidak ada spasi):

✅ **BENAR:**
```env
CLOUDINARY_API_KEY=123456789
```

❌ **SALAH:**
```env
CLOUDINARY_API_KEY = 123456789  # Ada spasi!
CLOUDINARY_API_KEY="123456789"  # Ada quotes!
```

#### C. Restart Server

Setelah edit `.env`, **harus restart**:

```bash
# Stop (Ctrl+C)
npm run dev:netlify
```

---

### 4. "Invalid Cloudinary URL"

**Symptoms:**
- Error: "Invalid Cloudinary URL format"
- Delete tidak jalan

**Causes:**
- URL bukan dari Cloudinary
- URL format tidak sesuai

**Solutions:**

#### A. Check URL Format

URL harus seperti ini:
```
https://res.cloudinary.com/dpjpj7l1y/image/upload/v1234567890/gerobak-jogja/gallery/image.jpg
```

#### B. Re-upload Image

1. Hapus gambar lama
2. Upload ulang via admin panel
3. Pastikan upload via ImageUpload component

---

### 5. Gambar Tidak Terhapus dari Cloudinary

**Symptoms:**
- Console shows: `✅ Deleted from Cloudinary`
- Tapi gambar masih ada di Cloudinary dashboard

**Solutions:**

#### A. Refresh Cloudinary Dashboard

1. Buka: https://console.cloudinary.com/
2. Media Library
3. Hard refresh (Ctrl+Shift+R)

#### B. Check Public ID

Console log harus show public ID yang benar:
```
🗑️ Deleting from Cloudinary: gerobak-jogja/gallery/1234567890_image
```

Cari manual di Cloudinary dengan public ID tersebut.

#### C. Check Cloudinary Response

Buka Netlify Function logs:
1. Netlify Dashboard
2. Functions → cloudinary-delete
3. View logs
4. Cek response dari Cloudinary API

---

### 6. CORS Error

**Symptoms:**
- Console shows: "CORS policy blocked"
- Network tab shows CORS error

**Solutions:**

#### A. Check Function Headers

File `netlify/functions/cloudinary-delete.js` harus ada:

```javascript
headers: {
  'Access-Control-Allow-Origin': '*'
}
```

#### B. Redeploy

```bash
git add .
git commit -m "Fix CORS"
git push
```

---

### 7. Rate Limit / Quota Exceeded

**Symptoms:**
- Error: "Rate limit exceeded"
- Error: "Quota exceeded"

**Solutions:**

#### A. Check Cloudinary Usage

1. Buka: https://console.cloudinary.com/
2. Settings → Usage
3. Cek apakah sudah melebihi free tier

**Free Tier Limits:**
- Storage: 25GB
- Bandwidth: 25GB/month
- Transformations: 25,000/month

#### B. Upgrade Plan

Jika perlu, upgrade ke paid plan.

---

### 8. Function Timeout

**Symptoms:**
- Error: "Function timeout"
- Delete sangat lama

**Solutions:**

#### A. Check Network

Pastikan internet stabil.

#### B. Check Cloudinary Status

Buka: https://status.cloudinary.com/

#### C. Increase Timeout (Production)

Di `netlify.toml`:

```toml
[functions]
  timeout = 30  # Default 10 seconds
```

---

## Debug Checklist

Jika masih error, cek satu per satu:

- [ ] File `.env` ada dan isi benar
- [ ] Pakai `npm run dev:netlify` (bukan `npm run dev`)
- [ ] Buka http://localhost:8888 (bukan 5173)
- [ ] Netlify CLI sudah install
- [ ] API credentials benar (copy dari Cloudinary dashboard)
- [ ] Restart server setelah edit `.env`
- [ ] Check console untuk error messages
- [ ] Check Network tab untuk failed requests
- [ ] Check Netlify Function logs (production)

---

## Still Not Working?

### Check Logs

**Local:**
```bash
# Terminal akan show logs dari Netlify Function
# Cek error messages
```

**Production:**
1. Netlify Dashboard
2. Functions → cloudinary-delete
3. View logs
4. Cari error messages

### Manual Delete (Fallback)

Jika auto-delete tidak jalan, bisa delete manual:

1. Console log akan show Public ID
2. Copy Public ID
3. Buka Cloudinary dashboard
4. Media Library → Search
5. Paste Public ID
6. Delete manual

---

## Get Help

- **Netlify Functions Docs:** https://docs.netlify.com/functions/overview/
- **Cloudinary API Docs:** https://cloudinary.com/documentation/admin_api
- **Netlify Support:** https://answers.netlify.com/

---

**Last Updated:** December 9, 2025
