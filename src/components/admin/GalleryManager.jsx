import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Loader } from 'lucide-react';
import ImageUpload, { uploadToCloudinary } from '../ImageUpload';
import { useToast } from '../Toast';
import { logSitemapChange } from '../../utils/sitemapUpdater';
import { debouncedRegenerateSitemap } from '../../services/sitemapService';
import { handleError } from '../../utils/errorHandler';
import { sanitizeText, sanitizeUrl } from '../../utils/sanitize';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  deleteImageFromCloudinary
} from '../../services/firebaseService';

export default function GalleryManager({ showDeleteConfirmation }) {
  const toast = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    // category: 'aluminium', // Removed
    pendingImage: null // New file to upload
  });

  /* Categories removed */

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

    // Check if we have existing URL or pending image
    if (!formData.url && !formData.pendingImage) {
      toast.error('Upload gambar terlebih dahulu!');
      return;
    }

    setIsSaving(true);
    setUploadProgress(0);

    try {
      // Upload pending image to Cloudinary if exists
      let imageUrl = formData.url;
      if (formData.pendingImage) {
        imageUrl = await uploadToCloudinary(formData.pendingImage, 'gallery', (progress) => {
          setUploadProgress(Math.round(progress));
        });
      }

      // Sanitize all inputs
      const dataToSave = {
        url: sanitizeUrl(imageUrl),
        title: sanitizeText(formData.title, 100),
        // category: sanitizeText(formData.category, 50)
      };

      // Validate sanitized data
      if (!dataToSave.url || !dataToSave.title) {
        toast.error('Data tidak valid. Periksa input Anda.');
        setIsSaving(false);
        return;
      }

      let result;
      if (editingId) {
        await updateGalleryImage(editingId, dataToSave);
        result = { id: editingId, ...dataToSave };

        // Log sitemap change for updated gallery image
        logSitemapChange('updated', 'gallery', {
          id: editingId,
          title: dataToSave.title,
          url: dataToSave.url
        });
      } else {
        result = await createGalleryImage(dataToSave);

        // Log sitemap change for new gallery image
        logSitemapChange('added', 'gallery', {
          id: result.id || 'new',
          title: dataToSave.title,
          url: dataToSave.url
        });
      }

      // Regenerate sitemap when gallery is updated
      debouncedRegenerateSitemap();

      await loadImages();
      await loadImages();
      setFormData({ url: '', title: '', pendingImage: null });
      setShowForm(false);
      setEditingId(null);

      toast.success('Gambar berhasil disimpan!');
    } catch (error) {
      handleError(error, 'Gagal menyimpan gambar. Silakan coba lagi.', toast);
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (image) => {
    setFormData({
      url: image.url,
      title: image.title,
      // category: image.category,
      pendingImage: null
    });
    setEditingId(image.id);
    setShowForm(true);
  };

  // Store pending Cloudinary deletions for undo support
  const pendingCloudinaryDeletions = {};

  const handleDelete = (id) => {
    // Find the image to get its details
    const image = images.find(img => img.id === id);

    showDeleteConfirmation(
      'gallery',
      id,
      image?.title || 'gambar ini',
      async () => {
        try {
          // Delete from Firebase first
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

          // Schedule Cloudinary deletion after undo timeout
          if (image && image.url && image.url.includes('cloudinary.com')) {
            const timeoutId = setTimeout(async () => {
              try {
                await deleteImageFromCloudinary(image.url);
              } catch (err) {
                console.error('Error deleting Cloudinary image:', err);
              }
              delete pendingCloudinaryDeletions[id];
            }, 5500); // 5 seconds undo + 500ms buffer

            pendingCloudinaryDeletions[id] = { timeoutId, url: image.url };
          }

          toast.success('Gambar berhasil dihapus!', 5000, {
            onUndo: async () => {
              try {
                // Cancel pending Cloudinary deletion
                if (pendingCloudinaryDeletions[id]) {
                  clearTimeout(pendingCloudinaryDeletions[id].timeoutId);
                  delete pendingCloudinaryDeletions[id];
                }

                // Restore gallery image
                await createGalleryImage({
                  url: image.url,
                  title: image.title,
                  // category: image.category
                });

                await loadImages();
                toast.success('Gambar berhasil dikembalikan!');
              } catch (error) {
                toast.error('Gagal mengembalikan gambar: ' + error.message);
              }
            }
          });
        } catch (error) {
          handleError(error, 'Gagal menghapus gambar. Silakan coba lagi.', toast);
        }
      }
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ url: '', title: '', });
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
            setFormData({ url: '', title: '', });
            setEditingId(null);
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Tutup' : 'Tambah Gambar'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Upload Gambar *</label>
            <ImageUpload
              multiple={false}
              maxFiles={1}
              folder="gallery"
              enableCrop={false}
              currentImages={formData.url ? [formData.url] : []}
              onFilesChange={({ existingUrls, pendingFiles }) => {
                setFormData(prev => ({
                  ...prev,
                  url: existingUrls[0] || '',
                  pendingImage: pendingFiles[0] || null
                }));
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
            {/* Category input removed */}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Menyimpan...'}
                </>
              ) : (
                editingId ? 'Update Gambar' : 'Simpan Gambar'
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
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
              {/* Category badge removed */}
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
