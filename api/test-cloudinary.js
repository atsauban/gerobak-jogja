/**
 * Test Vercel Function: Test Cloudinary Configuration
 * Check if Cloudinary is properly configured
 */

import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test Cloudinary connection
    const result = await cloudinary.api.ping();

    return res.status(200).json({
      success: true,
      message: 'Cloudinary configuration is working!',
      cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      pingResult: result,
      platform: 'vercel'
    });

  } catch (error) {
    console.error('❌ Cloudinary test error:', error);

    return res.status(500).json({
      success: false,
      error: error.message,
      cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      platform: 'vercel'
    });
  }
}