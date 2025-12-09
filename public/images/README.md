# Folder Images

Simpan semua foto produk gerobak di folder ini.

## Struktur Folder

```
images/
├── products/          # Foto produk untuk katalog
│   ├── aluminium/
│   ├── kayu/
│   ├── stainless/
│   └── kombinasi/
├── gallery/           # Foto untuk galeri
├── hero/              # Foto untuk hero section
├── about/             # Foto workshop/tim
└── og-image.jpg       # Open Graph image (1200x630px)
```

## Format Rekomendasi

- **Format**: WebP (untuk performa terbaik) atau JPG
- **Ukuran Produk**: 800x600px
- **Ukuran Galeri**: 1200x900px
- **Ukuran Hero**: 1920x1080px
- **OG Image**: 1200x630px

## Cara Menggunakan

1. Upload foto ke folder yang sesuai
2. Update path di file component:
   - `src/pages/Home.jsx` - untuk produk unggulan
   - `src/pages/Katalog.jsx` - untuk katalog
   - `src/pages/Galeri.jsx` - untuk galeri
   - `src/pages/Tentang.jsx` - untuk about

Contoh:
```jsx
image: '/images/products/aluminium/gerobak-1.jpg'
```

## Optimize Images

Gunakan tools seperti:
- https://squoosh.app/ (online)
- https://tinypng.com/ (online)
- ImageOptim (Mac)
- RIOT (Windows)
