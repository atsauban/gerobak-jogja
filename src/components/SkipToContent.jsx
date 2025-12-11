/**
 * Skip to Content Link
 * Allows keyboard users to skip navigation and go directly to main content
 */
import { Link } from 'react-router-dom';

export default function SkipToContent() {
  return (
    <Link
      to="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] 
                 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg 
                 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 transition-all"
      onClick={(e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }}
    >
      Skip to main content
    </Link>
  );
}

