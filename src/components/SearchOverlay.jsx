import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, TrendingUp, Package, ArrowRight } from 'lucide-react';

import { useProducts } from '../context/ProductContext';

export default function SearchOverlay({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { products } = useProducts();

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/katalog?cari=${encodeURIComponent(query)}`);
            onClose();
            setQuery('');
        }
    };

    // Get featured products names for popular searches
    const quickSearches = products
        .filter(p => p.featured)
        .slice(0, 5)
        .map(p => p.name);

    // Fallback if no featured products
    if (quickSearches.length === 0) {
        products.slice(0, 5).forEach(p => quickSearches.push(p.name));
    }

    // Fallback if no products at all (just to be safe)
    if (quickSearches.length === 0) {
        quickSearches.push('Gerobak Motor', 'Aluminium', 'Gerobak Kayu');
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] animate-fade-in">
            {/* 1. Backdrop Blur */}
            <div
                className="absolute inset-0 bg-white/95 backdrop-blur-xl"
                onClick={onClose}
            ></div>

            {/* 2. Content Container */}
            <div className="relative z-[160] max-w-4xl mx-auto pt-4 md:pt-24 px-4 md:px-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 md:top-8 right-4 md:right-6 p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Tutup pencarian"
                >
                    <X size={20} className="md:w-6 md:h-6" />
                </button>

                {/* Logo or Title for Mobile context (Optional, keeping it clean for now) */}

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mt-12 mb-6 md:mb-12">
                    <div className="relative group">
                        <Search
                            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors"
                            size={18}
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari gerobak..."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-xl md:rounded-2xl py-3 md:py-6 pl-10 md:pl-16 pr-12 md:pr-16 text-base md:text-2xl font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all shadow-sm focus:shadow-lg"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!query.trim()}
                            aria-label="Cari"
                        >
                            <ArrowRight size={16} className="md:w-6 md:h-6" />
                        </button>
                    </div>
                </form>

                {/* Quick Links */}
                <div className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Popular Searches */}
                    <div>
                        <h3 className="flex items-center gap-2 text-gray-500 font-semibold mb-4 uppercase tracking-wider text-sm">
                            <TrendingUp size={16} />
                            Pencarian Populer
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {quickSearches.map((term, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        navigate(`/katalog?cari=${encodeURIComponent(term)}`);
                                        onClose();
                                    }}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:shadow-md transition-all"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
