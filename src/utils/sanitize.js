/**
 * Input Sanitization Utilities
 * Protect against XSS and injection attacks
 */

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  if (!str) return '';
  
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return String(str).replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Sanitize user input for search queries
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export function sanitizeSearchInput(input) {
  if (!input) return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script tags and content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  const maxLength = 100;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitize email input
 * @param {string} email - Email input
 * @returns {string} Sanitized email
 */
export function sanitizeEmail(email) {
  if (!email) return '';
  
  // Remove whitespace
  let sanitized = email.trim().toLowerCase();
  
  // Basic email validation pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(sanitized)) {
    return '';
  }
  
  return sanitized;
}

/**
 * Sanitize phone number
 * @param {string} phone - Phone number input
 * @returns {string} Sanitized phone number
 */
export function sanitizePhone(phone) {
  if (!phone) return '';
  
  // Remove all non-numeric characters except +
  let sanitized = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with + or 0
  if (!sanitized.startsWith('+') && !sanitized.startsWith('0')) {
    sanitized = '+62' + sanitized;
  }
  
  return sanitized;
}

/**
 * Sanitize text input (names, messages, etc)
 * @param {string} text - Text input
 * @param {number} maxLength - Maximum length
 * @returns {string} Sanitized text
 */
export function sanitizeText(text, maxLength = 500) {
  if (!text) return '';
  
  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitize URL
 * @param {string} url - URL input
 * @returns {string} Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url) {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '';
    }
    
    return urlObj.href;
  } catch {
    return '';
  }
}

/**
 * Sanitize filename
 * @param {string} filename - Filename input
 * @returns {string} Sanitized filename
 */
export function sanitizeFilename(filename) {
  if (!filename) return '';
  
  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '');
  
  // Remove special characters except dots, dashes, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit length
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const ext = sanitized.split('.').pop();
    const name = sanitized.substring(0, maxLength - ext.length - 1);
    sanitized = `${name}.${ext}`;
  }
  
  return sanitized;
}

/**
 * Validate and sanitize price input
 * @param {string|number} price - Price input
 * @returns {number} Sanitized price or 0 if invalid
 */
export function sanitizePrice(price) {
  if (!price) return 0;
  
  // Convert to number
  const numPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[^\d.]/g, ''))
    : parseFloat(price);
  
  // Validate
  if (isNaN(numPrice) || numPrice < 0) {
    return 0;
  }
  
  // Round to 2 decimal places
  return Math.round(numPrice * 100) / 100;
}

/**
 * Sanitize integer input
 * @param {string|number} value - Integer input
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Sanitized integer
 */
export function sanitizeInteger(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (!value && value !== 0) return min;
  
  const numValue = typeof value === 'string' 
    ? parseInt(value.replace(/[^\d]/g, ''), 10)
    : parseInt(value, 10);
  
  if (isNaN(numValue)) return min;
  
  return Math.max(min, Math.min(max, numValue));
}

/**
 * Strip all HTML tags from string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export function stripHtml(html) {
  if (!html) return '';
  
  // Create a temporary div element
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  
  return tmp.textContent || tmp.innerText || '';
}

/**
 * Validate and sanitize date input
 * @param {string|Date} date - Date input
 * @returns {Date|null} Valid date or null
 */
export function sanitizeDate(date) {
  if (!date) return null;
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return null;
  }
  
  return dateObj;
}

/**
 * Rate limiting helper
 * Simple client-side rate limiting
 */
export class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    
    // Remove old requests outside time window
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    );
    
    // Check if under limit
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }
  
  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    );
    return Math.max(0, this.maxRequests - this.requests.length);
  }
  
  getTimeUntilReset() {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const resetTime = oldestRequest + this.timeWindow;
    
    return Math.max(0, resetTime - Date.now());
  }
}

export default {
  escapeHtml,
  sanitizeSearchInput,
  sanitizeEmail,
  sanitizePhone,
  sanitizeText,
  sanitizeUrl,
  sanitizeFilename,
  sanitizePrice,
  sanitizeInteger,
  stripHtml,
  sanitizeDate,
  RateLimiter
};
