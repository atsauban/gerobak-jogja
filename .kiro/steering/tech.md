# Technology Stack

## Frontend Framework
- **React 19** with JSX
- **Vite** as build tool and dev server
- **React Router DOM v7** for client-side routing
- **Framer Motion** for animations and page transitions

## Styling & UI
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- Custom color palette with primary (blue) and accent (orange) themes
- Responsive design with mobile-first approach

## Backend & Database
- **Firebase Firestore** for NoSQL database
- **Firebase Authentication** for admin login
- **Firebase Storage** for file uploads (legacy)
- **Cloudinary** for optimized image hosting and management

## Deployment & Functions
- **Netlify** (recommended) with Netlify Functions for serverless backend
- **Vercel** support (limited - no Cloudinary auto-delete)
- Netlify Functions for Cloudinary image management

## State Management
- **React Context API** for global state (Auth, Products)
- Custom hooks for reusable logic
- Local component state with useState/useEffect

## Development Tools
- **ESLint** with React-specific rules
- **PostCSS** with Autoprefixer
- Node.js 18+ requirement

## Common Commands

```bash
# Development
npm run dev              # Vite dev server (port 5173)
npm run dev:netlify      # Netlify dev with functions (port 8888)

# Building
npm run build            # Production build
npm run build:sitemap    # Build with sitemap generation

# Utilities
npm run generate:sitemap # Generate sitemap only
npm run lint            # ESLint check
npm run preview         # Preview production build
```

## Environment Variables

Required for development (.env.development):
```
VITE_WHATSAPP_NUMBER=6282327220077
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Key Dependencies
- `@emailjs/browser` - Contact form email integration
- `react-helmet-async` - SEO meta tags management
- `marked` - Markdown parsing for blog content
- `cloudinary` - Image optimization and management