import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, X, LogOut, Star } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import GalleryManager from '../components/GalleryManager';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
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
      alert('Minimal upload 1 gambar produk!');
      return;
    }

    // Sanitize all inputs
    const productData = {
      name: sanitizeText(formData.name, 100),
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
      alert('Data tidak valid setelah sanitasi. Periksa input Anda.');
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
        } else {
          // LocalStorage ID (number) - create new instead
          alert('Produk ini dari localStorage. Akan dibuat sebagai produk baru di Firebase.');
          const newId = await addProduct(productData);
          
          // Log create action
          await logProductAction(user, 'create', { 
            id: newId, 
            ...productData 
          });
        }
        setEditingId(null);
      } else {
        const newId = await addProduct(productData);
        
        // Log create action
        await logProductAction(user, 'create', { 
          id: newId, 
          ...productData 
        });
      }
      
      setFormData({ 
        name: '', 
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
      alert('Produk berhasil disimpan!');
    } catch (error) {
      console.error('Full error:', error);
      alert('Gagal menyimpan produk: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
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

  const handleDelete = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (confirm(`Yakin ingin menghapus produk "${product.name}"?`)) {
      try {
        await deleteProduct(id);
        
        // Log delete action
        await logProductAction(user, 'delete', { 
          id: id, 
          name: product.name,
          category: product.category
        });
        
        alert('Produk berhasil dihapus!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Gagal menghapus produk: ' + error.message);
      }
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    const featuredCount = products.filter(p => p.featured).length;
    
    // Jika mau set featured tapi sudah ada 3
    if (!currentFeatured && featuredCount >= 3) {
      alert('Maksimal 3 produk unggulan! Hapus salah satu produk unggulan terlebih dahulu.');
      return;
    }

    try {
      await updateProduct(id, { featured: !currentFeatured });
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Gagal mengubah status unggulan: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ 
      name: '', 
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
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">🔐 Admin Login</h2>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gerobakjogja.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                disabled={loggingIn}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                disabled={loggingIn}
              />
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Kelola produk gerobak Anda</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Logged in as:</p>
              <p className="font-semibold text-gray-900">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">{products.length}</div>
            <div className="text-gray-600">Total Produk</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {products.filter(p => p.category === 'aluminium').length}
            </div>
            <div className="text-gray-600">Gerobak Aluminium</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {products.filter(p => p.category === 'kayu').length}
            </div>
            <div className="text-gray-600">Gerobak Kayu</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Kelola Produk</h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setFormData({ 
                  name: '', 
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
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? 'Tutup' : 'Tambah Produk'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nama Produk *</label>
                  <input
                    type="text"
                    placeholder="Gerobak Aluminium Premium"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
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
                <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                  {editingId ? 'Update Produk' : 'Simpan Produk'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
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

          <div className="overflow-x-auto">
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
                          className={`p-2 rounded-full transition-colors ${
                            product.featured 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-gray-300 hover:text-gray-400'
                          }`}
                          title={product.featured ? 'Hapus dari unggulan' : 'Jadikan unggulan'}
                        >
                          <Star size={20} fill={product.featured ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/produk/${product.id}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
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

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Belum ada produk. Klik "Tambah Produk" untuk menambahkan produk baru.</p>
            </div>
          )}
        </div>

        {/* Testimonials Management */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <TestimonialManager />
        </div>

        {/* Blog Management */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <BlogManager />
        </div>

        {/* FAQ Management */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <FAQManager />
        </div>

        {/* Gallery Management */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <GalleryManager />
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ Informasi</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Semua data disimpan di Firebase Cloud (produk, testimoni, blog, FAQ, galeri)</li>
            <li>• Perubahan akan langsung terlihat di website</li>
            <li>• Upload maksimal 5 gambar per produk, 1 gambar per galeri (max 5MB per file)</li>
            <li>• Gambar pertama produk akan menjadi foto utama</li>
            <li>• Format gambar: JPG, PNG, atau WebP</li>
            <li>• Testimoni dan galeri akan muncul di halaman utama</li>
            <li>• Blog posts bisa di-featured untuk tampil di home</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Testimonial Manager Component
function TestimonialManager() {
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

  const handleSubmit = async (e) => {
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
      alert('Gagal menyimpan testimoni: ' + error.message);
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

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus testimoni ini?')) {
      try {
        await deleteTestimonial(id);
        await loadTestimonials();
      } catch (error) {
        alert('Gagal menghapus testimoni: ' + error.message);
      }
    }
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
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
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
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              {editingId ? 'Update Testimoni' : 'Simpan Testimoni'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', business: '', rating: 5, text: '', image: '' });
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
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
function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const blogData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      date: new Date().toISOString().split('T')[0]
    };

    try {
      if (editingId) {
        await updateBlogPost(editingId, blogData);
      } else {
        await createBlogPost(blogData);
      }
      
      await loadBlogs();
      setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Tips', image: '', author: 'Admin Gerobak Jogja', readTime: '5 menit', featured: false });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      alert('Gagal menyimpan blog: ' + error.message);
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

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus blog ini?')) {
      try {
        await deleteBlogPost(id);
        await loadBlogs();
      } catch (error) {
        alert('Gagal menghapus blog: ' + error.message);
      }
    }
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
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
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
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              {editingId ? 'Update Blog' : 'Simpan Blog'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'Tips', image: '', author: 'Admin Gerobak Jogja', readTime: '5 menit', featured: false });
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
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
        <div className="overflow-x-auto">
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
                    {blog.featured && <span className="text-yellow-500">⭐</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-800"
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
function FAQManager() {
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

  const handleSubmit = async (e) => {
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
      alert('Gagal menyimpan FAQ: ' + error.message);
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

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus FAQ ini?')) {
      try {
        await deleteFAQ(id);
        await loadFAQs();
      } catch (error) {
        alert('Gagal menghapus FAQ: ' + error.message);
      }
    }
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
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
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
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              {editingId ? 'Update FAQ' : 'Simpan FAQ'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ question: '', answer: '', order: 0 });
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
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
