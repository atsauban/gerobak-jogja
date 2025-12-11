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
      } catch (e) {
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
    <div className={`relative max-w-2xl mx-auto ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
            size={20}
          />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            className="w-full pl-12 pr-12 py-3 md:py-4 rounded-xl border-2 border-gray-200 
                     focus:border-primary-500 focus:ring-4 focus:ring-primary-100 
                     transition-all outline-none text-gray-900 placeholder-gray-400
                     shadow-sm hover:shadow-md"
            aria-label="Search products"
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                       hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Search History Suggestions */}
      {showSuggestions && showHistory && searchHistory.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
        >
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <Clock size={14} />
              Pencarian Terakhir
            </div>
            {searchHistory.map((query, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleHistoryClick(query)}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 group"
              >
                <Clock size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                <span className="text-gray-700 group-hover:text-primary-600 transition-colors flex-1">
                  {query}
                </span>
                <TrendingUp size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
