# 🎨 Quick Design Guide - Gerobak Jogja

## 🚀 What's New?

Semua HIGH dan MEDIUM priority design improvements sudah diimplementasi!

---

## 📦 New Components

### 1. LazyImage - Optimized Image Loading
```jsx
import LazyImage from '../components/LazyImage';

<LazyImage
  src={product.image}
  alt="Product name"
  className="w-full h-64 object-cover"
/>
```
**Features:**
- ✨ Blur-to-clear transition
- 🎭 Animated placeholder
- ❌ Error fallback
- ⚡ Lazy loading

---

### 2. SearchBar - Real-time Search
```jsx
import SearchBar from '../components/SearchBar';

const [query, setQuery] = useState('');

<SearchBar
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Cari produk..."
/>
```
**Features:**
- 🔍 Search icon
- ❌ Clear button
- 🎯 Focus states
- 📱 Responsive

---

### 3. EmptyState - Better Empty UI
```jsx
import EmptyState from '../components/EmptyState';

<EmptyState
  type="products"  // or 'search', 'cart', 'gallery'
  title="Custom Title"
  description="Custom description"
  actionText="Action Button"
  actionLink="/link"
/>
```
**Types:**
- 📦 products
- 🔍 search
- 🛒 cart
- 🖼️ gallery

---

### 4. QuickViewModal - Product Preview
```jsx
import QuickViewModal from '../components/QuickViewModal';

const [product, setProduct] = useState(null);

<QuickViewModal
  product={product}
  onClose={() => setProduct(null)}
/>
```
**Features:**
- ⚡ Quick preview
- 🎬 Smooth animations
- 🚫 Body scroll lock
- 📱 Mobile optimized

---

### 5. Breadcrumbs - Navigation
```jsx
import Breadcrumbs from '../components/Breadcrumbs';

<Breadcrumbs
  items={[
    { label: 'Katalog', href: '/katalog' },
    { label: 'Product Name' }
  ]}
/>
```
**Features:**
- 🏠 Home icon
- ➡️ Chevron separators
- 🔗 Clickable links
- 📱 Horizontal scroll

---

### 6. LoadingSkeleton - Loading States
```jsx
import { 
  ProductCardSkeleton, 
  ProductGridSkeleton,
  TestimonialSkeleton,
  HeroSkeleton 
} from '../components/LoadingSkeleton';

{loading ? (
  <ProductGridSkeleton count={6} />
) : (
  // Your content
)}
```
**Available:**
- 📦 ProductCardSkeleton
- 🎯 ProductGridSkeleton
- 💬 TestimonialSkeleton
- 🎪 HeroSkeleton

---

## 🎨 Updated Pages

### Home Page (`src/pages/Home.jsx`)
**New Features:**
- ✅ Loading skeleton for featured products
- ✅ LazyImage for all images
- ✅ EmptyState when no featured products
- ✅ Featured badge on products
- ✅ Better mobile responsiveness

### Katalog Page (`src/pages/Katalog.jsx`)
**New Features:**
- ✅ SearchBar with real-time filtering
- ✅ Loading skeleton for products
- ✅ LazyImage for all images
- ✅ Quick view button on cards
- ✅ Image gallery indicator (dots)
- ✅ EmptyState for no results
- ✅ Result count display

### Product Detail (`src/pages/ProductDetail.jsx`)
**New Features:**
- ✅ Breadcrumbs navigation
- ✅ Loading skeleton
- ✅ LazyImage for main & thumbnails
- ✅ Better 404 page
- ✅ Animated back button

---

## 🎯 CSS Utilities Added

### Line Clamp (Text Truncation)
```jsx
<p className="line-clamp-2">
  Long text will be truncated to 2 lines with ellipsis...
</p>
```
**Available:**
- `line-clamp-1` - 1 line
- `line-clamp-2` - 2 lines
- `line-clamp-3` - 3 lines

### Focus States (Accessibility)
```jsx
<button className="focus:ring-4 focus:ring-primary-300">
  Button
</button>
```
**Colors:**
- `focus:ring-primary-300` - Primary buttons
- `focus:ring-green-300` - WhatsApp buttons
- `focus:ring-white/50` - White buttons

---

## 📱 Mobile Improvements

### Responsive Typography
```jsx
// Hero title
className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl"

// Section title
className="text-3xl sm:text-4xl md:text-5xl"

// Body text
className="text-base sm:text-lg md:text-xl"
```

### Responsive Spacing
```jsx
// Button gaps
className="gap-3 sm:gap-4"

// Padding
className="px-4 sm:px-6 lg:px-8"

// Grid columns
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🎬 Animations

### Existing Animations
```jsx
animate-fade-in      // Fade in
animate-slide-up     // Slide from bottom
animate-slide-down   // Slide from top
animate-scale-in     // Scale from small
animate-pulse-slow   // Slow pulse
```

### Staggered Animations
```jsx
{items.map((item, index) => (
  <div 
    key={item.id}
    className="animate-scale-in"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {/* Content */}
  </div>
))}
```

---

## 🎨 Design Patterns

### Product Card Pattern
```jsx
<div className="card overflow-hidden group">
  <div className="relative overflow-hidden">
    <LazyImage
      src={product.image}
      alt={product.name}
      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
    />
    
    {/* Quick View Button */}
    <button className="absolute top-4 left-4 opacity-0 group-hover:opacity-100">
      <Zap size={20} />
    </button>
    
    {/* Badge */}
    {product.badge && (
      <span className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full">
        {product.badge}
      </span>
    )}
  </div>
  
  <div className="p-6">
    <h3 className="text-xl font-bold line-clamp-1">{product.name}</h3>
    <p className="text-gray-600 line-clamp-2">{product.description}</p>
    {/* Actions */}
  </div>
</div>
```

### Loading Pattern
```jsx
const { products, loading } = useProducts();

{loading ? (
  <ProductGridSkeleton count={6} />
) : products.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
) : (
  <EmptyState type="products" />
)}
```

### Search Pattern
```jsx
const [searchQuery, setSearchQuery] = useState('');

const filteredProducts = useMemo(() => {
  if (!searchQuery.trim()) return products;
  
  const query = searchQuery.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );
}, [products, searchQuery]);

<SearchBar
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

{filteredProducts.length === 0 && (
  <EmptyState type="search" />
)}
```

---

## 🔧 Common Tasks

### Add Loading State to New Page
```jsx
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

const { data, loading } = useYourHook();

{loading && <ProductGridSkeleton count={6} />}
{!loading && /* Your content */}
```

### Add Search to New Page
```jsx
import SearchBar from '../components/SearchBar';
import { useState, useMemo } from 'react';

const [query, setQuery] = useState('');

const filtered = useMemo(() => {
  // Your filter logic
}, [data, query]);

<SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
```

### Add Empty State
```jsx
import EmptyState from '../components/EmptyState';

{items.length === 0 && (
  <EmptyState
    type="products"
    title="No Items"
    description="Description here"
  />
)}
```

### Use LazyImage
```jsx
import LazyImage from '../components/LazyImage';

// Replace all <img> with:
<LazyImage
  src={imageUrl}
  alt="Descriptive alt text"
  className="your-classes"
/>
```

---

## ✅ Checklist for New Features

When adding new features, make sure to include:

- [ ] Loading skeleton while data loads
- [ ] LazyImage for all images
- [ ] EmptyState when no data
- [ ] Search functionality (if applicable)
- [ ] Breadcrumbs for navigation
- [ ] Mobile responsive design
- [ ] Focus states for accessibility
- [ ] Error handling
- [ ] Smooth animations
- [ ] Line-clamp for long text

---

## 🎯 Performance Tips

1. **Always use LazyImage** instead of `<img>`
2. **Show loading skeletons** instead of blank screens
3. **Use useMemo** for expensive filtering/sorting
4. **Add staggered animations** for lists (max 0.1s delay)
5. **Optimize images** before uploading (WebP format)
6. **Use line-clamp** to prevent layout shifts

---

## 📚 Documentation

- Full details: `DESIGN_IMPROVEMENTS.md`
- Style guide: `STYLE_GUIDE.md`
- Main README: `README.md`

---

**Last Updated**: December 9, 2025
**Status**: ✅ Production Ready
