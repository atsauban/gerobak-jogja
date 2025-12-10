exports.handler = async (event, context) => {
  try {
    // Check if Cloudinary environment variables are set
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    const missing = [];
    if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
    if (!apiKey) missing.push('CLOUDINARY_API_KEY');
    if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');
    
    if (missing.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          platform: 'Netlify',
          error: 'Missing Cloudinary environment variables',
          missing: missing,
          message: 'Set the missing environment variables in Netlify dashboard',
          timestamp: new Date().toISOString()
        })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        platform: 'Netlify',
        message: 'Cloudinary configuration is valid!',
        cloudName: cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        platform: 'Netlify',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};