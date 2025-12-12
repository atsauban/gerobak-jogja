/**
 * Security Hook for React Components
 */
import { useEffect, useCallback, useState } from 'react';
import { XSSProtection, CSRFProtection, SecureValidator, RateLimiter } from '../utils/security';

/**
 * Hook for XSS protection
 */
export function useXSSProtection() {
  const sanitizeInput = useCallback((input) => {
    return XSSProtection.sanitize(input);
  }, []);

  const detectXSS = useCallback((input) => {
    return XSSProtection.detect(input);
  }, []);

  return { sanitizeInput, detectXSS };
}

/**
 * Hook for CSRF protection
 */
export function useCSRFProtection() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const csrfToken = CSRFProtection.getToken() || CSRFProtection.setToken();
    setToken(csrfToken);
  }, []);

  const refreshToken = useCallback(() => {
    const newToken = CSRFProtection.setToken();
    setToken(newToken);
    return newToken;
  }, []);

  const validateToken = useCallback((tokenToValidate) => {
    return CSRFProtection.validateToken(tokenToValidate);
  }, []);

  return { token, refreshToken, validateToken };
}

/**
 * Hook for input validation
 */
export function useSecureValidation() {
  const validateEmail = useCallback((email) => {
    return SecureValidator.validateEmail(email);
  }, []);

  const validatePhone = useCallback((phone) => {
    return SecureValidator.validatePhone(phone);
  }, []);

  const validateUrl = useCallback((url) => {
    return SecureValidator.validateUrl(url);
  }, []);

  const validateFilename = useCallback((filename) => {
    return SecureValidator.validateFilename(filename);
  }, []);

  return {
    validateEmail,
    validatePhone,
    validateUrl,
    validateFilename
  };
}

/**
 * Hook for rate limiting
 */
export function useRateLimit(maxRequests = 10, timeWindow = 60000) {
  const [rateLimiter] = useState(() => new RateLimiter(maxRequests, timeWindow));
  const [canMakeRequest, setCanMakeRequest] = useState(true);
  const [remainingRequests, setRemainingRequests] = useState(maxRequests);

  const checkRateLimit = useCallback(() => {
    const canRequest = rateLimiter.canMakeRequest();
    const remaining = rateLimiter.getRemainingRequests();
    
    setCanMakeRequest(canRequest);
    setRemainingRequests(remaining);
    
    return canRequest;
  }, [rateLimiter]);

  const getRemainingTime = useCallback(() => {
    return rateLimiter.getTimeUntilReset();
  }, [rateLimiter]);

  return {
    canMakeRequest,
    remainingRequests,
    checkRateLimit,
    getRemainingTime
  };
}

/**
 * Hook for secure form handling
 */
export function useSecureForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { sanitizeInput, detectXSS } = useXSSProtection();
  const { token } = useCSRFProtection();
  const { checkRateLimit } = useRateLimit(5, 60000); // 5 requests per minute

  const setValue = useCallback((name, value) => {
    // Sanitize input
    const sanitizedValue = sanitizeInput(value);
    
    // Detect XSS attempts
    if (detectXSS(value)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Invalid input detected'
      }));
      return;
    }

    setValues(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, [sanitizeInput, detectXSS]);

  const validateField = useCallback((name, value, validator) => {
    if (validator && !validator(value)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Invalid input'
      }));
      return false;
    }
    return true;
  }, []);

  const handleSubmit = useCallback(async (onSubmit) => {
    // Check rate limit
    if (!checkRateLimit()) {
      setErrors({ general: 'Too many requests. Please wait before trying again.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Add CSRF token to form data
      const secureValues = {
        ...values,
        _token: token
      };

      await onSubmit(secureValues);
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  }, [values, token, checkRateLimit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    validateField,
    handleSubmit,
    reset
  };
}

/**
 * Hook for secure file upload
 */
export function useSecureFileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size too large (max 5MB)' };
    }

    // Check filename for security
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      return { isValid: false, error: 'Invalid filename' };
    }

    return { isValid: true };
  }, []);

  const uploadFile = useCallback(async (file, uploadFunction) => {
    setError(null);
    setUploadProgress(0);

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return null;
    }

    setIsUploading(true);

    try {
      const result = await uploadFunction(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadProgress(100);
      return result;
    } catch (err) {
      setError(err.message || 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [validateFile]);

  return {
    uploadProgress,
    isUploading,
    error,
    uploadFile,
    validateFile
  };
}

export default {
  useXSSProtection,
  useCSRFProtection,
  useSecureValidation,
  useRateLimit,
  useSecureForm,
  useSecureFileUpload
};