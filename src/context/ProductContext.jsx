import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getProducts, 
  createProduct, 
  updateProduct as updateProductFirebase, 
  deleteProduct as deleteProductFirebase,
  deleteImageFromCloudinary
} from '../services/firebaseService';
import { debouncedRegenerateSitemap } from '../services/sitemapService';
import { logSitemapChange } from '../utils/sitemapUpdater';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products from Firebase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      
      // Filter out old localStorage products (ID is number or short string)
      const firebaseProducts = data.filter(product => {
        const id = product.id;
        // Keep only Firebase products (long string IDs)
        return typeof id === 'string' && id.length > 10;
      });
      
      setProducts(firebaseProducts);
      
      // Debug: Check if products have slugs
      console.log('📦 Loaded products:', firebaseProducts.length);
      firebaseProducts.forEach(product => {
        console.log(`📦 Product "${product.name}": slug="${product.slug}", id="${product.id}"`);
      });
      
      // Clear old localStorage data
      localStorage.removeItem('gerobak_products');
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    try {
      // Ensure images is always an array
      let images = product.images;
      if (!images || images.length === 0) {
        images = ['https://via.placeholder.com/800x600?text=No+Image'];
      } else if (typeof images === 'string') {
        images = [images];
      } else if (!Array.isArray(images)) {
        images = ['https://via.placeholder.com/800x600?text=No+Image'];
      }

      const newProduct = {
        name: product.name || '',
        slug: product.slug || '', // ✅ Added missing slug field
        category: product.category || '',
        price: product.price || '0',
        shortDesc: product.shortDesc || '',
        description: product.description || product.shortDesc || '',
        badge: product.badge || '',
        rating: 0,
        reviews: 0,
        images: images,
        specifications: product.specifications || {},
        features: product.features || [],
        includes: product.includes || []
      };
      
      const createdProduct = await createProduct(newProduct);
      setProducts([createdProduct, ...products]);
      
      // Log sitemap change
      logSitemapChange('added', 'product', createdProduct);
      
      // Regenerate sitemap when new product is added
      debouncedRegenerateSitemap();
      
      return createdProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      // Only process images if they are provided in the update
      let productData = { ...updatedProduct };
      
      if (updatedProduct.images !== undefined) {
        let images = updatedProduct.images;
        if (!images || images.length === 0) {
          images = ['https://via.placeholder.com/800x600?text=No+Image'];
        } else if (typeof images === 'string') {
          images = [images];
        } else if (!Array.isArray(images)) {
          images = ['https://via.placeholder.com/800x600?text=No+Image'];
        }
        productData.images = images;
      }

      await updateProductFirebase(id, productData);
      
      // Update local state - merge with existing product data
      const updatedProducts = products.map(p => 
        p.id === id ? { ...p, ...productData } : p
      );
      setProducts(updatedProducts);
      
      // Log sitemap change
      const updatedProductData = updatedProducts.find(p => p.id === id);
      logSitemapChange('updated', 'product', updatedProductData);
      
      // Regenerate sitemap when product is updated
      debouncedRegenerateSitemap();
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      // Find product to get images
      const product = products.find(p => p.id === id);
      
      // Log sitemap change before deletion
      if (product) {
        logSitemapChange('deleted', 'product', product);
      }
      
      // Delete images from Cloudinary
      if (product && product.images && Array.isArray(product.images)) {
        for (const imageUrl of product.images) {
          if (imageUrl && imageUrl.includes('cloudinary.com')) {
            await deleteImageFromCloudinary(imageUrl);
          }
        }
      }
      
      // Delete from Firebase
      await deleteProductFirebase(id);
      setProducts(products.filter(p => p.id !== id));
      
      // Regenerate sitemap when product is deleted
      debouncedRegenerateSitemap();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message);
      throw err;
    }
  };

  const getProductById = (id) => {
    // Try to match as string first (Firebase ID), then as number (localStorage ID)
    return products.find(p => p.id === id || p.id === parseInt(id) || String(p.id) === String(id));
  };

  const getProductBySlug = (slug) => {
    // First try to find by slug
    const productBySlug = products.find(p => p.slug === slug);
    if (productBySlug) return productBySlug;
    
    // Fallback: try to find by ID (for backward compatibility)
    return products.find(p => p.id === slug || String(p.id) === String(slug));
  };

  const getProductsByCategory = (category) => {
    if (category === 'semua') return products;
    return products.filter(p => p.category === category);
  };



  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductBySlug,
        getProductsByCategory,
        refreshProducts: loadProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
