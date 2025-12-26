import { useEffect, useState, useRef } from 'react';
import { useCountUp } from '../hooks/useCountUp';

/**
 * Animated counter component with intersection observer
 * Starts counting when element is visible in viewport
 */
export default function CountUpNumber({
  end,
  duration = 2000,
  suffix = '',
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const count = useCountUp(end, duration, isVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% visible
        rootMargin: '0px'
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [isVisible]);

  return (
    <div ref={elementRef} className={className}>
      {count.toLocaleString('id-ID')}{suffix}
    </div>
  );
}
