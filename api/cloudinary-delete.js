/**
 * Vercel Function: Delete Cloudinary Image
 * Compatible with Vercel deployment
 */

import { v2 as cloudinary } from 'cloudinary';
import admin from 'firebase-admin';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed. Use POST.',
      allowedMethods: ['POST']
    });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid token',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!admin.apps.length) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        // Fallback for when basic env vars are used (safer for Vercel/Netlify UI)
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace literal \n or escaped \\n with actual newlines
            privateKey: process.env.FIREBASE_PRIVATE_KEY
              ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
              : undefined,
          }),
        });
      }
    }

    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if user is admin (email whitelist match)
    const adminEmails = [
      'abdullahatsauban@gmail.com',
      'gerobakjogja@gmail.com'
    ];

    if (!decodedToken.email_verified || !adminEmails.includes(decodedToken.email)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient permissions',
      });
    }

    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'Public ID is required'
      });
    }

    // Check environment variables first
    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('❌ Missing Cloudinary environment variables');
      return res.status(500).json({
        success: false,
        error: 'Missing Cloudinary environment variables',
        missing: {
          cloudName: !cloudName,
          apiKey: !apiKey,
          apiSecret: !apiSecret
        },
        help: 'Set VITE_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel dashboard',
        platform: 'vercel'
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully from Cloudinary via Vercel Function',
      result: result,
      publicId: publicId,
      platform: 'vercel'
    });

  } catch (error) {
    console.error('❌ Vercel Function: Cloudinary deletion error:', error);

    if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired token'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      platform: 'vercel'
    });
  }
}