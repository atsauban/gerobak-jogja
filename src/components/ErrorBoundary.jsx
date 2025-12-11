import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service (e.g., Sentry)
    // For now, we'll just store it in state
    this.setState({
      error,
      errorInfo
    });

    // Only log in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
          <div className="max-w-md w-full text-center">
            <div className="card p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Terjadi Kesalahan
              </h2>
              
              <p className="text-gray-600 mb-6">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan coba refresh halaman atau kembali ke beranda.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Coba Lagi
                </button>
                
                <Link
                  to="/"
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Home size={18} />
                  Kembali ke Beranda
                </Link>
              </div>

              {/* Show error details in development only */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-48">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

