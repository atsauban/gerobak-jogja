import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, X, LogOut, Star } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { debouncedRegenerateSitemap } from '../services/sitemapService';
import { logSitemapChange, generateSitemapReport, getRecentChanges } from '../utils/sitemapUpdater';
import ImageUpload from '../components/ImageUpload';
import GalleryManager from '../components/GalleryManager';
import ProductCard from '../components/ProductCard';
import BlogCard from '../components/BlogCard';
import ConfirmModal from '../components/ConfirmModal';
import { useAutoSave, loadDraft, clearDraft } from '../hooks/useAutoSave';
import { 
  getTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../services/firebaseService';
import { sanitizeText, sanitizePrice, sanitizeUrl } from '../utils/sanitize';
import { logProductAction } from '../utils/auditLog';

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user, loading: authLoading, login, logout } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    shortDesc: '',
    description: '',
    badge: '',
    images: [],
    specifications: {},
    features: [],
    includes: []
  });
  
  // Helper states for dynamic fields
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [includeInput, setIncludeInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletedProduct, setDeletedProduct] = useState(null); // For undo
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

  // Auto-save draft
  useAutoSave(formData, 'admin_product_draft', 1000);

  // Load draft on mount
  useEffect(() => {
    if (!showForm && !editingId) {
      const draft = loadDraft('admin_product_draft');
      if (draft && Object.keys(draft).length > 0) {
        // Ask user if they want to restore draft
        const restore = window.confirm('Ada draft yang tersimpan. Ingin melanjutkan?');
        if (restore) {
          setFormData(draft);
          setShowForm(true);
        } else {
          clearDraft('admin_product_draft');
        }
      }
    }
  }, []);

  // Generate slug from product name
  const generateSlug = (name) => {
    if (!name) return '';
    
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
    
    return slug;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      await login(email, password);
      // User will be set by onAuthStateChanged
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setLoginError('Email atau password salah');
      } else if (error.code === 'auth/user-not-found') {
        setLoginError('User tidak ditemukan');
      } else if (error.code === 'auth/too-many-requests') {
        setLoginError('Terlalu banyak percobaan login. Coba lagi nanti.');
      } else {
        setLoginError('Gagal login. Coba lagi.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate images
    if (!formData.images || formData.images.length === 0) {
      toast.error('Minimal upload 1 gambar produk!');
      return;
    }

    // Sanitize all inputs
    const productData = {
      name: sanitizeText(formData.name, 100),
      slug: formData.slug || generateSlug(formData.name),
      category: formData.category, // Already validated by select
      price: sanitizePrice(formData.price),
      shortDesc: sanitizeText(formData.shortDesc, 200),
      description: sanitizeText(formData.description || formData.shortDesc, 2000),
      badge: sanitizeText(formData.badge, 50),
      images: Array.isArray(formData.images) 
        ? formData.images.map(url => sanitizeUrl(url)).filter(url => url) 
        : [sanitizeUrl(formData.images)].filter(url => url),
      rating: 0,
      reviews: 0,
      featured: formData.featured || false,
      specifications: formData.specifications || {},
      features: (formData.features || []).map(f => sanitizeText(f, 200)),
      includes: (formData.includes || []).map(i => sanitizeText(i, 200))
    };

    // Validate sanitized data
    if (!productData.name || !productData.shortDesc || productData.images.length === 0) {
      toast.error('Data tidak valid setelah sanitasi. Periksa input Anda.');
      return;
    }

    try {
      if (editingId) {
        // Check if product exists in Firebase (has Firebase ID format)
        const product = products.find(p => p.id === editingId);
        if (product && typeof product.id === 'string' && product.id.length > 10) {
          // Firebase ID (long string) - can update
          await updateProduct(editingId, productData);
          
          // Log update action
          await logProductAction(user, 'update', { 
            id: editingId, 
            ...productData 
          });
          
          // Log sitemap change for updated product
          logSitemapChange('updated', 'product', {
            id: editingId,
            name: productData.name,
            slug: productData.slug,
            images: productData.images
          });
        } else {
          // LocalStorage ID (number) - create new instead
          toast.warning('Produk ini dari localStorage. Akan dibuat sebagai produk baru di Firebase.');
          const newId = await addProduct(productData);
          
          // Log create action
          await logProductAction(user, 'create', { 
            id: newId, 
            ...productData 
          });
          
          // Log sitemap change for new product
          logSitemapChange('added', 'product', {
            id: newId,
            name: productData.name,
            slug: productData.slug,
            images: productData.images
          });
        }
        setEditingId(null);
      } else {
        const newProduct = await addProduct(productData);
        
        // Log create action
        await logProductAction(user, 'create', { 
          id: newProduct.id, 
          ...newProduct 
        });
        
        // Log sitemap change for new product
        logSitemapChange('added', 'product', {
          id: newProduct.id,
          name: newProduct.name,
          slug: newProduct.slug,
          images: newProduct.images
        });
      }
      
      // Regenerate sitemap when product is created/updated
      debouncedRegenerateSitemap();
      
      setFormData({ 
        name: '', 
        slug: '',
        category: '', 
        price: '', 
        shortDesc: '', 
        description: '',
        badge: '', 
        images: [],
        specifications: {},
        features: [],
        includes: []
      });
      setShowForm(false);
      // Clear draft after successful save
      clearDraft('admin_product_draft');
      
      toast.success('Produk berhasil disimpan!');
    } catch (error) {
      handleError(error, 'Gagal menyimpan produk. Silakan coba lagi.', toast);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      slug: product.slug || generateSlug(product.name),
      category: product.category,
      price: product.price,
      shortDesc: product.shortDesc || '',
      description: product.description || product.shortDesc || '',
      badge: product.badge || '',
      images: product.images || [],
      specifications: product.specifications || {},
      features: product.features || [],
      includes: product.includes || []
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    setProductToDelete({ id, product });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    const { id, product } = productToDelete;
    
    try {
      // Store deleted product for undo
      setDeletedProduct({ id, product, timestamp: Date.now() });
      
      await deleteProduct(id);
      
      // Log delete action
      await logProductAction(user, 'delete', { 
        id: id, 
        name: product.name,
        category: product.category
      });
      
      // Log sitemap change for deleted product
      logSitemapChange('deleted', 'product', {
        id: id,
        name: product.name,
        slug: product.slug || product.id,
        images: product.images
      });
      
      // Regenerate sitemap when product is deleted
      debouncedRegenerateSitemap();
      
      toast.success('Produk berhasil dihapus!', 5000, {
        onUndo: async () => {
          try {
            // Restore product
            await addProduct(deletedProduct.product);
            setDeletedProduct(null);
            toast.success('Produk berhasil dikembalikan!');
          } catch (error) {
            toast.error('Gagal mengembalikan produk: ' + error.message);
          }
        }
      });
    } catch (error) {
      handleError(error, 'Gagal menghapus produk. Silakan coba lagi.', toast);
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    const featuredCount = products.filter(p => p.featured).length;
    
    // Jika mau set featured tapi sudah ada 3
    if (!currentFeatured && featuredCount >= 3) {
      toast.warning('Maksimal 3 produk unggulan! Hapus salah satu produk unggulan terlebih dahulu.');
      return;
    }

    try {
      await updateProduct(id, { featured: !currentFeatured });
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Gagal mengubah status unggulan: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ 
      name: '', 
      slug: '',
      category: '', 
      price: '', 
      shortDesc: '', 
      description: '',
      badge: '', 
      images: [],
      specifications: {},
      features: [],
      includes: []
    });
    setSpecKey('');
    setSpecValue('');
    setFeatureInput('');
    setIncludeInput('');
    // Clear draft when form is cancelled
    clearDraft('admin_product_draft');
  };

  // Helper functions for dynamic fields
  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData({
        ...formData,
        specifications: { ...formData.specifications, [specKey]: specValue }
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addFeature = () => {
    if (featureInput) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const addInclude = () => {
    if (includeInput) {
      setFormData({
        ...formData,
        includes: [...formData.includes, includeInput]
      });
      setIncludeInput('');
    }
  };

  const removeInclude = (index) => {
    setFormData({
      ...formData,
      includes: formData.includes.filter((_, i) => i !== index)
    });
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
      <div className="pt-16 min-h-screen gradient-primary relative overflow-hidden">
        {/* Background Effects - Same as Home page */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/50 rotate-12"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white">
                🔐 Admin Access
              </div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-blue-100">
                Masuk untuk mengelola produk gerobak
              </p>
            </div>

            {/* Login Card */}
            <div className="glass rounded-2xl p-8 backdrop-blur-lg border border-white/20">
              {loginError && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-300/30 rounded-xl text-sm text-red-100 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                    {loginError}
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-white/90 mb-2 font-medium text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gerobakjogja.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    required
                    disabled={loggingIn}
                  />
                </div>
                
                <div>
                  <label className="block text-white/90 mb-2 font-medium text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    required
                    disabled={loggingIn}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full bg-white text-primary-600 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loggingIn ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      Masuk...
                    </div>
                  ) : (
                    'Masuk ke Admin Panel'
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-white/60 text-sm">
                  Gerobak Jogja Admin Dashboard
                </p>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-6 text-center">
              <p className="text-blue-100/80 text-sm">
                🔒 Koneksi aman dengan enkripsi end-to-end
              </p>
            </div>
          </div>
        </div>
      </div>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 -mt-16 relative z-40">
          <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
              <Star size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">{products.length}</div>
            <div className="text-gray-600 font-medium text-sm sm:text-base">Total Produk</div>
          </div>
          
          <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
              <Plus size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
              {products.filter(p => p.category === 'aluminium').length}
            </div>
            <div className="text-gray-600 font-medium text-sm sm:text-base">Gerobak Aluminium</div>
          </div>
          
          <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
              <Edit size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
              {products.filter(p => p.category === 'kayu').length}
            </div>
            <div className="text-gray-600 font-medium text-sm sm:text-base">Gerobak Kayu</div>
          </div>
          
          <div className="card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
              <Star size={20} className="sm:w-6 sm:h-6" fill="currentColor" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
              {products.filter(p => p.featured).length}
            </div>
            <div className="text-gray-600 font-medium text-sm sm:text-base">Produk Unggulan</div>
          </div>
        </div>

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
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none justify-center sm:justify-start ${
                    activeTab === tab.id
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
          {/* Products Tab */}
          {activeTab === 'products' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Produk</h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Tambah, edit, dan kelola produk gerobak</p>
                </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setFormData({ 
                  name: '', 
                  slug: '',
                  category: '', 
                  price: '', 
                  shortDesc: '', 
                  description: '',
                  badge: '', 
                  images: [],
                  specifications: {},
                  features: [],
                  includes: []
                });
                setEditingId(null);
                setSpecKey('');
                setSpecValue('');
                setFeatureInput('');
                setIncludeInput('');
              }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              {showForm ? <X size={18} className="sm:w-5 sm:h-5" /> : <Plus size={18} className="sm:w-5 sm:h-5" />}
              <span className="hidden xs:inline">{showForm ? 'Tutup' : 'Tambah Produk'}</span>
              <span className="xs:hidden">{showForm ? 'Tutup' : 'Tambah'}</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
              <div className="space-y-4 mb-4">
                {/* Row 1: Nama & Slug */}
                <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nama Produk *</label>
                  <input
                    type="text"
                    placeholder="Gerobak Aluminium Premium"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug (auto-generate)</label>
                  <input
                    type="text"
                    placeholder="gerobak-aluminium-premium"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">URL: /produk/{formData.slug}</p>
                </div>
                </div>
                
                {/* Row 2: Kategori, Harga, Badge */}
                <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="aluminium">Aluminium</option>
                    <option value="kayu">Kayu</option>
                    <option value="stainless">Stainless Steel</option>
                    <option value="kombinasi">Kombinasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Harga (Rp) *</label>
                  <input
                    type="text"
                    placeholder="3500000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="Best Seller, Premium, dll"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Deskripsi Singkat *</label>
                <textarea
                  placeholder="Deskripsi singkat untuk card produk..."
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Deskripsi Lengkap</label>
                <textarea
                  placeholder="Deskripsi detail produk untuk halaman detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                ></textarea>
              </div>
              
              {/* Specifications */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Spesifikasi</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nama (contoh: Dimensi)"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Nilai (contoh: 120cm x 80cm)"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {Object.entries(formData.specifications).length > 0 && (
                    <div className="border rounded p-3 bg-gray-50">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-1">
                          <span className="text-sm"><strong>{key}:</strong> {value}</span>
                          <button
                            type="button"
                            onClick={() => removeSpecification(key)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Keunggulan/Features</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: Material aluminium anti karat"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {formData.features.length > 0 && (
                    <ul className="border rounded p-3 bg-gray-50 space-y-1">
                      {formData.features.map((feature, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <span>• {feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Includes */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Yang Anda Dapatkan</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: 1 unit gerobak aluminium"
                      value={includeInput}
                      onChange={(e) => setIncludeInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                      className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addInclude}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {formData.includes.length > 0 && (
                    <ul className="border rounded p-3 bg-gray-50 space-y-1">
                      {formData.includes.map((item, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <span>✓ {item}</span>
                          <button
                            type="button"
                            onClick={() => removeInclude(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Gambar Produk *</label>
                <ImageUpload
                  multiple={true}
                  maxFiles={5}
                  currentImages={formData.images}
                  onUploadComplete={(urls) => setFormData({ ...formData, images: urls })}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
                  {editingId ? 'Update Produk' : 'Simpan Produk'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* Featured Products Info */}
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-yellow-500" size={20} fill="currentColor" />
              <h3 className="font-semibold text-yellow-900">Produk Unggulan di Beranda</h3>
            </div>
            <p className="text-sm text-yellow-700 mb-2">
              Pilih maksimal 3 produk untuk ditampilkan di section "Produk Unggulan" di beranda.
            </p>
            <div className="text-sm text-yellow-800">
              <strong>Terpilih: {products.filter(p => p.featured).length}/3</strong>
              {products.filter(p => p.featured).length > 0 && (
                <span className="ml-2">
                  ({products.filter(p => p.featured).map(p => p.name).join(', ')})
                </span>
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Nama Produk</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-left">Harga</th>
                  <th className="px-4 py-3 text-left">Badge</th>
                  <th className="px-4 py-3 text-center">Unggulan</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 capitalize">{product.category}</td>
                    <td className="px-4 py-3">Rp {parseInt(product.price).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">
                      {product.badge && (
                        <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded text-xs">
                          {product.badge}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleFeatured(product.id, product.featured)}
                          className={`p-2 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                            product.featured 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-gray-300 hover:text-gray-400'
                          }`}
                          title={product.featured ? 'Hapus dari unggulan' : 'Jadikan unggulan'}
                          aria-label={product.featured ? 'Hapus dari unggulan' : 'Jadikan unggulan'}
                        >
                          <Star size={20} fill={product.featured ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/produk/${product.slug || product.id}`}
                          target="_blank"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          title="Lihat Detail"
                          aria-label="Lihat detail produk"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          title="Edit"
                          aria-label="Edit produk"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          title="Hapus"
                          aria-label="Hapus produk"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onToggleFeatured={handleToggleFeatured}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Belum ada produk. Klik "Tambah Produk" untuk menambahkan produk baru.</p>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setProductToDelete(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Hapus Produk"
            message={
              productToDelete
                ? `Apakah Anda yakin ingin menghapus produk "${productToDelete.product.name}"? Tindakan ini tidak dapat dibatalkan.`
                : 'Apakah Anda yakin?'
            }
            confirmText="Ya, Hapus"
            cancelText="Batal"
            type="danger"
          />
            </>
          )}

        {/* Universal Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteConfirmState.isOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteConfirmation}
          title={`Hapus ${deleteConfirmState.type === 'testimonial' ? 'Testimoni' : 
                          deleteConfirmState.type === 'blog' ? 'Blog' : 
                          deleteConfirmState.type === 'faq' ? 'FAQ' : 
                          deleteConfirmState.type === 'gallery' ? 'Gambar' : 'Item'}`}
          message={`Apakah Anda yakin ingin menghapus ${deleteConfirmState.type === 'testimonial' ? 'testimoni dari' : 
                                                        deleteConfirmState.type === 'blog' ? 'blog' : 
                                                        deleteConfirmState.type === 'faq' ? 'FAQ' : 
                                                        deleteConfirmState.type === 'gallery' ? 'gambar' : 'item'} "${deleteConfirmState.name}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus"
          cancelText="Batal"
          type="danger"
        />

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
          {activeTab === 'testimonials' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kelola Testimoni</h2>
                <p className="text-gray-600 mt-1">Tambah dan kelola testimoni pelanggan</p>
              </div>
              <TestimonialManager showDeleteConfirmation={showDeleteConfirmation} />
            </>
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kelola Blog</h2>
                <p className="text-gray-600 mt-1">Tulis dan kelola artikel blog</p>
              </div>
              <BlogManager showDeleteConfirmation={showDeleteConfirmation} />
            </>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kelola FAQ</h2>
                <p className="text-gray-600 mt-1">Tambah dan kelola pertanyaan yang sering diajukan</p>
              </div>
              <FAQManager showDeleteConfirmation={showDeleteConfirmation} />
            </>
          )}
        </div>

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

// Testimonial Manager Component
function TestimonialManager({ showDeleteConfirmation }) {
  const { user } = useAuth();
  const toast = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    rating: 5,
    text: '',
    image: ''
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
      } else {
        await createTestimonial(formData);
      }
      
      await loadTestimonials();
      setFormData({ name: '', business: '', rating: 5, text: '', image: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      toast.error('Gagal menyimpan testimoni: ' + error.message);
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name,
      business: testimonial.business,
      rating: testimonial.rating,
      text: testimonial.text,
      image: testimonial.image || ''
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const testimonial = testimonials.find(t => t.id === id);
    showDeleteConfirmation(
      'testimonial',
      id,
      testimonial?.name || 'pengguna ini',
      async () => {
        try {
          await deleteTestimonial(id);
          await loadTestimonials();
          toast.success('Testimoni berhasil dihapus!');
        } catch (error) {
          toast.error('Gagal menghapus testimoni: ' + error.message);
        }
      }
    );
  };

  const generateAvatar = (name) => {
    const colors = ['0284c7', '22c55e', 'f59e0b', 'ef4444', '8b5cf6', 'ec4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${randomColor}&color=fff`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Testimoni</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ name: '', business: '', rating: 5, text: '', image: '' });
            setEditingId(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Tutup' : 'Tambah Testimoni'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleTestimonialSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nama Pelanggan *</label>
              <input
                type="text"
                placeholder="Budi Santoso"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nama Bisnis *</label>
              <input
                type="text"
                placeholder="Warung Kopi Budi"
                value={formData.business}
                onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rating *</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL Foto (Optional)</label>
              <input
                type="url"
                placeholder="https://... (kosongkan untuk auto-generate)"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Testimoni *</label>
            <textarea
              placeholder="Testimoni pelanggan..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
              {editingId ? 'Update Testimoni' : 'Simpan Testimoni'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', business: '', rating: 5, text: '', image: '' });
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={testimonial.image || generateAvatar(testimonial.name)}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.business}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{testimonial.text}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && testimonials.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Belum ada testimoni. Klik "Tambah Testimoni" untuk menambahkan.</p>
        </div>
      )}
    </div>
  );
}

// Blog Manager Component
function BlogManager({ showDeleteConfirmation }) {
  const { user } = useAuth();
  const toast = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Generate slug from blog title
  const generateSlug = (title) => {
    if (!title) return '';
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
    
    return slug;
  };
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Tips',
    image: '',
    author: 'Admin Gerobak Jogja',
    readTime: '5 menit',
    featured: false
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      setBlogs(data);
    } catch (error) {
      console.error('❌ Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use the main generateSlug function defined at the top

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    
    // Validate featured articles (max 1)
    if (formData.featured) {
      const currentFeatured = blogs.filter(b => b.featured && b.id !== editingId);
      if (currentFeatured.length >= 1) {
        toast.warning('Hanya boleh ada 1 artikel featured! Hapus featured dari artikel lain terlebih dahulu.');
        return;
      }
    }
    
    const blogData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      date: new Date().toISOString().split('T')[0]
    };

    try {
      let resultBlog;
      if (editingId) {
        await updateBlogPost(editingId, blogData);
        resultBlog = { ...blogData, id: editingId };
        logSitemapChange('updated', 'blog', resultBlog);
      } else {
        resultBlog = await createBlogPost(blogData);
        logSitemapChange('added', 'blog', resultBlog);
      }
      
      await loadBlogs();
      setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Tips', image: '', author: 'Admin Gerobak Jogja', readTime: '5 menit', featured: false });
      setShowForm(false);
      setEditingId(null);
      
      // Regenerate sitemap when blog is created/updated
      debouncedRegenerateSitemap();
      
      // Show success message
      toast.success(editingId ? 'Blog berhasil diupdate!' : 'Blog berhasil dibuat!');
    } catch (error) {
      console.error('❌ Blog submit error:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      toast.error('Gagal menyimpan blog: ' + error.message);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      image: blog.image || '',
      author: blog.author || 'Admin Gerobak Jogja',
      readTime: blog.readTime || '5 menit',
      featured: blog.featured || false
    });
    setEditingId(blog.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    // Get blog data before deleting for logging
    const blogToDelete = blogs.find(b => b.id === id);
    showDeleteConfirmation(
      'blog',
      id,
      blogToDelete?.title || 'ini',
      async () => {
        try {
          await deleteBlogPost(id);
          await loadBlogs();
          
          // Log sitemap change for deleted blog
          if (blogToDelete) {
            logSitemapChange('deleted', 'blog', {
              id: id,
              title: blogToDelete.title,
              slug: blogToDelete.slug,
              image: blogToDelete.image
            });
          }
          
          // Regenerate sitemap when blog is deleted
          debouncedRegenerateSitemap();
          
          toast.success('Blog berhasil dihapus!');
        } catch (error) {
          console.error('Delete blog error:', error);
          toast.error('Gagal menghapus blog: ' + error.message);
        }
      }
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Blog</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Tips', image: '', author: 'Admin Gerobak Jogja', readTime: '5 menit', featured: false });
            setEditingId(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Tutup' : 'Tambah Blog'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleBlogSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Judul *</label>
              <input
                type="text"
                placeholder="Tips Memilih Gerobak..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug (auto-generate)</label>
              <input
                type="text"
                placeholder="tips-memilih-gerobak"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tips">Tips</option>
                <option value="Panduan">Panduan</option>
                <option value="Berita">Berita</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL Gambar</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Penulis</label>
              <input
                type="text"
                placeholder="Admin Gerobak Jogja"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Waktu Baca</label>
              <input
                type="text"
                placeholder="5 menit"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Excerpt *</label>
            <textarea
              placeholder="Ringkasan singkat artikel..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Konten * (Markdown)</label>
            <div className="mb-2 text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
              <strong>Tips Formatting Markdown:</strong><br/>
              • Heading: <code>## Judul Besar</code> atau <code>### Judul Kecil</code><br/>
              • Paragraf: Tulis langsung, pisahkan dengan enter 2x<br/>
              • List: <code>- Item pertama</code> atau <code>* Item pertama</code><br/>
              • Bold: <code>**Teks tebal**</code> | Italic: <code>*Teks miring*</code><br/>
              • Link: <code>[Teks link](https://url.com)</code>
            </div>
            <textarea
              placeholder="## Judul Bagian&#10;&#10;Ini adalah paragraf pertama dengan penjelasan lengkap.&#10;&#10;### Sub Judul&#10;&#10;Paragraf kedua dengan **teks tebal** dan *teks miring*.&#10;&#10;- Poin pertama&#10;- Poin kedua&#10;- Poin ketiga"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows="12"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Featured Article</span>
            </label>
            <div className="mt-2 text-xs text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
              <strong>Info Featured Article:</strong><br/>
              • Hanya boleh ada <strong>1 artikel featured</strong> dalam satu waktu<br/>
              • Artikel featured akan ditampilkan di bagian atas halaman blog<br/>
              • Jika ingin mengubah featured, hapus featured dari artikel lain terlebih dahulu
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
              {editingId ? 'Update Blog' : 'Simpan Blog'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Tips', image: '', author: 'Admin Gerobak Jogja', readTime: '5 menit', featured: false });
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Judul</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Featured</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{blog.title}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {blog.featured && <span className="text-yellow-500" aria-label="Featured">⭐</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Lihat blog"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Edit blog"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Hapus blog"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {blogs.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {!loading && blogs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Belum ada blog. Klik "Tambah Blog" untuk menambahkan.</p>
        </div>
      )}
    </div>
  );
}

// FAQ Manager Component
function FAQManager({ showDeleteConfirmation }) {
  const { user } = useAuth();
  const toast = useToast();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const data = await getFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFAQSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateFAQ(editingId, formData);
      } else {
        await createFAQ(formData);
      }
      
      await loadFAQs();
      setFormData({ question: '', answer: '', order: 0 });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      toast.error('Gagal menyimpan FAQ: ' + error.message);
    }
  };

  const handleEdit = (faq) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order || 0
    });
    setEditingId(faq.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const faq = faqs.find(f => f.id === id);
    showDeleteConfirmation(
      'faq',
      id,
      faq?.question || 'ini',
      async () => {
        try {
          await deleteFAQ(id);
          await loadFAQs();
          toast.success('FAQ berhasil dihapus!');
        } catch (error) {
          toast.error('Gagal menghapus FAQ: ' + error.message);
        }
      }
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola FAQ</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ question: '', answer: '', order: 0 });
            setEditingId(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Tutup' : 'Tambah FAQ'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleFAQSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Pertanyaan *</label>
            <input
              type="text"
              placeholder="Berapa lama proses pembuatan gerobak?"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Jawaban *</label>
            <textarea
              placeholder="Proses pembuatan gerobak memakan waktu..."
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Urutan (Order)</label>
            <input
              type="number"
              placeholder="0"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300">
              {editingId ? 'Update FAQ' : 'Simpan FAQ'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ question: '', answer: '', order: 0 });
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-semibold">
                      #{faq.order || index + 1}
                    </span>
                    <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && faqs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Belum ada FAQ. Klik "Tambah FAQ" untuk menambahkan.</p>
        </div>
      )}


    </div>
  );
}
