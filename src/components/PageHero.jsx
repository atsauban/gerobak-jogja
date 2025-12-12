export default function PageHero({ title, description, children, className = '' }) {
    return (
        <div className={`bg-white py-16 border-b border-gray-100 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900 animate-fade-in">
                    {title}
                </h1>
                {description && (
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-slide-up">
                        {description}
                    </p>
                )}
                {children && (
                    <div className="mt-8 animate-slide-up">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
