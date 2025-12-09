# 📚 Documentation Index

## Cloudinary Auto-Delete Implementation

### 🚀 Quick Start
- **[START_HERE.md](START_HERE.md)** - Mulai disini! Setup dalam 5 menit

### 📖 Setup Guides
- **[SETUP_CLOUDINARY_DELETE.md](SETUP_CLOUDINARY_DELETE.md)** - Quick setup guide
- **[CLOUDINARY_AUTO_DELETE.md](CLOUDINARY_AUTO_DELETE.md)** - Full documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What's implemented

### 🔧 Reference
- **[CLOUDINARY_DELETE_README.md](CLOUDINARY_DELETE_README.md)** - Quick reference
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues & solutions

### 📝 Old Docs (Reference Only)
- **[CLOUDINARY_DELETE_SETUP.md](CLOUDINARY_DELETE_SETUP.md)** - Manual delete method (old)

---

## Other Documentation

### Firebase & Backend
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Firebase configuration
- **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** - Backend integration guide
- **[BACKEND_SUMMARY.md](BACKEND_SUMMARY.md)** - Backend summary

### Admin & Features
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Admin panel guide
- **[ADMIN_FEATURES.md](ADMIN_FEATURES.md)** - Admin features list
- **[ADMIN_AUTH_SETUP.md](ADMIN_AUTH_SETUP.md)** - Admin authentication

### Migration & Data
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Migration guide
- **[CARA_MIGRASI.md](CARA_MIGRASI.md)** - Cara migrasi (Bahasa Indonesia)
- **[POPULATE_DATA.md](POPULATE_DATA.md)** - Populate default data

### Development
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide
- **[FEATURES.md](FEATURES.md)** - Features list
- **[STYLE_GUIDE.md](STYLE_GUIDE.md)** - Style guide
- **[CHANGELOG.md](CHANGELOG.md)** - Changelog

### Deployment
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Production checklist
- **[CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)** - Cloudinary setup
- **[FIREBASE_RULES_UPDATE.md](FIREBASE_RULES_UPDATE.md)** - Firebase rules

### Debug
- **[DEBUG_UPLOAD.md](DEBUG_UPLOAD.md)** - Debug upload issues
- **[DEBUG_GALLERY_DISPLAY.md](DEBUG_GALLERY_DISPLAY.md)** - Debug gallery display

---

## Quick Links

### Development
```bash
# Regular development
npm run dev

# Development with Netlify Functions
npm run dev:netlify

# Build for production
npm run build

# Preview production build
npm run preview
```

### Important URLs

**Local:**
- Regular dev: http://localhost:5173
- Netlify dev: http://localhost:8888
- Admin: http://localhost:8888/admin

**Production:**
- Website: https://gerobak-jogja.netlify.app
- Admin: https://gerobak-jogja.netlify.app/admin

**External:**
- Firebase Console: https://console.firebase.google.com/
- Cloudinary Dashboard: https://console.cloudinary.com/
- Netlify Dashboard: https://app.netlify.com/

---

## File Structure

```
gerobak-jogja/
├── netlify/
│   └── functions/
│       └── cloudinary-delete.js    # Netlify Function for Cloudinary delete
├── src/
│   ├── components/
│   │   ├── GalleryManager.jsx      # Gallery management (admin)
│   │   └── ImageUpload.jsx         # Image upload component
│   ├── pages/
│   │   ├── Admin.jsx               # Admin panel
│   │   ├── Galeri.jsx              # Gallery page
│   │   └── Home.jsx                # Home page
│   ├── services/
│   │   └── firebaseService.js      # Firebase & Cloudinary operations
│   └── utils/
│       └── cloudinaryDelete.js     # Cloudinary utilities
├── .env                             # Environment variables (local)
├── .env.example                     # Environment variables template
├── netlify.toml                     # Netlify configuration
├── package.json                     # Dependencies & scripts
└── [documentation files]
```

---

## Need Help?

1. **Start with:** [START_HERE.md](START_HERE.md)
2. **Having issues?** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. **Need details?** [CLOUDINARY_AUTO_DELETE.md](CLOUDINARY_AUTO_DELETE.md)

---

**Last Updated:** December 9, 2025
