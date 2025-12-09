# Production Checklist

## ✅ Sebelum Deploy

### Konten
- [ ] Update nomor WhatsApp di `src/config/contact.js`
- [ ] Update email di `src/config/contact.js`
- [ ] Update alamat di `src/config/contact.js`
- [ ] Update jam operasional
- [ ] Update social media links
- [ ] Upload foto produk real (ganti placeholder)
- [ ] Update harga produk
- [ ] Update deskripsi produk
- [ ] Update visi & misi di halaman Tentang
- [ ] Update testimonials dengan data real

### SEO
- [ ] Update meta title di `index.html`
- [ ] Update meta description
- [ ] Update keywords
- [ ] Update Open Graph image (`og-image.jpg`)
- [ ] Update canonical URL
- [ ] Update sitemap.xml dengan domain real
- [ ] Verify robots.txt

### Analytics
- [ ] Setup Google Analytics
- [ ] Uncomment GA script di `index.html`
- [ ] Ganti ID dengan ID real
- [ ] Test tracking

### Images
- [ ] Optimize semua images (WebP/JPG)
- [ ] Compress images (< 200KB per image)
- [ ] Add alt text untuk semua images
- [ ] Upload favicon (32x32, 16x16)
- [ ] Upload apple-touch-icon (180x180)
- [ ] Upload og-image (1200x630)

### Security
- [ ] Implementasi backend authentication untuk admin
- [ ] Setup environment variables
- [ ] Hide sensitive data
- [ ] Setup CORS jika ada API
- [ ] SSL certificate (HTTPS)

### Performance
- [ ] Test di Google PageSpeed Insights
- [ ] Test di GTmetrix
- [ ] Optimize bundle size
- [ ] Enable compression
- [ ] Setup CDN (optional)

### Testing
- [ ] Test semua halaman
- [ ] Test semua links
- [ ] Test WhatsApp buttons
- [ ] Test contact form
- [ ] Test admin panel
- [ ] Test responsive di mobile
- [ ] Test di berbagai browser (Chrome, Firefox, Safari)
- [ ] Test loading speed

### Domain & Hosting
- [ ] Beli domain
- [ ] Setup DNS
- [ ] Deploy ke hosting
- [ ] Test dengan domain real
- [ ] Setup email dengan domain

## 🚀 Setelah Deploy

### Monitoring
- [ ] Setup uptime monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Monitor analytics
- [ ] Monitor performance

### Marketing
- [ ] Submit ke Google Search Console
- [ ] Submit sitemap
- [ ] Setup Google My Business
- [ ] Share di social media
- [ ] Setup Facebook Pixel (optional)

### Maintenance
- [ ] Backup website regular
- [ ] Update dependencies
- [ ] Monitor security updates
- [ ] Update content regular

## 📝 Notes

### Recommended Tools
- **Image Optimization**: Squoosh.app, TinyPNG
- **Performance**: Google PageSpeed, GTmetrix
- **SEO**: Google Search Console, Ahrefs
- **Analytics**: Google Analytics, Hotjar
- **Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, LogRocket

### Priority
1. **High**: Konten, SEO, Images, Testing
2. **Medium**: Analytics, Performance, Security
3. **Low**: Advanced features, Monitoring

### Timeline Suggestion
- Week 1: Konten & Images
- Week 2: SEO & Testing
- Week 3: Deploy & Monitoring
- Week 4: Marketing & Optimization
