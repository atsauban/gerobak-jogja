import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Cari produk...', 
  className = '',
  onSearch,
  showSuggestions = false
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch {
        setSearchHistory([]);
      }
    }
  }, []);

  // Save to history when search is performed
  const saveToHistory = (query) => {
    if (!query.trim()) return;
    
    const updatedHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 5); // Keep only last 5 searches
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleClear = () => {
    onChange({ target: { value: '' } });
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      saveToHistory(value.trim());
      setShowHistory(false);
      if (onSearch) {
        onSearch(value.trim());
      }
    }
  };

  const handleHistoryClick = (query) => {
    onChange({ target: { value: query } });
    saveToHistory(query);
    setShowHistory(false);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFocus = () => {
    if (searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  // Close history on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        suggestionsRef.current &&
        !searchRef.current.contains(event.target) &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    if (showHistory) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHistory]);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
            size={18}
          />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg bg-white border border-gray-200 
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-100 
                     transition-all outline-none text-gray-900 placeholder-gray-400"
            aria-label="Search products"
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                       hover:text-gray-600 transition-colors p-0.5 hover:bg-gray-100 rounded
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Search History Suggestions */}
      {showSuggestions && showHistory && searchHistory.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
        >
          <div className="p-1.5">
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400">
              <Clock size={12} />
              Pencarian Terakhir
            </div>
            {searchHistory.map((query, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleHistoryClick(query)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2 text-sm"
              >
                <Clock size={14} className="text-gray-400" />
                <span className="text-gray-700 flex-1">{query}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
