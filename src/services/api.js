// API Service Layer
// Uncomment dan sesuaikan saat backend sudah ready

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function untuk handle response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Helper function untuk get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Products API
export const productAPI = {
  // Get all products
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get products by category
  getByCategory: async (category) => {
    try {
      const response = await fetch(`${API_URL}/products?category=${category}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Create new product (requires auth)
  create: async (productData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product (requires auth)
  update: async (id, productData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (requires auth)
  delete: async (id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Authentication API
export const authAPI = {
  // Login
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await handleResponse(response);
      
      // Store token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
};

// Image Upload API
export const uploadAPI = {
  // Upload single image
  uploadImage: async (file) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Upload multiple images
  uploadImages: async (files) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_URL}/upload/multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }
};

// Contact Form API
export const contactAPI = {
  // Submit contact form
  submit: async (formData) => {
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
};

// Orders API (Optional - untuk future development)
export const orderAPI = {
  // Create order
  create: async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get all orders (admin only)
  getAll: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Update order status (admin only)
  updateStatus: async (id, status) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

export default {
  products: productAPI,
  auth: authAPI,
  upload: uploadAPI,
  contact: contactAPI,
  orders: orderAPI
};
