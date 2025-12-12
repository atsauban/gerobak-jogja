import { useState, Suspense, lazy } from 'react';
import { Eye, Plus, Edit, Trash2, LogOut, Star } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { debouncedRegenerateSitemap } from '../services/sitemapService';
import ConfirmModal from '../components/ConfirmModal';

// Lazy Load Admin Components
const AdminLogin = lazy(() => import('../components/admin/AdminLogin'));
const AdminDashboardStats = lazy(() => import('../components/admin/AdminDashboardStats'));
const AdminProductManager = lazy(() => import('../components/admin/AdminProductManager'));
const AdminBlogManager = lazy(() => import('../components/admin/AdminBlogManager'));
const AdminTestimonialManager = lazy(() => import('../components/admin/AdminTestimonialManager'));
const AdminFAQManager = lazy(() => import('../components/admin/AdminFAQManager'));
const GalleryManager = lazy(() => import('../components/GalleryManager'));

// Loading Component for Tabs
const TabLoading = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
    <p className="text-gray-500">Memuat komponen...</p>
  </div>
);

export default function Admin() {
  const { products } = useProducts();
  const { user, loading: authLoading, logout } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('products');

  // Universal delete confirmation state
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    type: '', // 'product', 'blog', 'testimonial', 'faq', 'gallery'
    id: null,
    name: '',
    onConfirm: null
  });

  // Universal delete confirmation handler
  const showDeleteConfirmation = (type, id, name, onConfirm) => {
    setDeleteConfirmState({
      isOpen: true,
      type,
      id,
      name,
      onConfirm
    });
  };

  const handleDeleteConfirmation = async () => {
    if (deleteConfirmState.onConfirm) {
      await deleteConfirmState.onConfirm();
    }
    setDeleteConfirmState({
      isOpen: false,
      type: '',
      id: null,
      name: '',
      onConfirm: null
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmState({
      isOpen: false,
      type: '',
      id: null,
      name: '',
      onConfirm: null
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <Suspense fallback={<TabLoading />}>
        <AdminLogin />
      </Suspense>
    );
  }

  return (
    <div className="pt-16 min-h-screen gradient-subtle">
      {/* Header Section */}
      <div className="gradient-primary text-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-block mb-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold">
                🛠️ Admin Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Panel Administrasi
              </h1>
              <p className="text-blue-100">
                Kelola produk, blog, testimoni, dan galeri gerobak Anda
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <div className="glass rounded-xl p-3 sm:p-4 text-left sm:text-right w-full sm:w-auto">
                <p className="text-xs sm:text-sm text-blue-100">Logged in as:</p>
                <p className="font-semibold text-white text-sm sm:text-base truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 border border-white/20 w-full sm:w-auto"
              >
                <LogOut size={18} />
                <span className="sm:hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">

        {/* Stats Cards */}
        <Suspense fallback={<TabLoading />}>
          <AdminDashboardStats products={products} />
        </Suspense>

        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="card p-2">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {[
                { id: 'products', label: 'Produk', icon: <Star size={16} className="sm:w-[18px] sm:h-[18px]" /> },
                { id: 'gallery', label: 'Galeri', icon: <Eye size={16} className="sm:w-[18px] sm:h-[18px]" /> },
                { id: 'testimonials', label: 'Testimoni', icon: <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> },
                { id: 'blog', label: 'Blog', icon: <Edit size={16} className="sm:w-[18px] sm:h-[18px]" /> },
                { id: 'faq', label: 'FAQ', icon: <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none justify-center sm:justify-start ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<TabLoading />}>
            {/* Products Tab */}
            {activeTab === 'products' && <AdminProductManager showDeleteConfirmation={showDeleteConfirmation} />}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Kelola Galeri</h2>
                  <p className="text-gray-600 mt-1">Upload dan kelola foto galeri gerobak</p>
                </div>
                <GalleryManager showDeleteConfirmation={showDeleteConfirmation} />
              </>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && <AdminTestimonialManager showDeleteConfirmation={showDeleteConfirmation} />}

            {/* Blog Tab */}
            {activeTab === 'blog' && <AdminBlogManager showDeleteConfirmation={showDeleteConfirmation} />}

            {/* FAQ Tab */}
            {activeTab === 'faq' && <AdminFAQManager showDeleteConfirmation={showDeleteConfirmation} />}
          </Suspense>
        </div>

        {/* Universal Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteConfirmState.isOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteConfirmation}
          title={`Hapus ${deleteConfirmState.type === 'product' ? 'Produk' :
            deleteConfirmState.type === 'testimonial' ? 'Testimoni' :
              deleteConfirmState.type === 'blog' ? 'Blog' :
                deleteConfirmState.type === 'faq' ? 'FAQ' :
                  deleteConfirmState.type === 'gallery' ? 'Gambar' : 'Item'}`}
          message={`Apakah Anda yakin ingin menghapus ${deleteConfirmState.type === 'product' ? 'produk' :
            deleteConfirmState.type === 'testimonial' ? 'testimoni dari' :
              deleteConfirmState.type === 'blog' ? 'blog' :
                deleteConfirmState.type === 'faq' ? 'FAQ' :
                  deleteConfirmState.type === 'gallery' ? 'gambar' : 'item'} "${deleteConfirmState.name}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus"
          cancelText="Batal"
          type="danger"
        />

        {/* SEO Tools */}
        <div className="mt-6 sm:mt-8 card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg sm:text-xl">SEO Tools</h3>
              <p className="text-gray-600 text-sm sm:text-base">Kelola sitemap dan optimasi SEO</p>
            </div>
            <button
              onClick={async () => {
                const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

                if (isDevelopment) {
                  toast.info('Development mode: Logging sitemap changes...');
                } else {
                  toast.info('Regenerating sitemap...');
                }

                const success = await debouncedRegenerateSitemap();

                if (success) {
                  if (isDevelopment) {
                    toast.success('Sitemap changes logged! Check console for details.');
                  } else {
                    toast.success('Sitemap regenerated and submitted to search engines!');
                  }
                } else {
                  toast.warning('Sitemap operation completed with warnings. Check console.');
                }
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden xs:inline">Regenerate Sitemap</span>
              <span className="xs:hidden">Sitemap</span>
            </button>

            {/* Debug Button for Testing Functions */}
            <button
              onClick={async () => {
                // Better platform detection for development
                const isVercel = window.location.hostname.includes('vercel.app');
                const isNetlifyDev = window.location.port === '8888' || window.location.hostname === 'localhost';

                let testUrl, platform;
                if (isVercel) {
                  testUrl = '/api/test';
                  platform = 'Vercel';
                } else {
                  testUrl = '/.netlify/functions/test';
                  platform = 'Netlify';
                }

                toast.info(`Testing ${platform} function...`);

                try {
                  const response = await fetch(testUrl);

                  if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                  }

                  const result = await response.json();
                  toast.success(`✅ ${result.platform || platform} function working!`);
                } catch (error) {
                  toast.error(`❌ Function not available: ${error.message}`);
                  console.error('Function test error:', error);
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden xs:inline">Test Function</span>
              <span className="xs:hidden">Test</span>
            </button>

            {/* Test Cloudinary Button */}
            <button
              onClick={async () => {
                // Better platform detection for development
                const isVercel = window.location.hostname.includes('vercel.app');

                let testUrl, platform;
                if (isVercel) {
                  testUrl = '/api/test-cloudinary';
                  platform = 'Vercel';
                } else {
                  testUrl = '/.netlify/functions/test-cloudinary';
                  platform = 'Netlify';
                }

                toast.info(`Testing Cloudinary on ${platform}...`);

                try {
                  const response = await fetch(testUrl);

                  if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                  }

                  const result = await response.json();
                  toast.success(`✅ Cloudinary working on ${result.platform || platform}!`);
                } catch (error) {
                  toast.error(`❌ Cloudinary function not available: ${error.message}`);
                  console.error('Cloudinary test error:', error);
                }
              }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden xs:inline">Test Cloudinary</span>
              <span className="xs:hidden">Cloud</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base text-gray-600">
            <div className="space-y-2">
              <p>• <strong>Auto-regenerate:</strong> Sitemap otomatis update saat konten berubah</p>
              <p>• <strong>Search engines:</strong> Auto-submit ke Google & Bing (production)</p>
              <p>• <strong>Image SEO:</strong> Include gambar produk & blog</p>
            </div>
            <div className="space-y-2">
              <p>• <strong>Development:</strong> Logging mode dengan detailed console output</p>
              <p>• <strong>Manual trigger:</strong> Gunakan tombol di atas jika perlu</p>
              <p>• <strong>Cloudinary:</strong> Auto-delete images on Vercel & Netlify</p>
              <p>• <strong>URL:</strong> <a href="/sitemap.xml" target="_blank" className="text-primary-600 hover:underline">/sitemap.xml</a></p>
              <p>• <strong>Status:</strong> <span className="text-green-600 font-medium">Active & Auto-updating</span></p>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 sm:mt-8 glass rounded-2xl p-4 sm:p-6 border border-primary-200/30">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-lg sm:text-xl">
              ℹ️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-3 text-lg sm:text-xl">Informasi Sistem</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
                <div className="space-y-2">
                  <p>• Data tersimpan di Firebase Cloud</p>
                  <p>• Perubahan langsung terlihat di website</p>
                  <p>• Maksimal 5 gambar per produk</p>
                  <p>• Format: JPG, PNG, WebP (max 5MB)</p>
                </div>
                <div className="space-y-2">
                  <p>• Gambar pertama = foto utama produk</p>
                  <p>• Testimoni muncul di halaman utama</p>
                  <p>• Blog bisa di-featured untuk home</p>
                  <p>• FAQ membantu customer support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
