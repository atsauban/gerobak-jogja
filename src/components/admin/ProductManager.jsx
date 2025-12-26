import { useState } from 'react';
import { Plus, Edit, Trash2, X, Star, Eye, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import ImageUpload, { uploadToCloudinary } from '../ImageUpload';
import ProductCard from '../ProductCard';
import { sanitizeText, sanitizePrice, sanitizeUrl } from '../../utils/sanitize';
import { logProductAction } from '../../utils/auditLog';
import { logSitemapChange } from '../../utils/sitemapUpdater';
import { debouncedRegenerateSitemap } from '../../services/sitemapService';
import { handleError } from '../../utils/errorHandler';

export default function AdminProductManager({ showDeleteConfirmation }) {
    const { products, addProduct, updateProduct, deleteProduct, cancelCloudinaryDeletion } = useProducts();
    const { user } = useAuth();
    const toast = useToast();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        // category: '', // Removed
        price: '',
        shortDesc: '',
        description: '',
        badge: '',
        images: [], // Existing URLs
        pendingImages: [], // New File objects to upload
        specifications: {},
        features: [],
        includes: []
    });

    // Helper states for dynamic fields
    const [specKey, setSpecKey] = useState('');
    const [specValue, setSpecValue] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [includeInput, setIncludeInput] = useState('');


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Block submit if still cropping
        if (isCropping) {
            toast.warning('Tunggu proses crop selesai!');
            return;
        }

        // Validate images (existing + pending)
        const totalImages = (formData.images?.length || 0) + (formData.pendingImages?.length || 0);

        if (totalImages === 0) {
            toast.error('Minimal upload 1 gambar produk!');
            return;
        }

        setIsSaving(true);
        setUploadProgress(0);

        try {
            // Upload pending images to Cloudinary first
            let uploadedUrls = [];
            if (formData.pendingImages && formData.pendingImages.length > 0) {
                const totalFiles = formData.pendingImages.length;
                for (let i = 0; i < totalFiles; i++) {
                    const file = formData.pendingImages[i];
                    const url = await uploadToCloudinary(file, 'products', (progress) => {
                        const overallProgress = ((i / totalFiles) * 100) + (progress / totalFiles);
                        setUploadProgress(Math.round(overallProgress));
                    });
                    uploadedUrls.push(url);
                }
            }

            // Combine existing URLs with newly uploaded URLs
            const allImages = [...(formData.images || []), ...uploadedUrls];

            // Sanitize all inputs
            const productData = {
                name: sanitizeText(formData.name, 100),
                slug: formData.slug || generateSlug(formData.name),
                category: '', // Explicitly empty or removed
                price: sanitizePrice(formData.price),
                shortDesc: sanitizeText(formData.shortDesc, 200),
                description: sanitizeText(formData.description || formData.shortDesc, 2000),
                badge: sanitizeText(formData.badge, 50),
                images: allImages.map(url => sanitizeUrl(url)).filter(url => url),
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
                setIsSaving(false);
                return;
            }

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
                // category: '',
                price: '',
                shortDesc: '',
                description: '',
                badge: '',
                images: [],
                pendingImages: [],
                specifications: {},
                features: [],
                includes: []
            });
            setShowForm(false);

            toast.success('Produk berhasil disimpan!');
        } catch (error) {
            handleError(error, 'Gagal menyimpan produk. Silakan coba lagi.', toast);
        } finally {
            setIsSaving(false);
            setUploadProgress(0);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            slug: product.slug || generateSlug(product.name),
            // category: product.category,
            price: product.price,
            shortDesc: product.shortDesc || '',
            description: product.description || product.shortDesc || '',
            badge: product.badge || '',
            images: product.images || [],
            pendingImages: [],
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

        showDeleteConfirmation(
            'product',
            id,
            product.name,
            async () => {
                try {


                    // Delete product (Cloudinary deletion is delayed for undo support)
                    const result = await deleteProduct(id, { undoTimeout: 5000 });
                    const deletedProductId = result?.productId || id;

                    // Log delete action
                    await logProductAction(user, 'delete', {
                        id: id,
                        name: product.name,
                        // category: product.category
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
                                // Cancel pending Cloudinary deletion first
                                cancelCloudinaryDeletion(deletedProductId);

                                // Restore product - remove old id to create new one
                                // eslint-disable-next-line no-unused-vars
                                const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...productData } = product;
                                await addProduct(productData);

                                toast.success('Produk berhasil dikembalikan!');
                            } catch (error) {
                                toast.error('Gagal mengembalikan produk: ' + error.message);
                            }
                        }
                    });
                } catch (error) {
                    handleError(error, 'Gagal menghapus produk. Silakan coba lagi.', toast);
                }
            }
        );
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
        setIsCropping(false);
        setFormData({
            name: '',
            slug: '',
            // category: '',
            price: '',
            shortDesc: '',
            description: '',
            badge: '',
            images: [],
            pendingImages: [],
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

    return (
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
                            pendingImages: [],
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
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Tutup' : 'Tambah Produk'}
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
                            {/* Category input removed */}
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
                            onFilesChange={({ existingUrls, pendingFiles }) => {
                                setFormData(prev => ({ ...prev, images: existingUrls, pendingImages: pendingFiles }));
                            }}
                            onCroppingChange={setIsCropping}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={isSaving || isCropping}
                            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isCropping ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Menunggu crop...
                                </>
                            ) : isSaving ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Menyimpan...'}
                                </>
                            ) : (
                                editingId ? 'Update Produk' : 'Simpan Produk'
                            )}
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



            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Nama Produk</th>
                            {/* <th className="px-4 py-3 text-left">Kategori</th> */}
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
                                {/* <td className="px-4 py-3 capitalize">{product.category}</td> */}
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
                                            className={`p-2 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${product.featured
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
        </>
    );
}
