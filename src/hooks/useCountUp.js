import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook for animated counter
 * @param {number} end - Target number
 * @param {number} duration - Animation duration in ms (default: 2000)
 * @param {boolean} start - Whether to start animation (default: false)
 * @returns {number} Current count value
 */
export function useCountUp(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    // Easing function for smooth animation
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply easing
      const easedProgress = easeOutQuart(progress);
      const currentCount = Math.floor(easedProgress * end);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end at exact number
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      startTimeRef.current = null;
    };
  }, [end, duration, start]);

  return count;
}
