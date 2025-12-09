# Style Guide - Gerobak Jogja

## 🎨 Warna

### Primary Colors
- **Primary 600**: `#0284c7` - Warna utama (tombol, link, accent)
- **Primary 700**: `#0369a1` - Hover state
- **Primary 50**: `#f0f9ff` - Background light

### Accent Colors
- **Accent 500**: `#d97706` - Highlight, badges
- **Green 500**: `#22c55e` - WhatsApp button
- **Gray 900**: `#111827` - Text primary

## 📝 Typography

### Font Families
- **Display**: Poppins (Headings, Logo)
- **Body**: Inter (Paragraphs, UI)

### Font Sizes
- **Hero Title**: `text-4xl md:text-6xl lg:text-7xl`
- **Section Title**: `text-4xl md:text-5xl`
- **Card Title**: `text-xl md:text-2xl`
- **Body**: `text-base md:text-lg`

## 🎭 Komponen

### Buttons

#### Primary Button
```jsx
<button className="btn-primary">
  Button Text
</button>
```

#### WhatsApp Button
```jsx
<button className="btn-whatsapp">
  <MessageCircle size={20} />
  WhatsApp
</button>
```

### Cards
```jsx
<div className="card">
  {/* Content */}
</div>
```

### Section Title
```jsx
<h2 className="section-title">Title</h2>
```

### Gradient Text
```jsx
<span className="gradient-text">Text</span>
```

## ✨ Animasi

### Fade In
```jsx
<div className="animate-fade-in">
  {/* Content */}
</div>
```

### Slide Up
```jsx
<div className="animate-slide-up">
  {/* Content */}
</div>
```

### Scale In
```jsx
<div className="animate-scale-in">
  {/* Content */}
</div>
```

### Pulse (untuk CTA)
```jsx
<button className="animate-pulse-slow">
  {/* Content */}
</button>
```

## 🎯 Hover Effects

### Card Hover
- Transform: `hover:-translate-y-2`
- Shadow: `hover:shadow-2xl`
- Duration: `duration-300`

### Image Hover
- Scale: `group-hover:scale-110`
- Duration: `duration-500`

### Button Hover
- Scale: `hover:scale-105`
- Shadow: `hover:shadow-xl`

## 📐 Spacing

### Container
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Section Padding
- Desktop: `py-20`
- Mobile: `py-16`

### Card Padding
- Desktop: `p-8 md:p-12`
- Mobile: `p-6`

## 🌈 Gradients

### Primary Gradient
```jsx
className="bg-gradient-to-r from-primary-600 to-primary-700"
```

### Hero Gradient
```jsx
className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900"
```

### Accent Gradient
```jsx
className="bg-gradient-to-r from-accent-500 to-accent-600"
```

## 📱 Responsive

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Grid Responsive
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
```

## 🎪 Best Practices

1. **Konsistensi**: Gunakan komponen yang sudah ada
2. **Animasi**: Jangan berlebihan, gunakan seperlunya
3. **Spacing**: Gunakan spacing yang konsisten
4. **Colors**: Stick to color palette yang sudah ditentukan
5. **Typography**: Gunakan hierarchy yang jelas
6. **Accessibility**: Pastikan contrast ratio yang baik
7. **Performance**: Optimize images dan animations

## 🔧 Customization

### Mengubah Warna Tema
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    600: '#YOUR_COLOR',
    // ...
  }
}
```

### Menambah Animasi
Edit `tailwind.config.js` di section `keyframes` dan `animation`

### Custom Font
Tambahkan di `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```
