/**
 * Sitemap Change Logger & Updater
 * Tracks all sitemap changes with detailed logging
 */

// Store sitemap changes in memory (in production, this could be stored in database)
let sitemapChanges = [];

// Get current timestamp in readable format
const getTimestamp = () => {
  const now = new Date();
  return {
    iso: now.toISOString(),
    readable: now.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };
};

// Generate sitemap URL entry
export const generateSitemapEntry = (url, priority = 0.6, changefreq = 'monthly', imageUrl = null, title = null) => {
  let entry = `
  <url>
    <loc>https://gerobakjogja.vercel.app${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;
  
  if (imageUrl && title) {
    entry += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${title}</image:title>
    </image:image>`;
  }
  
  entry += `
  </url>`;
  
  return entry;
};

// Main logging function
export const logSitemapChange = (action, itemType, itemData) => {
  const timestamp = getTimestamp();
  const changeId = `${timestamp.iso}_${Math.random().toString(36).substring(2, 11)}`;
  
  let url, priority, changefreq, imageUrl, title;
  
  // Determine URL and metadata based on item type
  switch (itemType) {
    case 'product':
      url = `/produk/${itemData.slug || itemData.id}`;
      priority = 0.6;
      changefreq = 'monthly';
      imageUrl = itemData.images?.[0] || itemData.image;
      title = itemData.name;
      break;
      
    case 'blog':
      url = `/blog/${itemData.slug}`;
      priority = 0.6;
      changefreq = 'monthly';
      imageUrl = itemData.image;
      title = itemData.title;
      break;
      
    case 'gallery':
      url = `/galeri`;
      priority = 0.8;
      changefreq = 'weekly';
      imageUrl = itemData.url;
      title = itemData.title || 'Gallery Image';
      break;
      
    default:
      url = '/';
      priority = 0.5;
      changefreq = 'monthly';
  }
  
  const logEntry = {
    id: changeId,
    timestamp: timestamp,
    action: action, // 'added', 'updated', 'deleted'
    itemType: itemType,
    itemId: itemData.id,
    itemName: itemData.name || itemData.title || 'Unknown',
    url: url,
    priority: priority,
    changefreq: changefreq,
    imageUrl: imageUrl,
    sitemapEntry: action !== 'deleted' ? generateSitemapEntry(url, priority, changefreq, imageUrl, title) : null,
    metadata: {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      currentUrl: window.location.href
    }
  };
  
  // Add to changes array
  sitemapChanges.push(logEntry);
  
  return logEntry;
};

// Get all sitemap changes
export const getSitemapChanges = () => {
  return [...sitemapChanges];
};

// Get changes by type
export const getChangesByType = (type) => {
  return sitemapChanges.filter(change => change.itemType === type);
};

// Get changes by action
export const getChangesByAction = (action) => {
  return sitemapChanges.filter(change => change.action === action);
};

// Get recent changes (last N changes)
export const getRecentChanges = (limit = 10) => {
  return sitemapChanges
    .sort((a, b) => new Date(b.timestamp.iso) - new Date(a.timestamp.iso))
    .slice(0, limit);
};

// Clear all changes (for testing)
export const clearSitemapChanges = () => {
  const count = sitemapChanges.length;
  sitemapChanges = [];
  return count;
};

// Generate summary report
export const generateSitemapReport = () => {
  const total = sitemapChanges.length;
  const byType = {};
  const byAction = {};
  
  sitemapChanges.forEach(change => {
    byType[change.itemType] = (byType[change.itemType] || 0) + 1;
    byAction[change.action] = (byAction[change.action] || 0) + 1;
  });
  
  const report = {
    total,
    byType,
    byAction,
    recent: getRecentChanges(5),
    oldestChange: sitemapChanges.length > 0 ? sitemapChanges[0] : null,
    newestChange: sitemapChanges.length > 0 ? sitemapChanges[sitemapChanges.length - 1] : null
  };
  

  
  return report;
};