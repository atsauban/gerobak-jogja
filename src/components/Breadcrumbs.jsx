import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm mb-4 overflow-x-auto" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
      >
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          {item.href ? (
            <Link 
              to={item.href}
              className="text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600 font-medium whitespace-nowrap truncate max-w-[200px]">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
