import api from './api';

const uploadService = {
  // Upload single file
  uploadFile: async (file, type = 'blogs', onProgress) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(
      `/upload?type=${type}`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );

    return response.data;
  },

  // Upload multiple files
  uploadMultipleFiles: async (files, type = 'blogs', onProgress) => {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });

    const response = await api.post(
      `/upload/multiple?type=${type}`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );

    return response.data;
  },

  // Upload blog cover image
  uploadBlogCover: async (file, onProgress) => {
    return uploadService.uploadFile(file, 'blogs', onProgress);
  },

  // Upload user avatar
  uploadAvatar: async (file, onProgress) => {
    return uploadService.uploadFile(file, 'avatars', onProgress);
  },

  // Upload organization logo
  uploadOrgLogo: async (file, onProgress) => {
    return uploadService.uploadFile(file, 'organizations', onProgress);
  },

  // Upload department image
  uploadDeptImage: async (file, onProgress) => {
    return uploadService.uploadFile(file, 'departments', onProgress);
  },

  // Delete uploaded file
  deleteFile: async (fileUrl) => {
    const response = await api.delete(
      `/upload`,
      {
        data: { fileUrl },
      }
    );

    return response.data;
  },

  // Validate file before upload
  validateFile: (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get file info from URL
  getFileInfo: (fileUrl) => {
    if (!fileUrl) return null;

    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const fileType = urlParts[urlParts.length - 2]; // blogs, avatars, etc.

    return {
      fileName,
      fileType,
      fullUrl: fileUrl,
    };
  },

  // Convert file to base64
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },

  // Create file preview URL
  createPreviewUrl: (file) => {
    return URL.createObjectURL(file);
  },

  // Revoke preview URL (cleanup)
  revokePreviewUrl: (url) => {
    URL.revokeObjectURL(url);
  },

  // Compress image before upload
  compressImage: async (file, options = {}) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
    } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            file.type,
            quality
          );
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
    });
  },

  // Get upload progress
  getUploadProgress: (loaded, total) => {
    return Math.round((loaded * 100) / total);
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Check if file is image
  isImage: (file) => {
    return file.type.startsWith('image/');
  },

  // Get image dimensions
  getImageDimensions: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
          });
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
    });
  },
};

export default uploadService;