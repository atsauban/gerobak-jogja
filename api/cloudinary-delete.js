/**
 * Vercel Function: Delete Cloudinary Image
 * Compatible with Vercel deployment
 */

import { v2 as cloudinary } from 'cloudinary';

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
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'Public ID is required'
      });
    }

    console.log('🗑️ Vercel Function: Deleting Cloudinary image:', publicId);

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    console.log('✅ Vercel Function: Cloudinary deletion result:', result);

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully from Cloudinary via Vercel Function',
      result: result,
      publicId: publicId,
      platform: 'vercel'
    });

  } catch (error) {
    console.error('❌ Vercel Function: Cloudinary deletion error:', error);

    return res.status(500).json({
      success: false,
      error: error.message,
      platform: 'vercel'
    });
  }
}