import { useState, Suspense, lazy } from 'react';
import {
  LogOut,
  RefreshCw,
  CheckCircle,
  Image,
  Info,
  Package,
  ImageIcon,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { debouncedRegenerateSitemap } from '../services/sitemapService';
import ConfirmModal from '../components/ConfirmModal';

// Lazy Load Admin Components
const AdminLogin = lazy(() => import('../components/admin/AdminLogin'));
const AdminDashboardStats = lazy(
  () => import('../components/admin/AdminDashboardStats')
);
const ProductManager = lazy(
  () => import('../components/admin/ProductManager')
);
const BlogManager = lazy(() => import('../components/admin/BlogManager'));
const TestimonialManager = lazy(
  () => import('../components/admin/TestimonialManager')
);
const FAQManager = lazy(() => import('../components/admin/FAQManager'));
const GalleryManager = lazy(
  () => import('../components/admin/GalleryManager')
);

// Loading Component for Tabs
const TabLoading = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary-600 mb-4"></div>
    <p className="text-gray-500 text-sm">Memuat komponen...</p>
  </div>
);

export default function Admin() {
  const { products } = useProducts();
  const { user, loading: authLoading, logout } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('products');

  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    type: '',
    id: null,
    name: '',
    onConfirm: null,
  });

  const showDeleteConfirmation = (type, id, name, onConfirm) => {
    setDeleteConfirmState({ isOpen: true, type, id, name, onConfirm });
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
      onConfirm: null,
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmState({
      isOpen: false,
      type: '',
      id: null,
      name: '',
      onConfirm: null,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const tabs = [
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'gallery', label: 'Galeri', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimoni', icon: MessageSquare },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  if (authLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<TabLoading />}>
        <AdminLogin />
      </Suspense>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Settings size={16} className="text-white" />
                </div>
                <h1 className="text-2xl font-display font-bold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-gray-500 text-sm">
                Kelola produk, galeri, testimoni, blog, dan FAQ
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400">Logged in as</p>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <Suspense fallback={<TabLoading />}>
          <AdminDashboardStats products={products} />
        </Suspense>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm inline-flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <Suspense fallback={<TabLoading />}>
            {activeTab === 'products' && (
              <ProductManager
                showDeleteConfirmation={showDeleteConfirmation}
              />
            )}

            {activeTab === 'gallery' && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Kelola Galeri
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Upload dan kelola foto galeri gerobak
                  </p>
                </div>
                <GalleryManager
                  showDeleteConfirmation={showDeleteConfirmation}
                />
              </>
            )}

            {activeTab === 'testimonials' && (
              <TestimonialManager
                showDeleteConfirmation={showDeleteConfirmation}
              />
            )}

            {activeTab === 'blog' && (
              <BlogManager showDeleteConfirmation={showDeleteConfirmation} />
            )}

            {activeTab === 'faq' && (
              <FAQManager showDeleteConfirmation={showDeleteConfirmation} />
            )}
          </Suspense>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteConfirmState.isOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteConfirmation}
          title={`Hapus ${deleteConfirmState.type === 'product'
            ? 'Produk'
            : deleteConfirmState.type === 'testimonial'
              ? 'Testimoni'
              : deleteConfirmState.type === 'blog'
                ? 'Blog'
                : deleteConfirmState.type === 'faq'
                  ? 'FAQ'
                  : deleteConfirmState.type === 'gallery'
                    ? 'Gambar'
                    : 'Item'
            }`}
          message={`Apakah Anda yakin ingin menghapus "${deleteConfirmState.name}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus"
          cancelText="Batal"
          type="danger"
        />

        {/* SEO Tools */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">SEO Tools</h3>
              <p className="text-gray-500 text-sm">
                Kelola sitemap dan optimasi SEO
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={async () => {
                  const isDev =
                    window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1';
                  toast.info(
                    isDev
                      ? 'Development: Logging sitemap...'
                      : 'Regenerating sitemap...'
                  );
                  const success = debouncedRegenerateSitemap();
                  if (success) {
                    toast.success(
                      isDev ? 'Sitemap logged!' : 'Sitemap regenerated!'
                    );
                  }
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <RefreshCw size={16} />
                Regenerate Sitemap
              </button>

              <button
                onClick={async () => {
                  const isVercel =
                    window.location.hostname.includes('vercel.app');
                  const testUrl = isVercel
                    ? '/api/test'
                    : '/.netlify/functions/test';
                  toast.info('Testing function...');
                  try {
                    const response = await fetch(testUrl);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const result = await response.json();
                    toast.success(`${result.platform || 'Function'} working!`);
                  } catch (error) {
                    toast.error(`Function error: ${error.message}`);
                  }
                }}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <CheckCircle size={16} />
                Test Function
              </button>

              <button
                onClick={async () => {
                  const isVercel =
                    window.location.hostname.includes('vercel.app');
                  const testUrl = isVercel
                    ? '/api/test-cloudinary'
                    : '/.netlify/functions/test-cloudinary';
                  toast.info('Testing Cloudinary...');
                  try {
                    const response = await fetch(testUrl);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    toast.success('Cloudinary working!');
                  } catch (error) {
                    toast.error(`Cloudinary error: ${error.message}`);
                  }
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Image size={16} />
                Test Cloudinary
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Auto-regenerate saat konten berubah
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Auto-submit ke Google & Bing
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Include gambar produk & blog
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Cloudinary auto-delete aktif
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                URL:{' '}
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  /sitemap.xml
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Status:{' '}
                <span className="text-green-600 font-medium">Active</span>
              </p>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 bg-gray-50 rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
              <Info size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Informasi Sistem</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-gray-600">
            <ul className="space-y-2">
              {[
                'Data tersimpan di Firebase Cloud',
                'Perubahan langsung terlihat di website',
                'Maksimal 5 gambar per produk',
                'Format: JPG, PNG, WebP (max 5MB)',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {[
                'Gambar pertama = foto utama produk',
                'Testimoni muncul di halaman utama',
                'Blog bisa di-featured untuk home',
                'FAQ membantu customer support',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
