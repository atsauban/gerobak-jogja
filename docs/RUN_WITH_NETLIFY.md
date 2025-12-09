# 🚀 Run with Netlify Functions (Development)

## Cara Menjalankan

Kamu perlu **2 terminal** untuk menjalankan Vite dan Netlify Dev bersamaan.

### Terminal 1: Vite Dev Server

```bash
cd gerobak-jogja
npm run dev:vite
```

Ini akan start Vite di **http://localhost:5173**

### Terminal 2: Netlify Dev

```bash
cd gerobak-jogja
netlify dev
```

Ini akan start Netlify Dev di **http://localhost:8888** dan proxy ke Vite.

## Akses Website

**Buka:** http://localhost:8888

Jangan buka http://localhost:5173 - harus pakai 8888 agar Netlify Functions jalan!

## Test Auto-Delete

1. Buka: http://localhost:8888/admin
2. Login
3. Scroll ke "Kelola Galeri"
4. Hapus gambar
5. Cek console - harus muncul: `✅ Deleted from Cloudinary`

## Troubleshooting

### Port 5173 sudah dipakai

```bash
# Stop semua process Node
taskkill /F /IM node.exe

# Atau ganti port di vite.config.js
```

### Port 8888 sudah dipakai

```bash
# Netlify Dev akan otomatis pakai port lain (8889, 8890, dst)
```

### Function tidak jalan

Pastikan:
1. File `.env` atau `.env.development` ada
2. Cloudinary credentials sudah diisi
3. Restart kedua terminal

## Alternative: Run Tanpa Netlify Dev

Kalau Netlify Dev bermasalah, bisa pakai Vite biasa:

```bash
npm run dev
```

Buka: http://localhost:5173

Auto-delete tidak akan jalan (manual delete), tapi semua fitur lain jalan normal.

---

**Production:** Auto-delete akan jalan sempurna di Netlify production tanpa perlu setup apapun!
