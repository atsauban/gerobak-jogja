import { useEffect, useRef } from 'react';

/**
 * Focus Trap Hook
 * Traps focus within a modal/dialog for accessibility
 * 
 * @param {boolean} isActive - Whether the trap is active
 * @param {React.RefObject} containerRef - Ref to the container element
 */
export const useFocusTrap = (isActive, containerRef) => {
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Store the previously focused element
    previousActiveElement.current = document.activeElement;

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      // Restore focus to previous element when trap is deactivated
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, containerRef]);
};

