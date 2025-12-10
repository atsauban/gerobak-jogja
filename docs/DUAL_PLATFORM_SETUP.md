# 🚀 Dual Platform Setup: Vercel + Netlify

## 📋 Overview

Proyek ini dikonfigurasi untuk bisa deploy di **Vercel** (production) dan **Netlify** (development/testing), dengan sitemap functions yang kompatibel di kedua platform.

## 🎯 Current Setup

### **Production: Vercel**
- 🌐 **URL:** https://gerobakjogja.vercel.app
- 📁 **Function:** `api/regenerate-sitemap.js` (Vercel Function)
- ⚙️ **Config:** `vercel.json`
- 🔧 **Development:** `npm run dev` atau `netlify dev`

### **Alternative: Netlify**
- 📁 **Function:** `netlify/functions/regenerate-sitemap.mjs` (Netlify Function)
- ⚙️ **Config:** `netlify.toml`
- 🔧 **Development:** `netlify dev`

## 🛠️ Development Commands

### **Option 1: Standard Vite Development**
```bash
npm run dev
# - Runs on http://localhost:5173
# - No functions available
# - Good for UI development
```

### **Option 2: Netlify Development (Recommended)**
```bash
netlify dev
# - Runs on http://localhost:8888
# - Netlify Functions available
# - Good for testing functions
```

### **Option 3: Specific Commands**
```bash
npm run dev:vite      # Pure Vite development
npm run dev:netlify   # Netlify development with functions
```

## 🔄 How Sitemap Functions Work

### **Automatic Platform Detection:**
```javascript
const isVercel = window.location.hostname.includes('vercel.app');
const functionUrl = isVercel 
  ? '/api/regenerate-sitemap'              // Vercel
  : '/.netlify/functions/regenerate-sitemap'; // Netlify
```

### **Function Endpoints:**

#### **Vercel Production:**
- **URL:** `https://gerobakjogja.vercel.app/api/regenerate-sitemap`
- **File:** `api/regenerate-sitemap.js`
- **Format:** Vercel Function (export default)

#### **Netlify Development:**
- **URL:** `http://localhost:8888/.netlify/functions/regenerate-sitemap`
- **File:** `netlify/functions/regenerate-sitemap.mjs`
- **Format:** Netlify Function (export handler)

## 📦 File Structure

```
project/
├── api/                          # Vercel Functions
│   └── regenerate-sitemap.js     # Vercel sitemap function
├── netlify/
│   └── functions/                # Netlify Functions
│       └── regenerate-sitemap.mjs # Netlify sitemap function
├── vercel.json                   # Vercel configuration
├── netlify.toml                  # Netlify configuration
└── src/
    └── services/
        └── sitemapService.js     # Platform detection logic
```

## 🎯 Why This Setup?

### **Benefits:**
1. **Flexibility:** Can deploy to either platform
2. **Development:** Test functions locally with Netlify
3. **Production:** Use Vercel's fast global CDN
4. **Backup:** Easy to switch platforms if needed

### **Use Cases:**
- **Vercel:** Fast static site deployment, good CDN
- **Netlify:** Great for testing functions, form handling
- **Development:** Netlify dev server for function testing

## 🔧 Configuration Details

### **Vercel Configuration (`vercel.json`):**
```json
{
  "functions": {
    "api/regenerate-sitemap.js": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/((?!sitemap\\.xml|robots\\.txt|images/|api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

### **Netlify Configuration (`netlify.toml`):**
```toml
[build]
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```

## 🚀 Deployment

### **Deploy to Vercel:**
```bash
# Connect to Vercel
vercel

# Deploy
vercel --prod
```

### **Deploy to Netlify:**
```bash
# Connect to Netlify
netlify init

# Deploy
netlify deploy --prod
```

## 🔍 Testing

### **Test Vercel Function (Production):**
```bash
curl -X POST https://gerobakjogja.vercel.app/api/regenerate-sitemap \
  -H "Content-Type: application/json" \
  -d '{"trigger":"manual"}'
```

### **Test Netlify Function (Development):**
```bash
# Start netlify dev first
netlify dev

# Then test
curl -X POST http://localhost:8888/.netlify/functions/regenerate-sitemap \
  -H "Content-Type: application/json" \
  -d '{"trigger":"manual"}'
```

## 💡 Best Practices

### **Development Workflow:**
1. Use `netlify dev` for development (functions available)
2. Test sitemap regeneration locally
3. Deploy to Vercel for production

### **Function Development:**
1. Develop in Netlify format first (easier testing)
2. Copy logic to Vercel format for production
3. Keep both functions in sync

### **Environment Variables:**
Make sure Firebase config is available in both platforms:
- Vercel: Set in Vercel dashboard
- Netlify: Set in Netlify dashboard or `.env`

## ✅ Current Status

- ✅ **Vercel Function:** Created and configured
- ✅ **Netlify Function:** Already exists
- ✅ **Platform Detection:** Automatic
- ✅ **Development:** Works with `netlify dev`
- ✅ **Production:** Should work on Vercel after deployment

Sekarang tinggal deploy ulang ke Vercel supaya Vercel Function bisa jalan!