import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useToast } from './Toast';
import { logSitemapChange } from '../utils/sitemapUpdater';
import { debouncedRegenerateSitemap } from '../services/sitemapService';
import { handleError, getErrorMessage } from '../utils/errorHandler';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  deleteImageFromCloudinary
} from '../services/firebaseService';

export default function GalleryManager({ showDeleteConfirmation }) {
  const toast = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    category: 'aluminium'
  });

  const categories = [
    { id: 'aluminium', name: 'Aluminium' },
    { id: 'kayu', name: 'Kayu' },
    { id: 'stainless', name: 'Stainless Steel' },
    { id: 'kombinasi', name: 'Kombinasi' },
    { id: 'custom', name: 'Custom' }
  ];

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getGalleryImages();
      setImages(data);
    } catch (error) {
      handleError(error, 'Gagal memuat gambar galeri. Silakan refresh halaman.', toast);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.url) {
      toast.error('Upload gambar terlebih dahulu!');
      return;
    }

    try {
      let result;
      if (editingId) {
        await updateGalleryImage(editingId, formData);
        result = { id: editingId, ...formData };
        
        // Log sitemap change for updated gallery image
        logSitemapChange('updated', 'gallery', {
          id: editingId,
          title: formData.title,
          url: formData.url
        });
      } else {
        result = await createGalleryImage(formData);
        
        // Log sitemap change for new gallery image
        logSitemapChange('added', 'gallery', {
          id: result.id || 'new',
          title: formData.title,
          url: formData.url
        });
      }

      // Regenerate sitemap when gallery is updated
      debouncedRegenerateSitemap();

      await loadImages();
      setFormData({ url: '', title: '', category: 'aluminium' });
      setShowForm(false);
      setEditingId(null);
      
      toast.success('Gambar berhasil disimpan!');
    } catch (error) {
      handleError(error, 'Gagal menyimpan gambar. Silakan coba lagi.', toast);
    }
  };

  const handleEdit = (image) => {
    setFormData({
      url: image.url,
      title: image.title,
      category: image.category
    });
    setEditingId(image.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    // Find the image to get its details
    const image = images.find(img => img.id === id);
    
    showDeleteConfirmation(
      'gallery',
      id,
      image?.title || 'gambar ini',
      async () => {
        try {
          if (image && image.url) {
            // Delete from Cloudinary first
            await deleteImageFromCloudinary(image.url);
          }
          
          // Then delete from Firebase
          await deleteGalleryImage(id);
          
          // Log sitemap change for deleted gallery image
          if (image) {
            logSitemapChange('deleted', 'gallery', {
              id: id,
              title: image.title,
              url: image.url
            });
          }
          
          // Regenerate sitemap when gallery image is deleted
          debouncedRegenerateSitemap();
          
          await loadImages();
          toast.success('Gambar berhasil dihapus!');
        } catch (error) {
          handleError(error, 'Gagal menghapus gambar. Silakan coba lagi.', toast);
        }
      }
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ url: '', title: '', category: 'aluminium' });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Galeri</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ url: '', title: '', category: 'aluminium' });
            setEditingId(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Tutup' : 'Tambah Gambar'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-purple-50 border-2 border-purple-300 rounded-lg">
          <div className="mb-4 p-3 bg-purple-100 border border-purple-300 rounded">
            <p className="text-sm font-semibold text-purple-900">📸 Upload Gambar Galeri</p>
            <p className="text-xs text-purple-700">Gambar akan disimpan di folder: gerobak-jogja/gallery/</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Upload Gambar *</label>
            <ImageUpload
              multiple={false}
              maxFiles={1}
              folder="gallery"
              currentImages={formData.url ? [formData.url] : []}
              onUploadComplete={(url) => {
                const imageUrl = Array.isArray(url) ? url[0] : url;
                setFormData({ ...formData, url: imageUrl || '' });
              }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Judul Gambar *</label>
              <input
                type="text"
                placeholder="Gerobak Aluminium Premium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              {editingId ? 'Update Gambar' : 'Simpan Gambar'}
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                {categories.find(c => c.id === image.category)?.name}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{image.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(image)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 text-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="mx-auto mb-4 text-gray-400" size={64} />
          <p>Belum ada gambar di galeri. Klik "Tambah Gambar" untuk menambahkan.</p>
        </div>
      )}
    </div>
  );
}
