# 🔢 Count-Up Animation

Animated counter untuk statistik di homepage.

---

## ✨ Features

- ⚡ Smooth count-up animation
- 👁️ Intersection Observer (animasi mulai saat terlihat)
- 🎨 Easing function untuk animasi natural
- 🔢 Format angka dengan locale (1,000 → 1.000)
- ⚙️ Customizable duration & suffix
- 📱 Performance optimized

---

## 🎯 Usage

### Basic Usage

```jsx
import CountUpNumber from '../components/CountUpNumber';

<CountUpNumber
  end={500}
  suffix="+"
  duration={2000}
  className="text-4xl font-bold"
/>
```

### With Stats

```jsx
const stats = [
  { value: 100, suffix: '+', label: 'Pelanggan Puas', duration: 2000 },
  { value: 10, suffix: '+', label: 'Tahun Pengalaman', duration: 1500 },
  { value: 100, suffix: '+', label: 'Gerobak Terjual', duration: 2500 },
];

{stats.map((stat, index) => (
  <div key={index}>
    <CountUpNumber
      end={stat.value}
      suffix={stat.suffix}
      duration={stat.duration}
    />
    <p>{stat.label}</p>
  </div>
))}
```

---

## 📋 Props

### CountUpNumber Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `end` | number | required | Target number to count to |
| `suffix` | string | `''` | Text to append after number (e.g., '+', '%', 'K') |
| `duration` | number | `2000` | Animation duration in milliseconds |
| `className` | string | `''` | CSS classes for styling |

---

## 🔧 How It Works

### 1. Intersection Observer
```javascript
// Detects when element is visible in viewport
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true); // Start animation
    }
  },
  { threshold: 0.3 } // Trigger at 30% visibility
);
```

### 2. Count-Up Hook
```javascript
// Custom hook with easing function
export function useCountUp(end, duration, start) {
  // Easing function for smooth animation
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  
  // RequestAnimationFrame for smooth 60fps
  const animate = (currentTime) => {
    const progress = elapsed / duration;
    const easedProgress = easeOutQuart(progress);
    const currentCount = Math.floor(easedProgress * end);
    setCount(currentCount);
  };
}
```

### 3. Number Formatting
```javascript
// Format with Indonesian locale
count.toLocaleString('id-ID') // 1000 → 1.000
```

---

## 🎨 Animation Details

### Easing Function
Uses **easeOutQuart** for natural deceleration:
```javascript
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
```

**Effect**: Fast start, slow end (feels natural)

### Duration Recommendations
- Small numbers (< 50): 1000-1500ms
- Medium numbers (50-500): 1500-2000ms
- Large numbers (> 500): 2000-2500ms

### Threshold
- `0.3` = Animation starts when 30% of element is visible
- Adjust based on your needs (0.1 - 1.0)

---

## 💡 Examples

### Simple Counter
```jsx
<CountUpNumber end={100} />
// Output: 100
```

### With Suffix
```jsx
<CountUpNumber end={500} suffix="+" />
// Output: 500+
```

### With Percentage
```jsx
<CountUpNumber end={95} suffix="%" />
// Output: 95%
```

### With K Suffix
```jsx
<CountUpNumber end={5} suffix="K+" />
// Output: 5K+
```

### Custom Duration
```jsx
<CountUpNumber end={1000} duration={3000} />
// Animates over 3 seconds
```

### Styled
```jsx
<CountUpNumber
  end={500}
  suffix="+"
  className="text-6xl font-bold text-primary-600"
/>
```

---

## 🎯 Use Cases

### Statistics Section
```jsx
<div className="stats-grid">
  <div className="stat-card">
    <CountUpNumber end={500} suffix="+" />
    <p>Happy Customers</p>
  </div>
  <div className="stat-card">
    <CountUpNumber end={10} suffix="+" />
    <p>Years Experience</p>
  </div>
  <div className="stat-card">
    <CountUpNumber end={1000} suffix="+" />
    <p>Products Sold</p>
  </div>
</div>
```

### Achievement Badges
```jsx
<div className="achievement">
  <CountUpNumber end={100} suffix="%" />
  <p>Customer Satisfaction</p>
</div>
```

### Dashboard Metrics
```jsx
<div className="metric">
  <CountUpNumber end={2543} duration={2000} />
  <p>Total Orders</p>
</div>
```

---

## ⚡ Performance

### Optimizations
1. **RequestAnimationFrame**: Smooth 60fps animation
2. **Intersection Observer**: Only animates when visible
3. **Cleanup**: Cancels animation on unmount
4. **Memoization**: Prevents unnecessary re-renders

### Best Practices
```jsx
// ✅ Good: Reasonable duration
<CountUpNumber end={500} duration={2000} />

// ❌ Bad: Too long (boring)
<CountUpNumber end={500} duration={10000} />

// ❌ Bad: Too short (jarring)
<CountUpNumber end={500} duration={100} />
```

---

## 🎨 Styling Examples

### Gradient Text
```jsx
<CountUpNumber
  end={500}
  suffix="+"
  className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
/>
```

### With Icon
```jsx
<div className="flex items-center gap-3">
  <Users className="w-8 h-8 text-blue-500" />
  <CountUpNumber
    end={500}
    suffix="+"
    className="text-4xl font-bold"
  />
</div>
```

### Card Style
```jsx
<div className="bg-white rounded-xl shadow-lg p-6 text-center">
  <CountUpNumber
    end={1000}
    suffix="+"
    className="text-5xl font-bold text-primary-600 mb-2"
  />
  <p className="text-gray-600">Products Sold</p>
</div>
```

---

## 🔧 Customization

### Change Easing Function
Edit `src/hooks/useCountUp.js`:

```javascript
// Linear (constant speed)
const linear = (t) => t;

// EaseInQuad (slow start)
const easeInQuad = (t) => t * t;

// EaseInOutCubic (slow start & end)
const easeInOutCubic = (t) => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
```

### Change Threshold
Edit `src/components/CountUpNumber.jsx`:

```javascript
const observer = new IntersectionObserver(
  ([entry]) => { /* ... */ },
  {
    threshold: 0.5, // Change this (0.1 - 1.0)
    rootMargin: '0px'
  }
);
```

### Add Prefix
```jsx
// Modify component to accept prefix prop
<CountUpNumber
  end={500}
  prefix="$"
  suffix="+"
/>
// Output: $500+
```

---

## 🐛 Troubleshooting

### Animation Not Starting
**Problem**: Counter stays at 0

**Solution**: Check if element is visible in viewport
```javascript
// Lower threshold
threshold: 0.1 // Instead of 0.3
```

### Animation Too Fast/Slow
**Problem**: Duration doesn't feel right

**Solution**: Adjust duration based on number size
```javascript
// Small numbers: 1000-1500ms
<CountUpNumber end={10} duration={1000} />

// Large numbers: 2000-3000ms
<CountUpNumber end={1000} duration={2500} />
```

### Number Format Wrong
**Problem**: Shows 1,000 instead of 1.000

**Solution**: Check locale setting
```javascript
// Indonesian format
count.toLocaleString('id-ID') // 1.000

// US format
count.toLocaleString('en-US') // 1,000
```

---

## 📚 Related

- **Hook**: `src/hooks/useCountUp.js`
- **Component**: `src/components/CountUpNumber.jsx`
- **Usage**: `src/pages/Home.jsx`

---

## ✅ Checklist

When implementing count-up animation:

- [ ] Import CountUpNumber component
- [ ] Set appropriate end value
- [ ] Choose duration based on number size
- [ ] Add suffix if needed ('+', '%', 'K')
- [ ] Style with className
- [ ] Test visibility trigger
- [ ] Check number formatting
- [ ] Verify animation smoothness

---

**Created**: December 9, 2025  
**Status**: ✅ Production Ready  
**Performance**: Optimized with RAF & Intersection Observer
