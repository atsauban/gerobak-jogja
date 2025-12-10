// Catch-all API function for handling non-existent API routes
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;
  const requestedPath = Array.isArray(slug) ? slug.join('/') : slug;

  // Check if request accepts HTML (browser request)
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  
  if (acceptsHtml) {
    // Redirect to main app's 404 page for browser requests
    res.setHeader('Location', '/404-redirect');
    return res.status(302).end();
  }

  // Return JSON for API requests
  return res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    message: `The API endpoint '/api/${requestedPath}' does not exist`,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      '/api/sitemap',
      '/api/regenerate-sitemap',
      '/api/cloudinary-delete',
      '/api/test-cloudinary',
      '/api/test'
    ]
  });
}