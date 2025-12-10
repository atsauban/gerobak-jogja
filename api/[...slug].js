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