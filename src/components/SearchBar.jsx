import { Search, X } from 'lucide-react';

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Cari produk...', 
  className = '' 
}) {
  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <Search 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
        size={20}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-12 py-3 md:py-4 rounded-xl border-2 border-gray-200 
                   focus:border-primary-500 focus:ring-4 focus:ring-primary-100 
                   transition-all outline-none text-gray-900 placeholder-gray-400
                   shadow-sm hover:shadow-md"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          aria-label="Clear search"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
