import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
import { OrganizationSchema, LocalBusinessSchema } from './components/StructuredData';
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import ProductDetail from './pages/ProductDetail';
import Galeri from './pages/Galeri';
import Tentang from './pages/Tentang';
import Kontak from './pages/Kontak';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Admin from './pages/Admin';
import MaintenanceWrapper from './components/MaintenanceWrapper';
import NotFound from './pages/NotFound';

// Lazy Load Pages used to be here but moved to AnimatedRoutes

function App() {
  return (
    <HelmetProvider>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <AuthProvider>
        <ProductProvider>
          <ToastProvider>
            <Router>
              <ErrorBoundary>
                <MaintenanceWrapper>
                  <SkipToContent />
                  <AriaLiveRegion message="" priority="polite" />
                  <AriaLiveRegion message="" priority="assertive" />
                  <ProgressBar />
                  <ScrollToTopOnMount />
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main id="main-content" className="flex-grow" tabIndex={-1}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/katalog" element={<Katalog />} />
                        <Route path="/produk/:id" element={<ProductDetail />} />
                        <Route path="/galeri" element={<Galeri />} />
                        <Route path="/tentang" element={<Tentang />} />
                        <Route path="/kontak" element={<Kontak />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogDetail />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/notfound" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/notfound" replace />} />
                      </Routes>
                    </main>
                    <Footer />
                    <FloatingActionButton />
                  </div>
                </MaintenanceWrapper>
              </ErrorBoundary>
            </Router>
          </ToastProvider>
        </ProductProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
