# SEO Quick Reference

## Files Created
- ✅ `public/robots.txt` - Search engine crawler rules
- ✅ `public/sitemap.xml` - XML sitemap
- ✅ `scripts/generate-sitemap.js` - Dynamic sitemap generator
- ✅ Google Search Console verification meta tag
- ✅ Favicon updated to logo.webp

## Quick Commands

### Generate Dynamic Sitemap
```bash
npm run generate:sitemap
```

### Build with Sitemap
```bash
npm run build:sitemap
```

## Next Steps

### 1. Deploy Website
Deploy ke production dengan perubahan terbaru.

### 2. Verify Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://gerobakjogja.vercel.app`
3. Click "Verify" (meta tag sudah ada di index.html)

### 3. Submit Sitemap
1. In Google Search Console, go to "Sitemaps"
2. Add sitemap URL: `https://gerobakjogja.vercel.app/sitemap.xml`
3. Click "Submit"

### 4. Update Sitemap (Optional)
Setelah menambah produk atau blog post baru:
```bash
npm run generate:sitemap
git add public/sitemap.xml
git commit -m "Update sitemap"
git push
```

## Files Location
- Robots.txt: `https://gerobakjogja.vercel.app/robots.txt`
- Sitemap: `https://gerobakjogja.vercel.app/sitemap.xml`

## Documentation
Full documentation: [docs/SEO_SETUP.md](docs/SEO_SETUP.md)

---

**Status**: ✅ Ready for production
