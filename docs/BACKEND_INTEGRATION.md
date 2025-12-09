# Backend Integration Guide

Panduan lengkap untuk mengintegrasikan backend dengan website Gerobak Jogja.

## 🎯 Pilihan Backend

### Option 1: Firebase (Recommended untuk MVP)
**Kelebihan:**
- Setup cepat dan mudah
- Gratis untuk usage kecil-menengah
- Real-time database
- Authentication built-in
- File storage included
- Hosting gratis

**Cocok untuk:**
- MVP dan prototype
- Budget terbatas
- Tidak perlu server management

### Option 2: Node.js + Express + MongoDB
**Kelebihan:**
- Full control
- Scalable
- Custom logic
- Bisa deploy di VPS/cloud

**Cocok untuk:**
- Production scale
- Custom requirements
- Team dengan backend developer

### Option 3: Supabase
**Kelebihan:**
- Open source alternative Firebase
- PostgreSQL database
- RESTful API auto-generated
- Authentication & storage

**Cocok untuk:**
- Modern stack
- SQL database preference
- Real-time features

---

## 🔥 Option 1: Firebase Integration

### Step 1: Setup Firebase Project

1. **Buat Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Nama project: "gerobak-jogja"
   - Enable Google Analytics (optional)

2. **Enable Services**
   - Firestore Database (untuk data produk)
   - Authentication (untuk admin login)
   - Storage (untuk upload gambar)
   - Hosting (untuk deploy website)

### Step 2: Install Firebase SDK

```bash
npm install firebase
```

### Step 3: Firebase Configuration

Buat file `src/config/firebase.js`:

\`\`\`javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
\`\`\`

### Step 4: Environment Variables

Buat file `.env`:

\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

### Step 5: Update ProductContext untuk Firebase

\`\`\`javascript
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Get all products
const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Add product
const addProduct = async (productData) => {
  const docRef = await addDoc(collection(db, 'products'), productData);
  return { id: docRef.id, ...productData };
};

// Update product
const updateProduct = async (id, productData) => {
  const productRef = doc(db, 'products', id);
  await updateDoc(productRef, productData);
};

// Delete product
const deleteProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id));
};
\`\`\`

### Step 6: Authentication

\`\`\`javascript
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

// Login
const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Logout
const logout = async () => {
  await signOut(auth);
};
\`\`\`

### Step 7: Image Upload

\`\`\`javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

const uploadImage = async (file, path) => {
  const storageRef = ref(storage, \`products/\${path}\`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
\`\`\`

---

## 🚀 Option 2: Node.js + Express + MongoDB

### Step 1: Backend Setup

Buat folder `backend/`:

\`\`\`bash
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer
npm install -D nodemon
\`\`\`

### Step 2: Server Structure

\`\`\`
backend/
├── config/
│   └── db.js
├── models/
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── products.js
│   └── auth.js
├── middleware/
│   └── auth.js
├── uploads/
└── server.js
\`\`\`

### Step 3: Database Connection

\`\`\`javascript
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
\`\`\`

### Step 4: Product Model

\`\`\`javascript
// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  shortDesc: { type: String, required: true },
  description: String,
  badge: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  images: [String],
  specifications: Object,
  features: [String],
  includes: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
\`\`\`

### Step 5: API Routes

\`\`\`javascript
// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (protected)
router.post('/', auth, async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
\`\`\`

### Step 6: Server.js

\`\`\`javascript
// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
\`\`\`

### Step 7: Frontend API Service

Buat `src/services/api.js`:

\`\`\`javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const productAPI = {
  getAll: async () => {
    const response = await fetch(\`\${API_URL}/products\`);
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(\`\${API_URL}/products/\${id}\`);
    return response.json();
  },
  
  create: async (data, token) => {
    const response = await fetch(\`\${API_URL}/products\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  update: async (id, data, token) => {
    const response = await fetch(\`\${API_URL}/products/\${id}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  delete: async (id, token) => {
    const response = await fetch(\`\${API_URL}/products/\${id}\`, {
      method: 'DELETE',
      headers: {
        'Authorization': \`Bearer \${token}\`
      }
    });
    return response.json();
  }
};
\`\`\`

---

## 📊 Database Schema

### Products Collection/Table

\`\`\`json
{
  "id": "string",
  "name": "string",
  "category": "aluminium|kayu|stainless|kombinasi",
  "price": "string",
  "shortDesc": "string",
  "description": "string",
  "badge": "string|null",
  "rating": "number",
  "reviews": "number",
  "images": ["string"],
  "specifications": {
    "key": "value"
  },
  "features": ["string"],
  "includes": ["string"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
\`\`\`

### Users Collection/Table

\`\`\`json
{
  "id": "string",
  "email": "string",
  "password": "string (hashed)",
  "name": "string",
  "role": "admin|user",
  "createdAt": "timestamp"
}
\`\`\`

### Orders Collection/Table (Optional)

\`\`\`json
{
  "id": "string",
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "productId": "string",
  "productName": "string",
  "quantity": "number",
  "totalPrice": "string",
  "status": "pending|processing|completed|cancelled",
  "notes": "string",
  "createdAt": "timestamp"
}
\`\`\`

---

## 🔐 Authentication Flow

### 1. Login
\`\`\`
User Input (email, password)
  ↓
Backend validates credentials
  ↓
Generate JWT token
  ↓
Return token to frontend
  ↓
Store token in localStorage
  ↓
Include token in API requests
\`\`\`

### 2. Protected Routes
\`\`\`javascript
// Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
\`\`\`

---

## 📤 Image Upload

### Using Multer (Node.js)

\`\`\`javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, \`\${Date.now()}-\${file.originalname}\`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: Images only!');
  }
});

// Route
router.post('/upload', auth, upload.single('image'), (req, res) => {
  res.json({ url: \`/uploads/\${req.file.filename}\` });
});
\`\`\`

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Deploy

### Backend Options

#### 1. Railway
- Free tier available
- Easy deployment
- Auto-deploy from GitHub

#### 2. Render
- Free tier available
- PostgreSQL included
- Auto-deploy

#### 3. Heroku
- Popular choice
- Add-ons available
- Easy scaling

#### 4. VPS (DigitalOcean, Linode)
- Full control
- More configuration needed
- Cost-effective for scale

---

## 📝 Migration Steps

### From LocalStorage to Backend

1. **Export current data**
\`\`\`javascript
const data = localStorage.getItem('gerobak_products');
console.log(data); // Copy this
\`\`\`

2. **Import to database**
   - Firebase: Use Firebase Console
   - MongoDB: Use MongoDB Compass or mongoimport
   - Supabase: Use SQL import

3. **Update ProductContext**
   - Replace localStorage calls with API calls
   - Add loading states
   - Add error handling

4. **Test thoroughly**
   - CRUD operations
   - Authentication
   - Image upload

---

## 🔧 Environment Variables

### Frontend (.env)
\`\`\`env
VITE_API_URL=https://your-backend.com/api
VITE_FIREBASE_API_KEY=your_key
# ... other Firebase config
\`\`\`

### Backend (.env)
\`\`\`env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gerobak
JWT_SECRET=your_secret_key_here
NODE_ENV=production
\`\`\`

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Supabase Docs](https://supabase.com/docs)
- [JWT.io](https://jwt.io/)

---

## 🆘 Troubleshooting

### CORS Issues
\`\`\`javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-domain.com'],
  credentials: true
}));
\`\`\`

### Connection Issues
- Check environment variables
- Verify database connection string
- Check firewall rules
- Verify API URL

### Authentication Issues
- Check token expiration
- Verify JWT secret
- Check token storage
- Verify middleware

---

## 📞 Need Help?

Contact: info@gerobakjogja.com
WhatsApp: +62 823-2722-0077
