import { useState, useRef, useEffect } from 'react';
import { Upload, X, Crop } from 'lucide-react';
import ImageCropper from './ImageCropper';

// Get Cloudinary config from environment variables
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'gerobak_jogja';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpjpj7l1y';

// Export upload function for external use
export const uploadToCloudinary = async (file, folder = 'products', onProgress) => {
  const targetFolder = `gerobak-jogja/${folder}`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', targetFolder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
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

    xhr.addEventListener('error', () => reject(new Error('Network error')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

export default function ImageUpload({
  onFilesChange, // Changed from onUploadComplete - now returns File objects
  onCroppingChange, // Callback to notify parent when cropping is in progress
  multiple = false,
  maxFiles = 5,
  currentImages = [], // Existing URLs (for edit mode)
  folder = 'products',
  enableCrop = true,
  cropAspectRatio = 1
}) {
  // Store both existing URLs and new File objects
  const [existingUrls, setExistingUrls] = useState(currentImages.filter(img => typeof img === 'string'));
  const [pendingFiles, setPendingFiles] = useState([]); // New files to upload
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropQueue, setCropQueue] = useState([]);
  const [currentFileName, setCurrentFileName] = useState('');
  const fileInputRef = useRef(null);
  
  // Use refs to store callbacks to avoid stale closure
  const onFilesChangeRef = useRef(onFilesChange);
  onFilesChangeRef.current = onFilesChange;
  
  const onCroppingChangeRef = useRef(onCroppingChange);
  onCroppingChangeRef.current = onCroppingChange;

  // Notify parent when cropping state changes (for initial mount and when crop modal opens)
  const isCropping = cropImage !== null;
  useEffect(() => {
    if (onCroppingChangeRef.current) {
      onCroppingChangeRef.current(isCropping);
    }
  }, [isCropping]);

  // Sync state to parent whenever pendingFiles or existingUrls change
  useEffect(() => {
    if (onFilesChangeRef.current) {
      onFilesChangeRef.current({ existingUrls, pendingFiles });
    }
  }, [pendingFiles, existingUrls]);

  const validateFiles = (files) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return { valid: false, error: 'Tidak ada file yang dipilih' };
    
    const totalCount = existingUrls.length + pendingFiles.length + fileArray.length;
    if (multiple && totalCount > maxFiles) {
      return { valid: false, error: `Maksimal ${maxFiles} gambar` };
    }

    const maxSize = 5 * 1024 * 1024;
    const invalidFiles = fileArray.filter(f => f.size > maxSize);
    if (invalidFiles.length > 0) {
      return { valid: false, error: 'Ukuran file maksimal 5MB per gambar' };
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidTypes = fileArray.filter(f => !validTypes.includes(f.type));
    if (invalidTypes.length > 0) {
      return { valid: false, error: 'Format file harus JPG, PNG, atau WebP' };
    }

    return { valid: true, files: fileArray };
  };

  const handleFiles = async (files) => {
    const validation = validateFiles(files);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError('');
    const fileArray = validation.files;

    if (enableCrop && fileArray.length > 0) {
      setCropQueue(fileArray.slice(1));
      setCurrentFileName(fileArray[0].name);
      const reader = new FileReader();
      reader.onload = (e) => setCropImage(e.target.result);
      reader.readAsDataURL(fileArray[0]);
    } else {
      // No crop - add files directly
      const newPendingFiles = multiple ? [...pendingFiles, ...fileArray] : fileArray;
      setPendingFiles(newPendingFiles);
      if (onFilesChangeRef.current) {
        onFilesChangeRef.current({ existingUrls, pendingFiles: newPendingFiles });
      }
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    const fileName = currentFileName || `image-${Date.now()}.jpg`;
    const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' });
    
    // Calculate new files FIRST
    const newPendingFiles = multiple ? [...pendingFiles, croppedFile] : [croppedFile];
    
    // Notify parent BEFORE closing crop modal (so parent has data before isCropping becomes false)
    if (onFilesChangeRef.current) {
      onFilesChangeRef.current({ existingUrls, pendingFiles: newPendingFiles });
    }
    
    // Update local state
    setPendingFiles(newPendingFiles);
    
    // Process next file in queue OR close crop modal
    if (cropQueue.length > 0) {
      const nextFile = cropQueue[0];
      setCropQueue(cropQueue.slice(1));
      setCurrentFileName(nextFile.name);
      const reader = new FileReader();
      reader.onload = (e) => setCropImage(e.target.result);
      reader.readAsDataURL(nextFile);
    } else {
      // Close crop modal and notify parent cropping is done
      setCurrentFileName('');
      setCropImage(null);
      
      // Notify parent IMMEDIATELY that cropping is done (don't wait for useEffect)
      if (onCroppingChangeRef.current) {
        onCroppingChangeRef.current(false);
      }
    }
  };

  const handleCropCancel = () => {
    setCropImage(null);
    setCropQueue([]);
    setCurrentFileName('');
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
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

  const removeExistingUrl = (index) => {
    const newUrls = existingUrls.filter((_, i) => i !== index);
    setExistingUrls(newUrls);
    if (onFilesChangeRef.current) {
      onFilesChangeRef.current({ existingUrls: newUrls, pendingFiles });
    }
  };

  const removePendingFile = (index) => {
    const newFiles = pendingFiles.filter((_, i) => i !== index);
    setPendingFiles(newFiles);
    if (onFilesChangeRef.current) {
      onFilesChangeRef.current({ existingUrls, pendingFiles: newFiles });
    }
  };

  // Create preview URLs for pending files
  const pendingPreviews = pendingFiles.map(file => URL.createObjectURL(file));
  const totalImages = existingUrls.length + pendingFiles.length;

  return (
    <div className="space-y-4">
      {/* Image Cropper Modal */}
      {cropImage && (
        <ImageCropper
          imageSrc={cropImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={cropAspectRatio}
        />
      )}

      {/* Upload Area */}
      <label className="block cursor-pointer">
        <div
          className={`
            border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
            ${isDragging ? 'border-primary-500 bg-primary-50 scale-[1.02]' : 
              'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Upload className={`w-6 h-6 ${isDragging ? 'text-gray-900' : 'text-gray-400'}`} />
              {enableCrop && <Crop className={`w-5 h-5 ${isDragging ? 'text-gray-900' : 'text-gray-400'}`} />}
            </div>
            <p className="text-sm text-gray-600">
              <span className="text-gray-900 font-medium">Klik untuk upload</span> atau drag & drop
            </p>
            <p className="text-xs text-gray-400">
              {multiple ? `Maks ${maxFiles} gambar` : '1 gambar'} • JPG, PNG, WebP • Max 5MB
              {enableCrop && ' • Crop tersedia'}
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <X size={16} />
          {error}
        </div>
      )}

      {/* Preview Images */}
      {totalImages > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Gambar ({totalImages}):
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Existing URLs */}
            {existingUrls.map((url, index) => (
              <div key={`url-${index}`} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded">
                    Tersimpan
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingUrl(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Hapus gambar"
                >
                  <X size={14} />
                </button>
                {index === 0 && multiple && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-gray-900 text-white text-xs rounded">
                    Utama
                  </div>
                )}
              </div>
            ))}
            
            {/* Pending Files (local preview) */}
            {pendingPreviews.map((previewUrl, index) => (
              <div key={`file-${index}`} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-orange-300 bg-orange-50">
                  <img src={previewUrl} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded">
                    Baru
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removePendingFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Hapus gambar"
                >
                  <X size={14} />
                </button>
                {existingUrls.length === 0 && index === 0 && multiple && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-gray-900 text-white text-xs rounded">
                    Utama
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Gambar dengan label "Baru" akan diupload saat menyimpan produk.
          </p>
        </div>
      )}
    </div>
  );
}
