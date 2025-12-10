/**
 * Audit Logging Utility
 * Track all admin actions for security and debugging
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Log an admin action
 * @param {Object} user - Current user object from Firebase Auth
 * @param {string} action - Action type: 'create', 'update', 'delete', 'login', 'logout'
 * @param {Object} details - Action details
 */
export async function logAction(user, action, details) {
  if (!user) {
    console.warn('Cannot log action: No user provided');
    return;
  }

  try {
    await addDoc(collection(db, 'audit_logs'), {
      // User info
      userEmail: user.email,
      userId: user.uid,
      
      // Action info
      action: action,
      collection: details.collection || 'unknown',
      documentId: details.id || null,
      documentName: details.name || null,
      
      // Additional details
      details: details,
      
      // Timestamp
      timestamp: serverTimestamp(),
      
      // Browser info (optional)
      userAgent: navigator.userAgent,
      
      // Note: IP address cannot be obtained on client-side
      // Use Firebase Functions for server-side logging if IP is needed
    });
  } catch (error) {
    console.error('Failed to log action:', error);
    // Don't throw error - logging failure shouldn't break the app
  }
}

/**
 * Log successful login
 */
export async function logLogin(user) {
  await logAction(user, 'login', {
    collection: 'auth',
    name: 'User logged in'
  });
}

/**
 * Log logout
 */
export async function logLogout(user) {
  await logAction(user, 'logout', {
    collection: 'auth',
    name: 'User logged out'
  });
}

/**
 * Log product actions
 */
export async function logProductAction(user, action, product) {
  await logAction(user, action, {
    collection: 'products',
    id: product.id || null,
    name: product.name || 'Unknown Product',
    category: product.category || 'Unknown Category',
    price: product.price || null  // Allow null instead of undefined
  });
}

/**
 * Log testimonial actions
 */
export async function logTestimonialAction(user, action, testimonial) {
  await logAction(user, action, {
    collection: 'testimonials',
    id: testimonial.id || null,
    name: testimonial.name || 'Unknown Testimonial'
  });
}

/**
 * Log blog actions
 */
export async function logBlogAction(user, action, post) {
  await logAction(user, action, {
    collection: 'blog',
    id: post.id || null,
    name: post.title || 'Unknown Post'
  });
}

/**
 * Log FAQ actions
 */
export async function logFAQAction(user, action, faq) {
  await logAction(user, action, {
    collection: 'faqs',
    id: faq.id || null,
    name: faq.question || 'Unknown Question'
  });
}

/**
 * Log gallery actions
 */
export async function logGalleryAction(user, action, image) {
  await logAction(user, action, {
    collection: 'gallery',
    id: image.id || null,
    name: image.title || 'Gallery image'
  });
}

export default {
  logAction,
  logLogin,
  logLogout,
  logProductAction,
  logTestimonialAction,
  logBlogAction,
  logFAQAction,
  logGalleryAction
};
