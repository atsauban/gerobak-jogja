# Gerobak Jogja Backend

Backend API untuk website Gerobak Jogja.

## 🚀 Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Setup Environment

\`\`\`bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
\`\`\`

### 3. Start MongoDB

Pastikan MongoDB sudah running:
- Local: `mongod`
- Atlas: Gunakan connection string dari MongoDB Atlas

### 4. Run Server

\`\`\`bash
# Development
npm run dev

# Production
npm start
\`\`\`

Server akan berjalan di `http://localhost:5000`

## 📁 Project Structure

\`\`\`
backend/
├── config/
│   └── db.js              # Database connection
├── models/
│   ├── Product.js         # Product model
│   └── User.js            # User model
├── routes/
│   ├── products.js        # Product routes
│   ├── auth.js            # Authentication routes
│   └── upload.js          # File upload routes
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── upload.js          # Multer configuration
├── controllers/
│   ├── productController.js
│   └── authController.js
├── uploads/               # Uploaded files
├── scripts/
│   └── seed.js            # Database seeder
├── .env                   # Environment variables
├── .env.example           # Environment template
├── server.js              # Entry point
└── package.json
\`\`\`

## 🔌 API Endpoints

### Products

\`\`\`
GET    /api/products           # Get all products
GET    /api/products/:id       # Get single product
POST   /api/products           # Create product (auth required)
PUT    /api/products/:id       # Update product (auth required)
DELETE /api/products/:id       # Delete product (auth required)
\`\`\`

### Authentication

\`\`\`
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login
GET    /api/auth/me            # Get current user (auth required)
\`\`\`

### Upload

\`\`\`
POST   /api/upload             # Upload single image (auth required)
POST   /api/upload/multiple    # Upload multiple images (auth required)
\`\`\`

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication.

### Login

\`\`\`bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gerobakjogja.com",
  "password": "your_password"
}
\`\`\`

Response:
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@gerobakjogja.com",
    "name": "Admin"
  }
}
\`\`\`

### Protected Routes

Include token in Authorization header:

\`\`\`bash
Authorization: Bearer your_token_here
\`\`\`

## 📊 Database Schema

### Product

\`\`\`javascript
{
  name: String (required),
  category: String (required),
  price: String (required),
  shortDesc: String (required),
  description: String,
  badge: String,
  rating: Number (default: 0),
  reviews: Number (default: 0),
  images: [String],
  specifications: Object,
  features: [String],
  includes: [String],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### User

\`\`\`javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: 'user'),
  createdAt: Date
}
\`\`\`

## 🌱 Seeding Database

Untuk populate database dengan data awal:

\`\`\`bash
npm run seed
\`\`\`

## 🚀 Deployment

### Railway

1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables
4. Deploy

### Render

1. Create new Web Service
2. Connect repository
3. Set environment variables
4. Deploy

### Heroku

\`\`\`bash
heroku create gerobak-jogja-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
\`\`\`

## 📝 Environment Variables

\`\`\`env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com
\`\`\`

## 🔧 Development

### Create Admin User

\`\`\`bash
node scripts/createAdmin.js
\`\`\`

### Test API

\`\`\`bash
# Using curl
curl http://localhost:5000/api/products

# Using httpie
http GET http://localhost:5000/api/products
\`\`\`

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🆘 Troubleshooting

### MongoDB Connection Error

- Check if MongoDB is running
- Verify connection string
- Check network access in MongoDB Atlas

### CORS Error

- Add frontend URL to CORS_ORIGIN in .env
- Check CORS middleware configuration

### JWT Error

- Verify JWT_SECRET is set
- Check token expiration
- Ensure token is sent in Authorization header

## 📞 Support

Email: info@gerobakjogja.com
WhatsApp: +62 823-2722-0077
