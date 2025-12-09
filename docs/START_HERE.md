# 🚀 START HERE: Cloudinary Auto-Delete

## ✅ Implementation Complete!

Gambar akan **otomatis terhapus dari Cloudinary** saat dihapus di admin panel.

---

## 📋 Quick Setup (5 menit)

### Step 1: Dapatkan Cloudinary Credentials

1. Buka: https://console.cloudinary.com/
2. Login dengan akun kamu
3. Di **Dashboard**, copy:
   - **API Key** (angka panjang)
   - **API Secret** (huruf & angka)

### Step 2: Buat File .env

```bash
# Di folder gerobak-jogja, copy template
cp .env.example .env
```

### Step 3: Edit File .env

Buka file `.env` dan isi:

```env
CLOUDINARY_CLOUD_NAME=dpjpj7l1y
CLOUDINARY_API_KEY=paste_api_key_disini
CLOUDINARY_API_SECRET=paste_api_secret_disini
```

### Step 4: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 5: Run!

```bash
npm run dev:netlify
```

Buka: **http://localhost:8888** (bukan 5173!)

---

## 🧪 Test Delete

1. Login ke admin: http://localhost:8888/admin
2. Scroll ke **"Kelola Galeri"**
3. Upload gambar baru
4. Hapus gambar
5. Cek console (F12) - harus muncul:
   ```
   ✅ Deleted from Cloudinary: Image deleted successfully
   ```
6. Verifikasi di Cloudinary dashboard - gambar harus hilang

---

## 🌐 Deploy ke Production

### Step 1: Set Environment Variables di Netlify

1. Buka: https://app.netlify.com/
2. Pilih site "gerobak-jogja"
3. **Site settings → Environment variables**
4. Add 3 variables:
   - `CLOUDINARY_CLOUD_NAME` = `dpjpj7l1y`
   - `CLOUDINARY_API_KEY` = (paste dari Cloudinary)
   - `CLOUDINARY_API_SECRET` = (paste dari Cloudinary)

### Step 2: Deploy

```bash
git add .
git commit -m "Setup Cloudinary auto-delete"
git push
```

Netlify akan auto-deploy!

### Step 3: Test Production

1. Buka website production
2. Login admin
3. Hapus gambar
4. Cek console - harus muncul: `✅ Deleted from Cloudinary`

---

## ⚠️ Important

- **Jangan pakai `npm run dev`** untuk test delete!
- **Harus pakai `npm run dev:netlify`** agar Functions jalan
- **Jangan commit file `.env`** ke Git (sudah di `.gitignore`)

---

## 📚 Need More Help?

- **Quick Setup:** `SETUP_CLOUDINARY_DELETE.md`
- **Full Guide:** `CLOUDINARY_AUTO_DELETE.md`
- **Summary:** `IMPLEMENTATION_SUMMARY.md`

---

## ✅ Checklist

- [ ] Dapatkan Cloudinary API Key & Secret
- [ ] Buat file `.env`
- [ ] Install Netlify CLI
- [ ] Run `npm run dev:netlify`
- [ ] Test delete gambar
- [ ] Set Netlify environment variables
- [ ] Deploy ke production
- [ ] Test di production

---

**Status:** Ready to use! 🎉

**Next:** Setup `.env` file dan test!
