# 🔄 Component Migration Guide

Guide untuk migrate dari old patterns ke new components.

---

## 📸 Image Loading Migration

### Old Pattern ❌
```jsx
<img 
  src={product.image} 
  alt="Product" 
  className="w-full h-64 object-cover"
/>
```

### New Pattern ✅
```jsx
import LazyImage from '../components/LazyImage';

<LazyImage
  src={product.image}
  alt={`Gerobak ${product.name} - ${product.category}`}
  className="w-full h-64 object-cover"
/>
```

### Migration Steps:
1. Import `LazyImage` component
2. Replace all `<img>` tags with `<LazyImage>`
3. Update alt text to be more descriptive
4. Test loading behavior

**Benefits:**
- Automatic lazy loading
- Blur-to-clear transition
- Error handling
- Better performance

---

## 🔍 Search Implementation

### Old Pattern ❌
```jsx
// No search - users must scroll
<div className="grid">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### New Pattern ✅
```jsx
import SearchBar from '../components/SearchBar';
import { useState, useMemo } from 'react';

const [searchQuery, setSearchQuery] = useState('');

const filteredProducts = useMemo(() => {
  if (!searchQuery.trim()) return products;
  
  const query = searchQuery.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
}, [products, searchQuery]);

<SearchBar
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Cari produk..."
/>

<div className="grid">
  {filteredProducts.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### Migration Steps:
1. Import `SearchBar` and hooks
2. Add `searchQuery` state
3. Create `filteredProducts` with `useMemo`
4. Add `SearchBar` component
5. Use `filteredProducts` instead of `products`

**Benefits:**
- Real-time filtering
- Better UX
- Performance optimized with useMemo

---

## 💀 Loading States Migration

### Old Pattern ❌
```jsx
const { products, loading } = useProducts();

{loading && <p>Loading...</p>}
{!loading && products.map(...)}
```

### New Pattern ✅
```jsx
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

const { products, loading } = useProducts();

{loading && <ProductGridSkeleton count={6} />}
{!loading && products.map(...)}
```

### Migration Steps:
1. Import appropriate skeleton component
2. Replace loading text with skeleton
3. Set appropriate `count` prop
4. Test loading behavior

**Available Skeletons:**
- `ProductCardSkeleton` - Single card
- `ProductGridSkeleton` - Grid of cards
- `TestimonialSkeleton` - Testimonial card
- `HeroSkeleton` - Hero section

**Benefits:**
- Professional appearance
- Maintains layout
- Reduces perceived wait time

---

## 🚫 Empty States Migration

### Old Pattern ❌
```jsx
{products.length === 0 && (
  <div className="text-center py-12">
    <p className="text-gray-500">No products found</p>
  </div>
)}
```

### New Pattern ✅
```jsx
import EmptyState from '../components/EmptyState';

{products.length === 0 && (
  <EmptyState
    type="products"
    title="Belum Ada Produk"
    description="Produk akan muncul di sini setelah ditambahkan"
    actionText="Tambah Produk"
    actionLink="/admin"
  />
)}
```

### Migration Steps:
1. Import `EmptyState` component
2. Replace empty div with `EmptyState`
3. Choose appropriate `type`
4. Customize title, description, action

**Available Types:**
- `products` - For product lists
- `search` - For search results
- `cart` - For shopping cart
- `gallery` - For image galleries

**Benefits:**
- Consistent design
- Visual feedback
- Clear actions

---

## 🧭 Breadcrumbs Migration

### Old Pattern ❌
```jsx
<div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
  <Link to="/" className="hover:text-primary-600">Beranda</Link>
  <span>/</span>
  <Link to="/katalog" className="hover:text-primary-600">Katalog</Link>
  <span>/</span>
  <span className="text-gray-900 font-medium">{product.name}</span>
</div>
```

### New Pattern ✅
```jsx
import Breadcrumbs from '../components/Breadcrumbs';

<Breadcrumbs
  items={[
    { label: 'Katalog', href: '/katalog' },
    { label: product.name }
  ]}
/>
```

### Migration Steps:
1. Import `Breadcrumbs` component
2. Replace manual breadcrumb HTML
3. Pass items array
4. Last item should not have `href`

**Benefits:**
- Reusable
- Consistent styling
- Home icon included
- Responsive

---

## ⚡ Quick View Modal

### Old Pattern ❌
```jsx
// No quick view - must navigate to detail page
<Link to={`/produk/${product.id}`}>
  View Details
</Link>
```

### New Pattern ✅
```jsx
import QuickViewModal from '../components/QuickViewModal';
import { useState } from 'react';

const [quickViewProduct, setQuickViewProduct] = useState(null);

// In product card
<button onClick={() => setQuickViewProduct(product)}>
  <Zap size={20} />
</button>

// At end of component
{quickViewProduct && (
  <QuickViewModal
    product={quickViewProduct}
    onClose={() => setQuickViewProduct(null)}
  />
)}
```

### Migration Steps:
1. Import `QuickViewModal` and `useState`
2. Add state for selected product
3. Add quick view button to cards
4. Add modal at end of component
5. Test open/close behavior

**Benefits:**
- Preview without navigation
- Better UX
- Reduced clicks

---

## 📱 Mobile Responsiveness

### Old Pattern ❌
```jsx
<h1 className="text-4xl font-bold">
  Title
</h1>

<div className="flex gap-4">
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

### New Pattern ✅
```jsx
<h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold">
  Title
</h1>

<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

### Migration Steps:
1. Add responsive text sizes
2. Add responsive flex direction
3. Add responsive spacing
4. Test on mobile devices

**Responsive Patterns:**
```jsx
// Typography
text-3xl sm:text-4xl md:text-6xl lg:text-7xl

// Spacing
gap-3 sm:gap-4
px-4 sm:px-6 lg:px-8
py-3 sm:py-4

// Layout
flex-col sm:flex-row
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🎨 Text Truncation

### Old Pattern ❌
```jsx
<p className="text-gray-600">
  {product.description}
</p>
// Text overflows or wraps too much
```

### New Pattern ✅
```jsx
<p className="text-gray-600 line-clamp-2">
  {product.description}
</p>
```

### Migration Steps:
1. Add `line-clamp-1`, `line-clamp-2`, or `line-clamp-3`
2. Test with long text
3. Adjust number as needed

**Available:**
- `line-clamp-1` - 1 line with ellipsis
- `line-clamp-2` - 2 lines with ellipsis
- `line-clamp-3` - 3 lines with ellipsis

---

## ♿ Accessibility

### Old Pattern ❌
```jsx
<button className="btn-primary">
  <Eye size={20} />
</button>

<img src={url} alt="Product" />
```

### New Pattern ✅
```jsx
<button 
  className="btn-primary focus:ring-4 focus:ring-primary-300"
  aria-label="View product details"
>
  <Eye size={20} />
</button>

<LazyImage 
  src={url} 
  alt={`Gerobak ${product.name} - ${product.category}`}
/>
```

### Migration Steps:
1. Add `focus:ring-4` to all buttons
2. Add `aria-label` to icon-only buttons
3. Make alt text descriptive
4. Test keyboard navigation

**Focus Ring Colors:**
- `focus:ring-primary-300` - Primary buttons
- `focus:ring-green-300` - WhatsApp buttons
- `focus:ring-white/50` - White buttons

---

## 🔄 Complete Page Migration Example

### Before ❌
```jsx
export default function ProductList() {
  const { products, loading } = useProducts();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {products.length === 0 ? (
        <p>No products</p>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="card">
              <img src={product.image} alt="Product" />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### After ✅
```jsx
import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LazyImage from '../components/LazyImage';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

export default function ProductList() {
  const { products, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  return (
    <div>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Cari produk..."
      />

      {loading && <ProductGridSkeleton count={6} />}

      {!loading && filteredProducts.length === 0 && (
        <EmptyState
          type={searchQuery ? 'search' : 'products'}
          title={searchQuery ? 'Tidak Ada Hasil' : 'Belum Ada Produk'}
          description={searchQuery ? 'Coba kata kunci lain' : 'Produk akan muncul di sini'}
        />
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="card overflow-hidden group">
              <LazyImage
                src={product.image}
                alt={`${product.name} - ${product.category}`}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Migration Checklist

When migrating a page, check off these items:

### Images
- [ ] Replace `<img>` with `<LazyImage>`
- [ ] Update alt text to be descriptive
- [ ] Test loading behavior

### Loading States
- [ ] Import appropriate skeleton
- [ ] Replace loading text with skeleton
- [ ] Test loading behavior

### Empty States
- [ ] Import `EmptyState` component
- [ ] Replace empty divs
- [ ] Choose appropriate type
- [ ] Add action buttons

### Search (if applicable)
- [ ] Import `SearchBar`
- [ ] Add search state
- [ ] Create filtered data with useMemo
- [ ] Add SearchBar component
- [ ] Update empty state for search

### Navigation
- [ ] Replace manual breadcrumbs with component
- [ ] Add breadcrumbs to detail pages

### Mobile
- [ ] Add responsive text sizes
- [ ] Add responsive spacing
- [ ] Add responsive layout
- [ ] Test on mobile devices

### Accessibility
- [ ] Add focus rings to buttons
- [ ] Add aria-labels to icon buttons
- [ ] Make alt text descriptive
- [ ] Test keyboard navigation

### Text
- [ ] Add line-clamp where needed
- [ ] Test with long text

---

## 🚀 Testing After Migration

1. **Visual Testing**
   - Check loading states
   - Check empty states
   - Check image loading
   - Check responsive design

2. **Functional Testing**
   - Test search functionality
   - Test quick view modal
   - Test breadcrumb navigation
   - Test keyboard navigation

3. **Performance Testing**
   - Check image lazy loading
   - Check useMemo optimization
   - Check animation performance

4. **Accessibility Testing**
   - Test with keyboard only
   - Check focus indicators
   - Verify ARIA labels
   - Test with screen reader

---

## 📚 Resources

- **Quick Guide**: `QUICK_DESIGN_GUIDE.md`
- **Full Details**: `DESIGN_IMPROVEMENTS.md`
- **Comparison**: `BEFORE_AFTER_COMPARISON.md`
- **Style Guide**: `STYLE_GUIDE.md`

---

**Need Help?** Check the component source code in `src/components/` for implementation details.
