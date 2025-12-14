import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, TrendingUp, Package, ArrowRight } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();

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

    const quickSearches = [
        'Gerobak Motor', 'Aluminium', 'Gerobak Kayu', 'Custom Booth', 'Angkringan'
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] animate-fade-in">
            {/* 1. Backdrop Blur */}
            <div
                className="absolute inset-0 bg-white/95 backdrop-blur-xl"
                onClick={onClose}
            ></div>

            {/* 2. Content Container */}
            <div className="relative z-[160] max-w-4xl mx-auto pt-24 px-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-6 p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Tutup pencarian"
                >
                    <X size={24} />
                </button>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-12">
                    <div className="relative group">
                        <Search
                            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors"
                            size={32}
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari gerobak impian Anda..."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-2xl py-8 pl-20 pr-8 text-2xl md:text-4xl font-display font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all shadow-xl"
                        />
                        <button
                            type="submit"
                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!query.trim()}
                            aria-label="Cari"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </form>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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

                    {/* Quick Categories */}
                    <div>
                        <h3 className="flex items-center gap-2 text-gray-500 font-semibold mb-4 uppercase tracking-wider text-sm">
                            <Package size={16} />
                            Kategori Cepat
                        </h3>
                        <div className="space-y-3">
                            <Link
                                to="/katalog?kategori=aluminium"
                                onClick={onClose}
                                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-lg transition-all group"
                            >
                                <span className="font-semibold text-gray-800 group-hover:text-primary-600">Aluminium Premium</span>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </Link>
                            <Link
                                to="/katalog?kategori=kayu"
                                onClick={onClose}
                                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-lg transition-all group"
                            >
                                <span className="font-semibold text-gray-800 group-hover:text-primary-600">Kayu Jati / Mahoni</span>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
