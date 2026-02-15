import { useState } from 'react';
import { cn, formatFileSize, isValidFileSize, isValidFileType } from '../../utils/helpers';
import axios from 'axios';

const ImageUpload = ({
  onUpload,
  type = 'blogs',
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  currentImage,
  label,
  helperText,
  error,
  className,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    if (!isValidFileSize(file, maxSize)) {
      setUploadError(`File size must be less than ${formatFileSize(maxSize)}`);
      return;
    }

    // Validate file type
    if (!isValidFileType(file, allowedTypes)) {
      setUploadError('Invalid file type. Only images are allowed.');
      return;
    }

    // Clear errors
    setUploadError('');

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload?type=${type}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const imageUrl = response.data.data.url;
      if (onUpload) onUpload(imageUrl);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onUpload) onUpload(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        {!preview ? (
          <label
            className={cn(
              'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200',
              error || uploadError
                ? 'border-red-300 bg-red-50 hover:bg-red-100'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className={cn('w-10 h-10 mb-3', uploadError ? 'text-red-400' : 'text-gray-400')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to {formatFileSize(maxSize)}</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={allowedTypes.join(',')}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <svg
                className="animate-spin h-8 w-8 text-primary-600 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {(error || uploadError) && (
        <p className="mt-1.5 text-sm text-red-600">{error || uploadError}</p>
      )}

      {helperText && !error && !uploadError && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default ImageUpload;