// Minimal page transition wrapper using CSS animations
// No external dependencies - uses Tailwind animations

export default function PageTransition({ children, className = '' }) {
  return (
    <div className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
}

// Staggered children animation wrapper
export function StaggerContainer({ children, className = '', delay = 0 }) {
  return (
    <div 
      className={`animate-slide-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Individual stagger item
export function StaggerItem({ children, index = 0, className = '' }) {
  return (
    <div 
      className={`animate-slide-up opacity-0 ${className}`}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
}

// Fade in on scroll (uses Intersection Observer)
import { useEffect, useRef, useState } from 'react';

export function FadeInView({ children, className = '', threshold = 0.1 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Scale in animation
export function ScaleIn({ children, className = '', delay = 0 }) {
  return (
    <div 
      className={`animate-scale-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
