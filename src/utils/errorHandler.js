/**
 * Error Handler Utility
 * Centralized error handling with user-friendly messages
 */

// Only log errors in development
const isDevelopment = import.meta.env.DEV;

/**
 * Handle error with user-friendly message
 * @param {Error} error - The error object
 * @param {string} userMessage - User-friendly error message
 * @param {Function} toast - Toast function (optional)
 * @returns {string} - Error message for further handling
 */
export const handleError = (error, userMessage = 'Terjadi kesalahan. Silakan coba lagi.', toast = null) => {
  // Log error only in development
  if (isDevelopment) {
    console.error('Error:', error);
  }

  // Show user-friendly message via toast if available
  if (toast && typeof toast.error === 'function') {
    toast.error(userMessage);
  }

  // Return error message for further handling
  return userMessage;
};

/**
 * Get user-friendly error message based on error type
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'Terjadi kesalahan yang tidak diketahui.';

  // Firebase errors
  if (error.code) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Email atau password salah.';
      case 'auth/user-not-found':
        return 'User tidak ditemukan.';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan. Silakan coba lagi nanti.';
      case 'auth/network-request-failed':
        return 'Koneksi internet bermasalah. Periksa koneksi Anda.';
      case 'permission-denied':
        return 'Anda tidak memiliki izin untuk melakukan aksi ini.';
      case 'unavailable':
        return 'Layanan sedang tidak tersedia. Silakan coba lagi nanti.';
      default:
        return error.message || 'Terjadi kesalahan. Silakan coba lagi.';
    }
  }

  // Network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return 'Koneksi internet bermasalah. Periksa koneksi Anda.';
  }

  // Generic error
  return error.message || 'Terjadi kesalahan. Silakan coba lagi.';
};

/**
 * Handle async errors with try-catch wrapper
 * @param {Function} asyncFn - Async function to execute
 * @param {string} errorMessage - User-friendly error message
 * @param {Function} toast - Toast function (optional)
 * @returns {Promise} - Result of async function
 */
export const handleAsyncError = async (asyncFn, errorMessage, toast = null) => {
  try {
    return await asyncFn();
  } catch (error) {
    const message = errorMessage || getErrorMessage(error);
    handleError(error, message, toast);
    throw error; // Re-throw for further handling if needed
  }
};

