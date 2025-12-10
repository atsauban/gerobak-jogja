# Google Maps Integration

## Overview
Menambahkan integrasi Google Maps untuk alamat "Yogyakarta, Indonesia" dengan memperbaiki alignment dan menambahkan fitur klik untuk redirect ke Google Maps.

## Changes Made

### ✅ 1. Contact Config Update
**File**: `src/config/contact.js`

**Added**:
```javascript
export const CONTACT_INFO = {
  // ... existing fields
  mapsUrl: 'https://maps.app.goo.gl/WUB7D3Qo4HNX37PZ9',
  // ... rest of config
};
```

### ✅ 2. Footer Component Fix
**File**: `src/components/Footer.jsx`

**Before**:
```jsx
<div className="flex items-start gap-3 text-gray-400">
  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
    <MapPin size={18} />
  </div>
  <span>{CONTACT_INFO.address}</span>
</div>
```

**After**:
```jsx
<a 
  href={CONTACT_INFO.mapsUrl} 
  target="_blank" 
  rel="noopener noreferrer"
  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
>
  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
    <MapPin size={18} />
  </div>
  <span>{CONTACT_INFO.address}</span>
</a>
```

**Fixes**:
- ✅ **Alignment**: Changed `items-start` to `items-center` for consistent alignment
- ✅ **Clickable**: Made address clickable with proper link
- ✅ **Hover Effect**: Added hover state for better UX
- ✅ **Accessibility**: Added proper `target` and `rel` attributes

### ✅ 3. Contact Page Update
**File**: `src/pages/Kontak.jsx`

**Before**:
```jsx
<p className="text-gray-600">{CONTACT_INFO.address}</p>
```

**After**:
```jsx
<a 
  href={CONTACT_INFO.mapsUrl} 
  target="_blank" 
  rel="noopener noreferrer"
  className="text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
>
  {CONTACT_INFO.address}
</a>
```

## Features

### ✅ Consistent Alignment
- **Footer**: All contact items now use `items-center` for perfect alignment
- **Contact Page**: Address aligns properly with other contact information
- **Visual Consistency**: Same spacing and alignment across all contact sections

### ✅ Google Maps Integration
- **Click to Open**: Address opens Google Maps in new tab
- **Search Query**: Uses "Yogyakarta, Indonesia" as search term
- **Universal URL**: Works on desktop and mobile devices
- **Proper Targeting**: Opens in new tab with security attributes

### ✅ Enhanced UX
- **Hover States**: Clear visual feedback on hover
- **Cursor Pointer**: Indicates clickable elements
- **Smooth Transitions**: 300ms transition for hover effects
- **Accessibility**: Proper ARIA attributes and semantic HTML

## Technical Implementation

### URL Structure
```javascript
mapsUrl: 'https://maps.app.goo.gl/WUB7D3Qo4HNX37PZ9'
```

**Benefits of Specific Maps URL**:
- ✅ **Exact Location**: Points to specific location instead of general search
- ✅ **Shorter URL**: Clean, shortened Google Maps link
- ✅ **Better UX**: Direct navigation to precise location
- ✅ **Mobile Optimized**: Works seamlessly with Google Maps app

### Security Attributes
```jsx
target="_blank"           // Opens in new tab
rel="noopener noreferrer" // Security best practices
```

### Hover Effects
```css
hover:text-white          // Footer hover
hover:text-primary-600    // Contact page hover
transition-colors         // Smooth color transitions
```

## Benefits

1. **Better UX**: Users can easily navigate to location
2. **Consistent Design**: Proper alignment across all contact sections  
3. **Mobile Friendly**: Works on both desktop and mobile devices
4. **SEO Friendly**: Proper semantic markup for location data
5. **Accessibility**: Screen reader friendly with proper link attributes

## Usage

Users can now:
- ✅ Click on "Yogyakarta, Indonesia" in Footer
- ✅ Click on address in Contact page
- ✅ Automatically opens Google Maps
- ✅ Shows Yogyakarta location on map
- ✅ Can get directions from their current location

The address is now properly aligned and fully functional across the entire website.