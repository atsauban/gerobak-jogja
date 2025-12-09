import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';

// Cloudinary config - GRATIS tanpa kartu kredit!
const CLOUDINARY_UPLOAD_PRESET = 'gerobak_jogja'; // Nanti dibuat di Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dpjpj7l1y'; // Ganti dengan cloud name kamu

export default function ImageUpload({ 
  onUploadComplete, 
  multiple = false, 
  maxFiles = 5,
  currentImages = [],
  folder = 'products' // Default folder
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImages);
  const [error, setError] = useState('');

  const uploadToCloudinary = async (file) => {
    const targetFolder = `gerobak-jogja/${folder}`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', targetFolder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (!files.length) return;

    // Validate file count
    if (multiple && files.length > maxFiles) {
      setError(`Maksimal ${maxFiles} gambar`);
      return;
    }

    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidFiles = files.filter(f => f.size > maxSize);
    if (invalidFiles.length > 0) {
      setError('Ukuran file maksimal 5MB per gambar');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidTypes = files.filter(f => !validTypes.includes(f.type));
    if (invalidTypes.length > 0) {
      setError('Format file harus JPG, PNG, atau WebP');
      return;
    }

    setError('');
    setUploading(true);

    try {
      if (multiple) {
        // Upload multiple images
        const uploadPromises = files.map(file => uploadToCloudinary(file));
        const urls = await Promise.all(uploadPromises);
        setPreview([...preview, ...urls]);
        onUploadComplete([...preview, ...urls]);
      } else {
        // Upload single image
        const url = await uploadToCloudinary(files[0]);
        setPreview([url]);
        onUploadComplete(url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Gagal upload gambar. Pastikan sudah setup Cloudinary.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newPreview = preview.filter((_, i) => i !== index);
    setPreview(newPreview);
    onUploadComplete(multiple ? newPreview : '');
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <label className="flex-1 cursor-pointer">
          <div className={`
            border-2 border-dashed rounded-lg p-6 text-center
            transition-all duration-200
            ${uploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'}
          `}>
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 text-primary-600 animate-spin" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  <span className="text-primary-600 font-semibold">Klik untuk upload</span> atau drag & drop
                </p>
                <p className="text-xs text-gray-500">
                  {multiple ? `Maksimal ${maxFiles} gambar` : '1 gambar'} • JPG, PNG, WebP • Max 5MB
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Preview Images */}
      {preview.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            {multiple ? 'Gambar yang diupload:' : 'Preview:'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {preview.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           hover:bg-red-600"
                >
                  <X size={16} />
                </button>
                {index === 0 && multiple && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                    Utama
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {!preview.length && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Tips Upload Gambar:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Gunakan foto dengan pencahayaan yang baik</li>
                <li>Resolusi minimal 800x600 pixel</li>
                <li>Upload gratis via Cloudinary (auto-optimized)</li>
                {multiple && <li>Gambar pertama akan jadi foto utama</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
