import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';

// Lazy Load Pages
const Home = lazy(() => import('../pages/Home'));
const Katalog = lazy(() => import('../pages/Katalog'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const Galeri = lazy(() => import('../pages/Galeri'));
const Tentang = lazy(() => import('../pages/Tentang'));
const Kontak = lazy(() => import('../pages/Kontak'));
const Blog = lazy(() => import('../pages/Blog'));
const BlogDetail = lazy(() => import('../pages/BlogDetail'));
const Admin = lazy(() => import('../pages/Admin'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Loading Screen
const PageLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Memuat halaman...</p>
        </div>
    </div>
);

// Helper to wrap pages with transition and suspense
const WithTransition = ({ children }) => (
    <Suspense fallback={<PageLoading />}>
        {children}
    </Suspense>
);

export default function AnimatedRoutes() {
    return (
        <Routes>
            <Route path="/" element={<WithTransition><Home /></WithTransition>} />
            <Route path="/katalog" element={<WithTransition><Katalog /></WithTransition>} />
            <Route path="/produk/:slug" element={<WithTransition><ProductDetail /></WithTransition>} />
            <Route path="/galeri" element={<WithTransition><Galeri /></WithTransition>} />
            <Route path="/tentang" element={<WithTransition><Tentang /></WithTransition>} />
            <Route path="/kontak" element={<WithTransition><Kontak /></WithTransition>} />
            <Route path="/blog" element={<WithTransition><Blog /></WithTransition>} />
            <Route path="/blog/:slug" element={<WithTransition><BlogDetail /></WithTransition>} />
            <Route path="/admin" element={<WithTransition><Admin /></WithTransition>} />
            <Route path="/404-redirect" element={<WithTransition><NotFound /></WithTransition>} />
            <Route path="*" element={<WithTransition><NotFound /></WithTransition>} />
        </Routes>
    );
}
