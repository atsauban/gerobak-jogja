# SEO Setup Guide

## Overview
Website Gerobak Jogja sudah dilengkapi dengan konfigurasi SEO yang lengkap untuk meningkatkan visibility di search engines.

## Files Created

### 1. **public/robots.txt**
File yang memberitahu search engine crawler halaman mana yang boleh dan tidak boleh di-crawl.

**Features:**
- Allow all pages kecuali `/admin`
- Block API endpoints dan Netlify functions
- Allow semua images
- Sitemap location
- Crawl-delay untuk specific bots

**Location:** `https://gerobakjogja.vercel.app/robots.txt`

### 2. **public/sitemap.xml**
XML sitemap yang berisi daftar semua halaman website untuk membantu search engines mengindex website.

**Includes:**
- Static pages (Home, Katalog, Galeri, Tentang, Kontak, Blog)
- Product category pages
- Placeholder untuk product detail pages
- Placeholder untuk blog post pages

**Location:** `https://gerobakjogja.vercel.app/sitemap.xml`

### 3. **scripts/generate-sitemap.js**
Script untuk generate sitemap dinamis dari Firebase data.

**Features:**
- Fetch products dari Firebase
- Fetch blog posts dari Firebase
- Generate XML dengan image tags
- Auto-update lastmod dates
- Error handling

## Meta Tags in index.html

### Primary Meta Tags
```html
<title>Gerobak Jogja - Pembuatan Gerobak Berkualitas</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta name="author" content="Gerobak Jogja" />
<meta name="robots" content="index, follow" />
```

### Open Graph (Facebook)
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://gerobakjogja.vercel.app/" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
```

### Twitter Card
```html
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="..." />
<meta property="twitter:description" content="..." />
<meta property="twitter:image" content="..." />
```

### Google Search Console
```html
<meta name="google-site-verification" content="1T47W_hMwPz-IYDhYtGk2g_BrqxxgMxZrd1eSwGZ2Jk" />
```

## Usage

### Generate Dynamic Sitemap

#### Option 1: Manual Generation
```bash
npm run generate:sitemap
```

#### Option 2: Build with Sitemap
```bash
npm run build:sitemap
```

This will:
1. Fetch all products from Firebase
2. Fetch all blog posts from Firebase
3. Generate sitemap.xml with all URLs
4. Build the project

### Environment Variables Required
Make sure these are set in your `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Google Search Console Setup

### Step 1: Verify Ownership
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://gerobakjogja.vercel.app`
3. Choose "HTML tag" verification method
4. Meta tag sudah ditambahkan di `index.html`
5. Click "Verify"

### Step 2: Submit Sitemap
1. After verification, go to "Sitemaps" in left menu
2. Add new sitemap: `https://gerobakjogja.vercel.app/sitemap.xml`
3. Click "Submit"

### Step 3: Monitor Performance
- Check "Performance" tab untuk melihat impressions, clicks, CTR
- Check "Coverage" untuk melihat indexed pages
- Check "Enhancements" untuk mobile usability dan Core Web Vitals

## Bing Webmaster Tools Setup

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site: `https://gerobakjogja.vercel.app`
3. Verify using meta tag (already in index.html) or other methods
4. Submit sitemap: `https://gerobakjogja.vercel.app/sitemap.xml`

## Best Practices

### 1. **Update Sitemap Regularly**
Run `npm run generate:sitemap` setiap kali:
- Menambah produk baru
- Menambah blog post baru
- Mengupdate konten penting

### 2. **Monitor robots.txt**
Pastikan tidak accidentally block halaman penting:
```bash
# Test robots.txt
curl https://gerobakjogja.vercel.app/robots.txt
```

### 3. **Check Sitemap Validity**
Test sitemap di:
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- Google Search Console

### 4. **Optimize Meta Tags**
- Keep title under 60 characters
- Keep description under 160 characters
- Use relevant keywords naturally
- Update OG image untuk better social sharing

### 5. **Structured Data (Future)**
Consider adding JSON-LD structured data untuk:
- Product schema
- Organization schema
- Breadcrumb schema
- Review schema

## Automation (Optional)

### GitHub Actions
Create `.github/workflows/update-sitemap.yml`:
```yaml
name: Update Sitemap

on:
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sunday
  workflow_dispatch: # Manual trigger

jobs:
  update-sitemap:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run generate:sitemap
      - run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/sitemap.xml
          git commit -m "Update sitemap" || exit 0
          git push
```

### Netlify Build Hook
1. Go to Netlify Dashboard > Site settings > Build & deploy
2. Add build hook
3. Trigger build setiap kali update sitemap

## Monitoring Tools

### Free Tools
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Google Analytics](https://analytics.google.com)

### SEO Analysis
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Sitemap Testing
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [Screaming Frog](https://www.screamingfrogseoseo.com/)

## Checklist

### Initial Setup
- [x] Create robots.txt
- [x] Create sitemap.xml
- [x] Add meta tags to index.html
- [x] Add Google Search Console verification
- [x] Add favicon
- [x] Add canonical URLs
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics
- [ ] Create og-image.jpg for social sharing

### Ongoing Maintenance
- [ ] Update sitemap weekly
- [ ] Monitor Search Console for errors
- [ ] Check Core Web Vitals monthly
- [ ] Update meta descriptions for new pages
- [ ] Add structured data for products
- [ ] Optimize images with alt tags
- [ ] Build quality backlinks

## Common Issues

### Sitemap Not Found
- Check file exists at `public/sitemap.xml`
- Verify URL: `https://gerobakjogja.vercel.app/sitemap.xml`
- Check Vercel deployment includes public folder

### Pages Not Indexed
- Check robots.txt not blocking pages
- Submit sitemap to Search Console
- Check page has proper meta tags
- Ensure page is linked from other pages

### Low Rankings
- Improve page speed (use Lighthouse)
- Add more quality content
- Build backlinks
- Optimize for mobile
- Use relevant keywords
- Improve user experience

## Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Ahrefs SEO Guide](https://ahrefs.com/seo)
- [Schema.org](https://schema.org/) - Structured data

---

**Last Updated:** December 2024
**Version:** 1.0.0
