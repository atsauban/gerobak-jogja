import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import SkipToContent from './components/SkipToContent';
import AriaLiveRegion from './components/AriaLiveRegion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActionButton from './components/FloatingActionButton';
import ProgressBar from './components/ProgressBar';
import ScrollToTopOnMount from './components/ScrollToTopOnMount';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Katalog = lazy(() => import('./pages/Katalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Galeri = lazy(() => import('./pages/Galeri'));
const Tentang = lazy(() => import('./pages/Tentang'));
const Kontak = lazy(() => import('./pages/Kontak'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading Screen
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-gray-500 font-medium">Memuat halaman...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <ToastProvider>
          <Router>
            <ErrorBoundary>
              <SkipToContent />
              <AriaLiveRegion message="" priority="polite" />
              <AriaLiveRegion message="" priority="assertive" />
              <ProgressBar />
              <ScrollToTopOnMount />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main id="main-content" className="flex-grow" tabIndex={-1}>
                  <Suspense fallback={<PageLoading />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/katalog" element={<Katalog />} />
                      <Route path="/produk/:slug" element={<ProductDetail />} />
                      <Route path="/galeri" element={<Galeri />} />
                      <Route path="/tentang" element={<Tentang />} />
                      <Route path="/kontak" element={<Kontak />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/404-redirect" element={<NotFound />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <FloatingActionButton />
              </div>
            </ErrorBoundary>
          </Router>
        </ToastProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
