# Project Structure & Organization

## Root Directory Structure

```
├── src/                    # Main application source code
├── public/                 # Static assets and files
├── netlify/functions/      # Netlify serverless functions
├── api/                    # Vercel API routes (alternative deployment)
├── scripts/                # Build and utility scripts
├── payloads/               # Security testing payloads
├── .netlify/               # Netlify build artifacts (auto-generated)
└── dist/                   # Production build output (auto-generated)
```

## Source Code Organization (`src/`)

```
src/
├── components/             # Reusable UI components
│   ├── admin/             # Admin panel specific components
│   ├── blog/              # Blog-related components
│   └── product/           # Product detail components
├── pages/                 # Route-level page components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── services/              # API and external service integrations
├── utils/                 # Helper functions and utilities
├── config/                # Configuration files
├── styles/                # Additional CSS files
└── assets/                # Static assets (images, icons)
```

## Component Architecture Patterns

### Page Components (`src/pages/`)
- Route-level components (Home.jsx, Katalog.jsx, etc.)
- Handle page-specific state and data fetching
- Import and compose smaller components

### Reusable Components (`src/components/`)
- **Atomic components**: Button-like elements, form inputs
- **Composite components**: Cards, modals, forms
- **Layout components**: Navbar, Footer, PageHero
- **Feature components**: Organized in subfolders (admin/, blog/, product/)

### Context Providers (`src/context/`)
- `AuthContext.jsx` - User authentication state
- `ProductContext.jsx` - Product data and operations
- Wrap App.jsx for global state access

### Services (`src/services/`)
- `firebaseService.js` - All Firebase/Firestore operations
- `api.js` - External API integrations
- `sitemapService.js` - SEO sitemap generation

### Utilities (`src/utils/`)
- `security.js` - Input sanitization and validation
- `errorHandler.js` - Centralized error handling
- `auditLog.js` - Admin action logging

## File Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard.jsx`, `AdminLogin.jsx`)
- **Pages**: PascalCase (e.g., `Home.jsx`, `ProductDetail.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.js`, `useCountUp.js`)
- **Services**: camelCase (e.g., `firebaseService.js`, `api.js`)
- **Utilities**: camelCase (e.g., `sanitize.js`, `errorHandler.js`)
- **Config**: camelCase (e.g., `firebase.js`, `contact.js`)

## Import/Export Patterns

- Use named exports for utilities and services
- Use default exports for components and pages
- Absolute imports from `src/` root
- Group imports: React → Third-party → Local

## State Management Patterns

- **Global State**: React Context for auth and products
- **Local State**: useState for component-specific data
- **Server State**: Direct Firebase calls in components/pages
- **Form State**: Controlled components with useState

## Routing Structure

```
/                   # Home page
/katalog           # Product catalog
/katalog/:id       # Product detail
/galeri            # Image gallery
/blog              # Blog listing
/blog/:slug        # Blog post detail
/tentang           # About page
/kontak            # Contact page
/admin             # Admin dashboard (protected)
```

## Asset Organization

### Public Assets (`public/`)
- `images/` - Static images organized by feature
- `robots.txt` - SEO crawler instructions
- `sitemap.xml` - Generated sitemap

### Component Assets (`src/assets/`)
- Small icons and logos used in components
- Imported directly into components

## Configuration Files

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS customization
- `eslint.config.js` - Code linting rules
- `netlify.toml` - Netlify deployment settings
- `firebase.json` - Firebase project configuration