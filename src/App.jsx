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
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import ProductDetail from './pages/ProductDetail';
import Galeri from './pages/Galeri';
import Tentang from './pages/Tentang';
import Kontak from './pages/Kontak';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { 
  createProduct, 
  createTestimonial, 
  createBlogPost, 
  createFAQ,
  createGalleryImage
} from './services/firebaseService';

// Helper functions untuk migrasi data dari localStorage ke Firebase
if (typeof window !== 'undefined') {
  window.addProductToFirebase = async (product) => {
    const { id, ...productData } = product; // Remove old ID
    return await createProduct(productData);
  };

  window.addTestimonialToFirebase = async (testimonial) => {
    const { id, ...testimonialData } = testimonial;
    return await createTestimonial(testimonialData);
  };

  window.addBlogPostToFirebase = async (post) => {
    const { id, ...postData } = post;
    return await createBlogPost(postData);
  };

  window.addFAQToFirebase = async (faq) => {
    const { id, ...faqData } = faq;
    return await createFAQ(faqData);
  };

  window.addGalleryImageToFirebase = async (image) => {
    const { id, ...imageData } = image;
    return await createGalleryImage(imageData);
  };
}

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
