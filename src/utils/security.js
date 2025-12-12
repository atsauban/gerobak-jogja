/**
 * Security Utilities
 * Additional security measures for the application
 */

/**
 * Content Security Policy (CSP) configuration
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "https://unpkg.com", // For external libraries
    "https://cdn.jsdelivr.net"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS
    "https://fonts.googleapis.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
    "https://images.unsplash.com",
    "https://res.cloudinary.com",
    "https://ui-avatars.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'connect-src': [
    "'self'",
    "https://api.cloudinary.com",
    "https://*.firebaseio.com",
    "https://*.googleapis.com"
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader() {
  return Object.entries(CSP_CONFIG)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/**
 * XSS Protection utility
 */
export class XSSProtection {
  static patterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi
  ];

  static detect(input) {
    if (!input || typeof input !== 'string') return false;
    
    return this.patterns.some(pattern => pattern.test(input));
  }

  static sanitize(input) {
    if (!input || typeof input !== 'string') return '';
    
    let sanitized = input;
    
    // Remove dangerous patterns
    this.patterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Encode HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized;
  }
}

/**
 * CSRF Protection utility
 */
export class CSRFProtection {
  static generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static setToken() {
    const token = this.generateToken();
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  static getToken() {
    return sessionStorage.getItem('csrf_token');
  }

  static validateToken(token) {
    const storedToken = this.getToken();
    return storedToken && storedToken === token;
  }
}

/**
 * Input validation with security focus
 */
export class SecureValidator {
  static validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email) && !XSSProtection.detect(email);
  }

  static validatePhone(phone) {
    const pattern = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    return pattern.test(phone) && !XSSProtection.detect(phone);
  }

  static validateUrl(url) {
    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['http:', 'https:'];
      return allowedProtocols.includes(urlObj.protocol) && !XSSProtection.detect(url);
    } catch {
      return false;
    }
  }

  static validateFilename(filename) {
    const pattern = /^[a-zA-Z0-9._-]+$/;
    const maxLength = 255;
    return (
      filename.length <= maxLength &&
      pattern.test(filename) &&
      !filename.includes('..') &&
      !XSSProtection.detect(filename)
    );
  }
}

/**
 * File upload security
 */
export class FileUploadSecurity {
  static allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];

  static maxFileSize = 5 * 1024 * 1024; // 5MB

  static validateFile(file) {
    const errors = [];

    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push('File size too large');
    }

    // Check filename
    if (!SecureValidator.validateFilename(file.name)) {
      errors.push('Invalid filename');
    }

    // Check for double extensions
    const parts = file.name.split('.');
    if (parts.length > 2) {
      errors.push('Multiple file extensions not allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeFilename(filename) {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.+/g, '.')
      .substring(0, 255);
  }
}

/**
 * Session security
 */
export class SessionSecurity {
  static setSecureItem(key, value, expirationMinutes = 60) {
    const item = {
      value,
      timestamp: Date.now(),
      expiration: expirationMinutes * 60 * 1000
    };
    
    try {
      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to set secure item:', error);
    }
  }

  static getSecureItem(key) {
    try {
      const itemStr = sessionStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      // Check if expired
      if (now - item.timestamp > item.expiration) {
        sessionStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Failed to get secure item:', error);
      return null;
    }
  }

  static clearExpiredItems() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      this.getSecureItem(key); // This will auto-remove expired items
    });
  }
}

/**
 * API Security wrapper
 */
export class SecureAPI {
  static async request(url, options = {}) {
    const csrfToken = CSRFProtection.getToken();
    
    const secureOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        ...options.headers
      }
    };

    // Add request timestamp for replay attack prevention
    if (secureOptions.body && typeof secureOptions.body === 'object') {
      secureOptions.body.timestamp = Date.now();
    }

    try {
      const response = await fetch(url, secureOptions);
      
      // Check for security headers in response
      this.validateResponseHeaders(response);
      
      return response;
    } catch (error) {
      console.error('Secure API request failed:', error);
      throw error;
    }
  }

  static validateResponseHeaders(response) {
    const securityHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options', 
      'X-XSS-Protection'
    ];

    securityHeaders.forEach(header => {
      if (!response.headers.get(header)) {
        console.warn(`Missing security header: ${header}`);
      }
    });
  }
}

/**
 * Initialize security measures
 */
export function initializeSecurity() {
  // Set CSRF token
  CSRFProtection.setToken();
  
  // Clear expired session items
  SessionSecurity.clearExpiredItems();
  
  // Set up periodic cleanup
  setInterval(() => {
    SessionSecurity.clearExpiredItems();
  }, 5 * 60 * 1000); // Every 5 minutes

  // Log security initialization
  console.log('Security measures initialized');
}

export default {
  CSP_CONFIG,
  generateCSPHeader,
  XSSProtection,
  CSRFProtection,
  SecureValidator,
  FileUploadSecurity,
  SessionSecurity,
  SecureAPI,
  initializeSecurity
};