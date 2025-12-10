# 🔧 Vercel Environment Variables Setup

## 🎯 Quick Fix for Cloudinary Error

**Error yang kamu lihat:**
```
Error deleting from Cloudinary: Must supply cloud_name
```

**Penyebab:** Environment variables Cloudinary belum di-set di Vercel dashboard.

## 🚀 Cara Setting Environment Variables

### **Step 1: Buka Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Pilih project "gerobakjogja" 
3. Klik tab **"Settings"**
4. Klik **"Environment Variables"** di sidebar

### **Step 2: Add Variables**
Tambahkan 3 environment variables ini:

#### **Variable 1:**
- **Name:** `VITE_CLOUDINARY_CLOUD_NAME`
- **Value:** `dpjpj7l1y` (dari Cloudinary dashboard kamu)
- **Environment:** Production, Preview, Development

#### **Variable 2:**
- **Name:** `CLOUDINARY_API_KEY`
- **Value:** `your-api-key` (dari Cloudinary dashboard)
- **Environment:** Production, Preview, Development

#### **Variable 3:**
- **Name:** `CLOUDINARY_API_SECRET`
- **Value:** `your-api-secret` (dari Cloudinary dashboard)
- **Environment:** Production, Preview, Development

### **Step 3: Redeploy**
Setelah add variables:
1. Klik **"Redeploy"** di Vercel dashboard
2. Atau push commit baru ke GitHub

## 🔍 Cara Cari Cloudinary Credentials

### **Cloudinary Dashboard:**
1. Login ke [cloudinary.com](https://cloudinary.com)
2. Go to **Dashboard**
3. Copy values:
   - **Cloud Name:** `dpjpj7l1y`
   - **API Key:** (angka panjang)
   - **API Secret:** (string panjang, klik "reveal" untuk lihat)

## 🧪 Test Setelah Setup

### **Di Admin Panel:**
1. Klik **"Test Cloudinary"** button
2. Should show: `✅ Cloudinary working on vercel!`

### **Test Delete Image:**
1. Upload image baru
2. Delete image
3. Should work without error

## 📋 Expected Console Output

### **Before (Error):**
```
❌ Vercel Cloudinary delete failed: Must supply cloud_name
💡 Fix: Set VITE_CLOUDINARY_CLOUD_NAME in Vercel dashboard
```

### **After (Success):**
```
🔧 Using Vercel function for Cloudinary delete
📡 Function URL: /api/cloudinary-delete
✅ Vercel Cloudinary delete successful: { success: true, ... }
```

## 💡 Troubleshooting

### **Still Getting Errors?**

1. **Check Variable Names:** Pastikan exact spelling
2. **Check All Environments:** Set untuk Production, Preview, Development
3. **Redeploy:** Environment variables butuh redeploy
4. **Wait 2-3 Minutes:** Deployment butuh waktu

### **Test Commands:**
```bash
# Test Cloudinary config
curl https://gerobakjogja.vercel.app/api/test-cloudinary

# Should return success: true
```

## ✅ Quick Checklist

- [ ] Add `VITE_CLOUDINARY_CLOUD_NAME`
- [ ] Add `CLOUDINARY_API_KEY` 
- [ ] Add `CLOUDINARY_API_SECRET`
- [ ] Set for all environments (Production, Preview, Development)
- [ ] Redeploy site
- [ ] Test with "Test Cloudinary" button
- [ ] Test image delete functionality

Setelah setup ini, Cloudinary auto-delete akan jalan sempurna di Vercel! 🎉