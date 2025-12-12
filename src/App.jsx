import { BrowserRouter as Router } from 'react-router-dom';
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
import AnimatedRoutes from './components/AnimatedRoutes';

// Lazy Load Pages used to be here but moved to AnimatedRoutes

function App() {
  return (
    <HelmetProvider>
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
                    <AnimatedRoutes />
                  </main>
                  <Footer />
                  <FloatingActionButton />
                </div>
              </ErrorBoundary>
            </Router>
          </ToastProvider>
        </ProductProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
