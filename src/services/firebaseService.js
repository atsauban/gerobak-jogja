import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ==================== PRODUCTS ====================

// Get all products
export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get single product
export const getProduct = async (id) => {
  try {
    const docId = String(id);
    const docRef = doc(db, 'products', docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Sanitize data for Firestore (remove undefined, functions, etc)
const sanitizeData = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Skip undefined, null, or functions
    if (value === undefined || value === null || typeof value === 'function') {
      continue;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      sanitized[key] = value.filter(item => item !== undefined && item !== null);
    }
    // Handle objects (but not Date or Timestamp)
    else if (typeof value === 'object' && !(value instanceof Date)) {
      sanitized[key] = sanitizeData(value);
    }
    // Handle primitives
    else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Create product
export const createProduct = async (productData) => {
  try {
    const productsRef = collection(db, 'products');
    const cleanData = sanitizeData(productData);
    
    const docRef = await addDoc(productsRef, {
      ...cleanData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { id: docRef.id, ...cleanData };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const docId = String(id);
    const docRef = doc(db, 'products', docId);
    const cleanData = sanitizeData(productData);
    
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: new Date().toISOString()
    });
    
    return { id: docId, ...cleanData };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const docId = String(id);
    const docRef = doc(db, 'products', docId);
    await deleteDoc(docRef);
    return docId;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ==================== IMAGE UPLOAD ====================

// Upload image to Firebase Storage
export const uploadImage = async (file, folder = 'products') => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'products') => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadImage(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

// Delete image from Firebase Storage
export const deleteImage = async (imageUrl) => {
  try {
    // Extract path from URL
    const path = imageUrl.split('/o/')[1].split('?')[0];
    const decodedPath = decodeURIComponent(path);
    
    const storageRef = ref(storage, decodedPath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      console.warn('Not a Cloudinary URL, skipping delete');
      return false;
    }

    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL');
    }

    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');

    // Detect platform and use appropriate function
    const isVercel = window.location.hostname.includes('vercel.app');
    const isNetlify = window.location.hostname.includes('netlify.app') || 
                      window.location.port === '8888' ||
                      window.location.port === '8889' ||
                      window.location.hostname === 'localhost' && window.location.port !== '5173';
    
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Check if we have a supported environment
    if (!isVercel && !isNetlify && !isDevelopment) {
      console.warn('⚠️ Cloudinary auto-delete only works with Vercel, Netlify, or development');
      console.warn('📋 Public ID:', publicId);
      return false;
    }

    // Determine function endpoint
    let functionUrl;
    let platform;
    
    if (isVercel) {
      functionUrl = '/api/cloudinary-delete';
      platform = 'Vercel';
    } else if (isNetlify || isDevelopment) {
      functionUrl = '/.netlify/functions/cloudinary-delete';
      platform = 'Netlify';
    }

    console.log(`🔧 Using ${platform} function for Cloudinary delete`);
    console.log(`📡 Function URL: ${functionUrl}`);

    // Call appropriate function to delete from Cloudinary
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete from Cloudinary');
    }

    return true;
    
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error.message);
    // Don't throw error, just return false so Firebase delete can continue
    return false;
  }
};

// ==================== BLOG POSTS ====================

// Get all blog posts
export const getBlogPosts = async () => {
  try {
    const postsRef = collection(db, 'blogPosts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};

// Get single blog post
export const getBlogPost = async (id) => {
  try {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Blog post not found');
    }
  } catch (error) {
    console.error('Error getting blog post:', error);
    throw error;
  }
};

// Create blog post
export const createBlogPost = async (postData) => {
  try {
    const postsRef = collection(db, 'blogPosts');
    const docRef = await addDoc(postsRef, {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { id: docRef.id, ...postData };
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

// Update blog post
export const updateBlogPost = async (id, postData) => {
  try {
    const docRef = doc(db, 'blogPosts', id);
    await updateDoc(docRef, {
      ...postData,
      updatedAt: serverTimestamp()
    });
    
    return { id, ...postData };
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

// Delete blog post
export const deleteBlogPost = async (id) => {
  try {
    const docRef = doc(db, 'blogPosts', id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// ==================== TESTIMONIALS ====================

// Get all testimonials
export const getTestimonials = async () => {
  try {
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(testimonialsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting testimonials:', error);
    throw error;
  }
};

// Create testimonial
export const createTestimonial = async (testimonialData) => {
  try {
    const testimonialsRef = collection(db, 'testimonials');
    
    const cleanData = sanitizeData(testimonialData);
    
    const docRef = await addDoc(testimonialsRef, {
      ...cleanData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { id: docRef.id, ...cleanData };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

// Update testimonial
export const updateTestimonial = async (id, testimonialData) => {
  try {
    const docId = String(id);
    const docRef = doc(db, 'testimonials', docId);
    
    const cleanData = sanitizeData(testimonialData);
    
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: new Date().toISOString()
    });
    
    return { id: docId, ...cleanData };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

// Delete testimonial
export const deleteTestimonial = async (id) => {
  try {
    const docId = String(id);
    const docRef = doc(db, 'testimonials', docId);
    await deleteDoc(docRef);
    return docId;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

// ==================== FAQ ====================

// Get all FAQs
export const getFAQs = async () => {
  try {
    const faqsRef = collection(db, 'faqs');
    const q = query(faqsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting FAQs:', error);
    throw error;
  }
};

// Create FAQ
export const createFAQ = async (faqData) => {
  try {
    const faqsRef = collection(db, 'faqs');
    const cleanData = sanitizeData(faqData);
    
    const docRef = await addDoc(faqsRef, {
      ...cleanData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { id: docRef.id, ...cleanData };
  } catch (error) {
    console.error('Error creating FAQ:', error);
    throw error;
  }
};

// Update FAQ
export const updateFAQ = async (id, faqData) => {
  try {
    const docId = String(id);
    const docRef = doc(db, 'faqs', docId);
    const cleanData = sanitizeData(faqData);
    
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: new Date().toISOString()
    });
    
    return { id: docId, ...cleanData };
  } catch (error) {
    console.error('Error updating FAQ:', error);
    throw error;
  }
};

// Delete FAQ
export const deleteFAQ = async (id) => {
  try {
    const docId = String(id);
    const docRef = doc(db, 'faqs', docId);
    await deleteDoc(docRef);
    return docId;
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    throw error;
  }
};

// ==================== CONTACT MESSAGES ====================

// Save contact message
export const saveContactMessage = async (messageData) => {
  try {
    const messagesRef = collection(db, 'contactMessages');
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      createdAt: serverTimestamp(),
      read: false
    });
    
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error('Error saving contact message:', error);
    throw error;
  }
};

// Get all contact messages
export const getContactMessages = async () => {
  try {
    const messagesRef = collection(db, 'contactMessages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting contact messages:', error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (id) => {
  try {
    const docRef = doc(db, 'contactMessages', id);
    await updateDoc(docRef, {
      read: true,
      readAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// ==================== GALLERY ====================

// Get all gallery images
export const getGalleryImages = async () => {
  try {
    const galleryRef = collection(db, 'gallery');
    const q = query(galleryRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting gallery images:', error);
    throw error;
  }
};

// Create gallery image
export const createGalleryImage = async (imageData) => {
  try {
    const galleryRef = collection(db, 'gallery');
    const cleanData = sanitizeData(imageData);
    
    const docRef = await addDoc(galleryRef, {
      ...cleanData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { id: docRef.id, ...cleanData };
  } catch (error) {
    console.error('Error creating gallery image:', error);
    throw error;
  }
};

// Update gallery image
export const updateGalleryImage = async (id, imageData) => {
  try {
    const docId = String(id);
    const docRef = doc(db, 'gallery', docId);
    const cleanData = sanitizeData(imageData);
    
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: new Date().toISOString()
    });
    
    return { id: docId, ...cleanData };
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
};

// Delete gallery image
export const deleteGalleryImage = async (id) => {
  try {
    const docId = String(id);
    const docRef = doc(db, 'gallery', docId);
    await deleteDoc(docRef);
    return docId;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
};
