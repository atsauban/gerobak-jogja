import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Wrapper component for scroll reveal animations
 */
export default function ScrollReveal({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className = ''
}) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1, once: true });

  const animations = {
    'fade-up': 'translate-y-8 opacity-0',
    'fade-down': '-translate-y-8 opacity-0',
    'fade-left': 'translate-x-8 opacity-0',
    'fade-right': '-translate-x-8 opacity-0',
    'zoom-in': 'scale-95 opacity-0',
    'zoom-out': 'scale-105 opacity-0',
  };

  const baseClasses = 'transition-all';
  const hiddenClasses = animations[animation] || animations['fade-up'];
  const visibleClasses = 'translate-y-0 translate-x-0 scale-100 opacity-100';

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${isVisible ? visibleClasses : hiddenClasses} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
