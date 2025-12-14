import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import ShareButton from '../ShareButton';

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
                    <ShareButton
                        title={article.title}
                        text={`Baca artikel menarik: ${article.title}`}
                        className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-full px-4 py-2 text-sm"
                    />
                </div>
            </div>
        </header>
    );
}
