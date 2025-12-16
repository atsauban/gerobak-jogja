export default function PageHero({ title, description, children, className = '', centered = true }) {
    return (
        <div className={`bg-gray-50 border-b border-gray-100 ${className}`}>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${centered ? 'text-center' : ''}`}>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">
                    {title}
                </h1>
                {description && (
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
                {children && (
                    <div className="mt-6">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
