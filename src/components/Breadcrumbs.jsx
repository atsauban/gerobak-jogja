import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 overflow-x-auto pb-2" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors whitespace-nowrap"
      >
        <Home size={16} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          {item.href ? (
            <Link 
              to={item.href}
              className="text-gray-500 hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium whitespace-nowrap">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
