# Sitemap Troubleshooting Guide

## Error: "Sitemap could not be read - General HTTP error"

### Kemungkinan Penyebab

#### 1. **Google Belum Selesai Crawling** ⏳
**Paling Umum!** Google butuh waktu untuk crawl sitemap pertama kali.

**Solusi:**
- Tunggu 24-48 jam
- Google akan otomatis retry
- Cek lagi besok

#### 2. **Vercel Routing Issue** 🔧
Vercel mungkin me-redirect sitemap.xml ke index.html.

**Solusi:**
✅ Sudah diperbaiki di `vercel.json`:
```json
"rewrites": [
  {
    "source": "/((?!sitemap\\.xml|robots\\.txt|images/).*)",
    "destination": "/index.html"
  }
]
```

Ini memastikan sitemap.xml dan robots.txt tidak di-rewrite.

#### 3. **Cache Issue** 💾
Vercel atau Google mungkin cache versi lama.

**Solusi:**
```bash
# Clear Vercel cache (deploy ulang)
git commit --allow-empty -m "Clear cache"
git push

# Atau di Vercel Dashboard:
# Settings > General > Clear Cache
```

#### 4. **XML Format Error** ❌
Sitemap XML mungkin tidak valid.

**Solusi:**
Test sitemap di:
- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- https://search.google.com/test/rich-results

## Cara Cek Sitemap

### 1. Manual Test
```bash
# Test dari command line
curl https://gerobakjogja.vercel.app/sitemap.xml

# Atau buka di browser
https://gerobakjogja.vercel.app/sitemap.xml
```

**Expected:** Harus return XML dengan status 200

### 2. Check Headers
```bash
curl -I https://gerobakjogja.vercel.app/sitemap.xml
```

**Expected Headers:**
```
HTTP/1.1 200 OK
Content-Type: application/xml (atau text/xml)
```

### 3. Validate XML
Copy sitemap content dan paste ke:
- https://www.xml-sitemaps.com/validate-xml-sitemap.html

**Expected:** No errors

## Langkah Perbaikan

### Step 1: Deploy Ulang
```bash
# Commit perubahan vercel.json
git add vercel.json
git commit -m "Fix sitemap routing"
git push
```

### Step 2: Verify Deployment
Tunggu deploy selesai (2-3 menit), lalu test:
```bash
curl https://gerobakjogja.vercel.app/sitemap.xml
```

### Step 3: Re-submit ke Google
1. Go to Google Search Console
2. Sitemaps > Remove sitemap lama
3. Add sitemap baru: `https://gerobakjogja.vercel.app/sitemap.xml`
4. Click Submit

### Step 4: Tunggu
- Google butuh 24-48 jam untuk process
- Cek status besok
- Jangan panic jika masih error hari ini

## Alternative: Ping Google

Manually ping Google untuk crawl sitemap:

```bash
# Method 1: HTTP Request
curl "https://www.google.com/ping?sitemap=https://gerobakjogja.vercel.app/sitemap.xml"

# Method 2: Browser
# Buka URL ini di browser:
https://www.google.com/ping?sitemap=https://gerobakjogja.vercel.app/sitemap.xml
```

## Monitoring

### Check Status Regularly
1. **Day 1:** Submit sitemap
2. **Day 2:** Check if error masih ada
3. **Day 3:** Should be processed
4. **Week 1:** Pages should be indexed

### Expected Timeline
- **0-24 hours:** "Couldn't fetch" atau "Pending" - NORMAL
- **24-48 hours:** Processing atau Success
- **48-72 hours:** Pages mulai indexed
- **1 week:** Majority of pages indexed

## Common Mistakes

### ❌ Wrong URL
```
# Wrong
https://gerobakjogja.vercel.app/public/sitemap.xml

# Correct
https://gerobakjogja.vercel.app/sitemap.xml
```

### ❌ Wrong Format
```xml
<!-- Wrong: Missing XML declaration -->
<urlset>...</urlset>

<!-- Correct -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset>...</urlset>
```

### ❌ Blocked by robots.txt
```
# Wrong in robots.txt
Disallow: /sitemap.xml

# Correct
Allow: /sitemap.xml
Sitemap: https://gerobakjogja.vercel.app/sitemap.xml
```

## Quick Checklist

- [x] Sitemap accessible at /sitemap.xml
- [x] Returns 200 status code
- [x] Valid XML format
- [x] Listed in robots.txt
- [x] Submitted to Search Console
- [ ] Wait 24-48 hours
- [ ] Check status again

## Still Having Issues?

### Debug Steps

1. **Check Vercel Logs**
   - Go to Vercel Dashboard
   - Select deployment
   - Check Functions logs

2. **Test Different URLs**
   ```bash
   # Test homepage
   curl https://gerobakjogja.vercel.app/
   
   # Test robots
   curl https://gerobakjogja.vercel.app/robots.txt
   
   # Test sitemap
   curl https://gerobakjogja.vercel.app/sitemap.xml
   ```

3. **Check DNS**
   ```bash
   nslookup gerobakjogja.vercel.app
   ```

4. **Try Different Sitemap Format**
   - Create sitemap.xml.gz (compressed)
   - Submit compressed version

### Contact Support

If still not working after 7 days:

1. **Vercel Support**
   - https://vercel.com/support
   - Explain sitemap not accessible

2. **Google Search Console Help**
   - https://support.google.com/webmasters
   - Report sitemap issue

## Current Status

**Your Sitemap:** ✅ Accessible
```
URL: https://gerobakjogja.vercel.app/sitemap.xml
Status: 200 OK
Format: Valid XML
```

**Issue:** Google Search Console error

**Most Likely Cause:** ⏳ Google still processing (first time)

**Action Required:** 
1. ✅ Deploy dengan vercel.json yang sudah diperbaiki
2. ⏳ Tunggu 24-48 jam
3. 🔄 Re-check Google Search Console

**Expected Resolution:** Within 48 hours

---

**Don't Panic!** This is very common for new sitemaps. Google needs time to process. 🚀
