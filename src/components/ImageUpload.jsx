import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader, CheckCircle } from 'lucide-react';
import { handleError, getErrorMessage } from '../utils/errorHandler';

// Get Cloudinary config from environment variables
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'gerobak_jogja';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpjpj7l1y';

export default function ImageUpload({ 
  onUploadComplete, 
  multiple = false, 
  maxFiles = 5,
  currentImages = [],
  folder = 'products'
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(currentImages);
  const [localPreview, setLocalPreview] = useState([]); // Local preview before upload
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const uploadToCloudinary = async (file, onProgress) => {
    const targetFolder = `gerobak-jogja/${folder}`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', targetFolder);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          if (onProgress) onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      // Store abort controller
      abortControllerRef.current = xhr;

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    });
  };

  const validateFiles = (files) => {
    const fileArray = Array.from(files);
    
    if (!fileArray.length) return { valid: false, error: 'Tidak ada file yang dipilih' };

    // Validate file count
    if (multiple && fileArray.length > maxFiles) {
      return { valid: false, error: `Maksimal ${maxFiles} gambar` };
    }

    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidFiles = fileArray.filter(f => f.size > maxSize);
    if (invalidFiles.length > 0) {
      return { valid: false, error: 'Ukuran file maksimal 5MB per gambar' };
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidTypes = fileArray.filter(f => !validTypes.includes(f.type));
    if (invalidTypes.length > 0) {
      return { valid: false, error: 'Format file harus JPG, PNG, atau WebP' };
    }

    return { valid: true, files: fileArray };
  };

  const createLocalPreview = (files) => {
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setLocalPreview(prev => [...prev, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files) => {
    const validation = validateFiles(files);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError('');
    const fileArray = validation.files;

    // Create local preview immediately
    createLocalPreview(fileArray);

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = fileArray.map((file, index) => {
        return uploadToCloudinary(file, (progress) => {
          // Calculate overall progress
          const overallProgress = ((index / fileArray.length) * 100) + (progress / fileArray.length);
          setUploadProgress(overallProgress);
        });
      });

      const urls = await Promise.all(uploadPromises);
      
      // Clear local preview and add uploaded URLs
      setLocalPreview([]);
      if (multiple) {
        setPreview(prev => [...prev, ...urls]);
        onUploadComplete([...preview, ...urls]);
      } else {
        setPreview([urls[0]]);
        onUploadComplete(urls[0]);
      }
      
      setUploadProgress(100);
      
      // Reset progress after a moment
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      setLocalPreview([]);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg || 'Gagal upload gambar. Pastikan sudah setup Cloudinary.');
      handleError(err, 'Gagal upload gambar. Silakan coba lagi.');
    } finally {
      setUploading(false);
      abortControllerRef.current = null;
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setUploading(false);
    setUploadProgress(0);
    setLocalPreview([]);
    setError('');
  };

  const removeImage = (index) => {
    const newPreview = preview.filter((_, i) => i !== index);
    setPreview(newPreview);
    onUploadComplete(multiple ? newPreview : '');
  };

  const allPreviews = [...preview, ...localPreview];

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="flex items-center gap-4">
        <label className="flex-1 cursor-pointer">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center
              transition-all duration-200
              ${isDragging 
                ? 'border-primary-500 bg-primary-50 scale-105' 
                : uploading 
                ? 'border-gray-300 bg-gray-50' 
                : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader className="w-8 h-8 text-primary-600 animate-spin" />
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={cancelUpload}
                  className="text-sm text-red-600 hover:text-red-700 mt-2"
                >
                  Batalkan
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className={`w-8 h-8 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} />
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
            ref={fileInputRef}
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <X size={16} />
          {error}
        </div>
      )}

      {/* Preview Images */}
      {allPreviews.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            {multiple ? 'Gambar yang diupload:' : 'Preview:'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allPreviews.map((url, index) => {
              const isLocal = index >= preview.length;
              return (
                <div key={index} className="relative group">
                  <div className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className={`w-full h-32 object-cover rounded-lg border-2 ${
                        isLocal ? 'border-yellow-400 opacity-75' : 'border-gray-200'
                      }`}
                    />
                    {isLocal && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                        <Loader className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                    {!isLocal && (
                      <div className="absolute top-2 left-2">
                        <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  {!isLocal && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-200
                               hover:bg-red-600"
                      aria-label="Hapus gambar"
                    >
                      <X size={16} />
                    </button>
                  )}
                  {index === 0 && multiple && !isLocal && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                      Utama
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      {!allPreviews.length && (
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
