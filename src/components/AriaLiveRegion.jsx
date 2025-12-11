/**
 * Aria Live Region Component
 * Announces dynamic content changes to screen readers
 */
import { useEffect, useRef } from 'react';

export default function AriaLiveRegion({ message, priority = 'polite' }) {
  const regionRef = useRef(null);

  useEffect(() => {
    if (message && regionRef.current) {
      // Clear previous message
      regionRef.current.textContent = '';
      // Set new message after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    />
  );
}

