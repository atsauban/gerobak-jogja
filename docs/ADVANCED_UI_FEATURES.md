# 🎨 Advanced UI Features

Dokumentasi lengkap untuk fitur-fitur UI advanced yang baru diimplementasikan.

---

## ✨ Features Implemented

### 1. **Parallax Scrolling** ⭐⭐⭐
Efek depth dengan elemen bergerak berbeda kecepatan saat scroll.

### 2. **Glassmorphism** ⭐⭐⭐
Glass effect dengan backdrop blur untuk tampilan modern.

### 3. **Animated Background** ⭐⭐
Animated gradient blobs untuk hero section.

### 4. **Scroll Reveal Animations** ⭐⭐⭐
Elemen muncul dengan animasi saat scroll.

### 5. **3D Card Tilt Effect** ⭐⭐
Hover effect 3D pada product cards.

### 6. **Floating Action Button (FAB)** ⭐⭐
Quick access untuk WhatsApp & scroll to top.

### 7. **Progress Bar** ⭐
Reading progress indicator di top.

### 8. **Masonry Layout** ⭐⭐⭐
Pinterest-style layout untuk galeri.

### 9. **Gradient Borders** ⭐⭐
Animated gradient borders pada cards.

### 10. **Enhanced Animations** ⭐⭐
Blob, float, glow animations.

---

## 📦 New Components

### 1. FloatingActionButton
```jsx
import FloatingActionButton from '../components/FloatingActionButton';

// Auto-included in App.jsx
<FloatingActionButton />
```

**Features:**
- WhatsApp FAB dengan pulse effect
- Scroll to top FAB (muncul setelah scroll 300px)
- Tooltips on hover
- Smooth animations

---

### 2. ProgressBar
```jsx
import ProgressBar from '../components/ProgressBar';

// Auto-included in App.jsx
<ProgressBar />
```

**Features:**
- Shows reading progress
- Gradient color
- Fixed at top
- Smooth transition

---

### 3. ScrollReveal
```jsx
import ScrollReveal from '../components/ScrollReveal';

<ScrollReveal animation="fade-up" delay={100}>
  <div>Your content</div>
</ScrollReveal>
```

**Props:**
- `animation`: 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'zoom-out'
- `delay`: Delay in ms (default: 0)
- `duration`: Animation duration in ms (default: 600)
- `className`: Additional CSS classes

**Animations:**
- `fade-up` - Fade in from bottom
- `fade-down` - Fade in from top
- `fade-left` - Fade in from right
- `fade-right` - Fade in from left
- `zoom-in` - Scale up
- `zoom-out` - Scale down

---

### 4. AnimatedBackground
```jsx
import AnimatedBackground from '../components/AnimatedBackground';

<section className="relative">
  <AnimatedBackground />
  {/* Your content */}
</section>
```

**Features:**
- 3 animated gradient blobs
- Different animation delays
- Mix-blend-multiply for color mixing
- Blur effect

---

## 🎯 Custom Hooks

### 1. useParallax
```jsx
import { useParallax } from '../hooks/useParallax';

const offset = useParallax(0.5); // speed multiplier

<div style={{ transform: `translateY(${offset}px)` }}>
  Content moves slower than scroll
</div>
```

**Parameters:**
- `speed`: Multiplier for scroll speed (default: 0.5)
  - 0.5 = half speed (slower)
  - 1.0 = same speed
  - 2.0 = double speed (faster)

---

### 2. useScrollReveal
```jsx
import { useScrollReveal } from '../hooks/useScrollReveal';

const [ref, isVisible] = useScrollReveal({ 
  threshold: 0.1,
  once: true 
});

<div ref={ref} className={isVisible ? 'visible' : 'hidden'}>
  Content
</div>
```

**Options:**
- `threshold`: Visibility threshold (0-1, default: 0.1)
- `once`: Trigger only once (default: true)
- `rootMargin`: Margin around viewport (default: '0px')

---

## 🎨 CSS Classes

### Glassmorphism
```jsx
// Light glass
<div className="glass">
  Content with glass effect
</div>

// Dark glass
<div className="glass-dark">
  Content with dark glass effect
</div>
```

**Properties:**
- `background`: rgba with transparency
- `backdrop-filter`: blur(10px)
- `border`: subtle white border

---

### 3D Card Tilt
```jsx
<div className="card-3d">
  Hover for 3D tilt effect
</div>
```

**Effect:**
- Perspective: 1000px
- Rotate on hover: rotateX(2deg) rotateY(-2deg)
- Scale: 1.02

---

### Gradient Border
```jsx
<div className="gradient-border">
  Content with gradient border
</div>
```

**Effect:**
- Animated gradient border
- Purple to pink gradient
- 2px border width

---

## 🎬 Animations

### Blob Animation
```jsx
<div className="animate-blob">
  Morphing blob effect
</div>
```

**Effect:**
- Moves in organic pattern
- Scale changes
- 7s duration
- Infinite loop

---

### Float Animation
```jsx
<div className="animate-float">
  Floating up and down
</div>
```

**Effect:**
- Vertical movement
- 3s duration
- Ease-in-out
- Infinite loop

---

### Glow Animation
```jsx
<div className="animate-glow">
  Glowing effect
</div>
```

**Effect:**
- Box shadow animation
- Blue glow
- 2s duration
- Alternate direction

---

## 📐 Layout Improvements

### Masonry Layout (Gallery)
```jsx
<div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
  {images.map(image => (
    <div className="break-inside-avoid">
      <img src={image.url} />
    </div>
  ))}
</div>
```

**Features:**
- Pinterest-style layout
- Responsive columns
- No height calculation needed
- Natural flow

---

## 🎯 Usage Examples

### Hero Section with Parallax
```jsx
import { useParallax } from '../hooks/useParallax';
import AnimatedBackground from '../components/AnimatedBackground';

function Hero() {
  const offset = useParallax(0.5);

  return (
    <section className="relative">
      <AnimatedBackground />
      
      <div style={{ transform: `translateY(${offset * 0.3}px)` }}>
        <h1>Hero Title</h1>
      </div>
    </section>
  );
}
```

---

### Feature Cards with Scroll Reveal
```jsx
import ScrollReveal from '../components/ScrollReveal';

function Features() {
  const features = [...];

  return (
    <div className="grid grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <ScrollReveal 
          key={index}
          animation="zoom-in"
          delay={index * 100}
        >
          <div className="card-3d">
            {feature.content}
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
```

---

### Product Cards with 3D Effect
```jsx
<div className="card-3d overflow-hidden group">
  <img className="group-hover:scale-110 transition-transform" />
  <div className="p-6">
    <h3>Product Name</h3>
  </div>
</div>
```

---

### Stats with Glassmorphism
```jsx
<div className="glass rounded-2xl p-6 hover:bg-white/20 transition-all">
  <div className="animate-float">
    <Icon />
  </div>
  <CountUpNumber end={500} suffix="+" />
  <p>Label</p>
</div>
```

---

## 🎨 Color & Style Guide

### Gradient Combinations
```css
/* Blue gradient */
from-blue-500 to-blue-600

/* Purple gradient */
from-purple-500 to-purple-600

/* Green gradient */
from-green-500 to-green-600

/* Orange gradient */
from-orange-500 to-orange-600

/* Multi-color */
from-primary-600 via-primary-700 to-primary-900
```

---

### Glass Effect Variations
```jsx
// Light glass (for dark backgrounds)
className="bg-white/10 backdrop-blur-sm"

// Medium glass
className="bg-white/20 backdrop-blur-md"

// Strong glass
className="bg-white/30 backdrop-blur-lg"

// Dark glass (for light backgrounds)
className="bg-black/10 backdrop-blur-sm"
```

---

## ⚡ Performance Tips

### 1. Parallax
- Use `passive: true` for scroll listeners
- Limit parallax elements (max 3-5 per page)
- Use `transform` instead of `top/left`

### 2. Animations
- Use `will-change` for animated elements
- Prefer `transform` and `opacity`
- Avoid animating `width`, `height`, `margin`

### 3. Scroll Reveal
- Set `once: true` to prevent re-triggering
- Use appropriate threshold (0.1 - 0.3)
- Batch animations with delays

### 4. Images
- Use LazyImage component
- Optimize image sizes
- Use WebP format

---

## 🐛 Troubleshooting

### Parallax Not Working
**Problem**: Elements don't move on scroll

**Solution**:
```jsx
// Make sure hook is called
const offset = useParallax(0.5);

// Apply transform
style={{ transform: `translateY(${offset}px)` }}
```

---

### Scroll Reveal Not Triggering
**Problem**: Elements don't animate

**Solution**:
```jsx
// Lower threshold
<ScrollReveal threshold={0.1}>

// Check if element is in viewport
// Use browser dev tools to inspect
```

---

### Glass Effect Not Visible
**Problem**: Backdrop blur not showing

**Solution**:
```css
/* Ensure browser support */
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);

/* Check background has transparency */
background: rgba(255, 255, 255, 0.1);
```

---

### 3D Tilt Laggy
**Problem**: Hover effect is slow

**Solution**:
```css
/* Add will-change */
.card-3d {
  will-change: transform;
}

/* Reduce complexity */
/* Use simpler transforms */
```

---

## 📊 Browser Support

### Glassmorphism
- ✅ Chrome 76+
- ✅ Safari 9+
- ✅ Firefox 103+
- ⚠️ Edge 79+ (partial)

### CSS Columns (Masonry)
- ✅ All modern browsers
- ✅ IE 10+ (with prefix)

### Intersection Observer
- ✅ All modern browsers
- ⚠️ IE: Needs polyfill

---

## 🎯 Best Practices

### 1. Animation Performance
```jsx
// ✅ Good: Use transform
transform: translateY(10px)

// ❌ Bad: Use top
top: 10px
```

### 2. Scroll Listeners
```jsx
// ✅ Good: Passive listener
window.addEventListener('scroll', handler, { passive: true });

// ❌ Bad: Non-passive
window.addEventListener('scroll', handler);
```

### 3. Cleanup
```jsx
// ✅ Good: Cleanup in useEffect
useEffect(() => {
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);
```

### 4. Accessibility
```jsx
// ✅ Good: Respect prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📚 Related Documentation

- **Count-Up Animation**: [COUNTUP_ANIMATION.md](COUNTUP_ANIMATION.md)
- **Design Improvements**: [DESIGN_IMPROVEMENTS.md](DESIGN_IMPROVEMENTS.md)
- **Component Migration**: [COMPONENT_MIGRATION_GUIDE.md](COMPONENT_MIGRATION_GUIDE.md)

---

## ✅ Implementation Checklist

- [x] Parallax scrolling
- [x] Glassmorphism effects
- [x] Animated background
- [x] Scroll reveal animations
- [x] 3D card tilt
- [x] Floating action buttons
- [x] Progress bar
- [x] Masonry layout
- [x] Gradient borders
- [x] Enhanced animations

---

**Created**: December 9, 2025  
**Status**: ✅ Complete  
**Performance**: Optimized  
**Browser Support**: Modern browsers
