import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
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
        <Router>
        <ProgressBar />
        <ScrollToTopOnMount />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
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
            </Routes>
          </main>
          <Footer />
          <FloatingActionButton />
        </div>
      </Router>
    </ProductProvider>
    </AuthProvider>
  );
}

export default App;
