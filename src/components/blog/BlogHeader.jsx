import { Link } from 'react-router-dom';
import { Calendar, User, Facebook, Twitter, MessageCircle } from 'lucide-react';

export default function BlogHeader({ article }) {
    const shareUrl = window.location.href;
    const shareTitle = article.title;

    return (
        <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-semibold">
                    {article.category}
                </span>
                {article.readTime && (
                    <span className="text-gray-600 text-sm">{article.readTime}</span>
                )}
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900">
                {article.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-2">
                        <User size={18} />
                        {article.author || 'Admin Gerobak Jogja'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-2">
                        <Calendar size={18} />
                        {new Date(article.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 mr-2">Bagikan:</span>
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                        title="Share on Facebook"
                    >
                        <Facebook size={18} />
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                        title="Share on Twitter"
                    >
                        <Twitter size={18} />
                    </a>
                    <a
                        href={`https://wa.me/?text=${shareTitle} ${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                        title="Share on WhatsApp"
                    >
                        <MessageCircle size={18} />
                    </a>
                </div>
            </div>
        </header>
    );
}
