const cloudinary = require('cloudinary').v2;

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Check environment variables
    let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    let apiKey = process.env.CLOUDINARY_API_KEY;
    let apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('🔍 Environment check:');
    console.log('  CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
    console.log('  CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
    console.log('  CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set' : '❌ Missing');

    // Fallback for local development (read from .env manually)
    if (!cloudName || !apiKey || !apiSecret) {
      console.log('⚠️ Environment variables not found, trying to load from .env file...');
      
      try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.resolve(__dirname, '../../.env');
        
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf8');
          const envLines = envContent.split('\n');
          
          envLines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
              const [key, ...valueParts] = trimmed.split('=');
              const value = valueParts.join('=').trim();
              
              if (key === 'CLOUDINARY_CLOUD_NAME') cloudName = value;
              if (key === 'CLOUDINARY_API_KEY') apiKey = value;
              if (key === 'CLOUDINARY_API_SECRET') apiSecret = value;
            }
          });
          
          console.log('✅ Loaded from .env file');
          console.log('  CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
          console.log('  CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
          console.log('  CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set' : '❌ Missing');
        }
      } catch (err) {
        console.error('Error loading .env file:', err.message);
      }
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false,
          error: 'Cloudinary credentials not configured',
          details: 'Missing environment variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Netlify environment variables or .env file'
        })
      };
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    const { publicId } = JSON.parse(event.body);

    if (!publicId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Public ID is required' })
      };
    }

    console.log('🗑️ Deleting from Cloudinary:', publicId);

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true // Also invalidate CDN cache
    });

    console.log('✅ Cloudinary delete result:', result);

    if (result.result === 'ok' || result.result === 'not found') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true, 
          result: result.result,
          message: result.result === 'ok' ? 'Image deleted successfully' : 'Image not found (already deleted)'
        })
      };
    } else {
      throw new Error(`Unexpected result: ${result.result}`);
    }

  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false,
        error: 'Failed to delete image from Cloudinary',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
