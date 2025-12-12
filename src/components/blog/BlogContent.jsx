import { marked } from 'marked';

export default function BlogContent({ article }) {
    // Convert markdown to HTML
    const getHtmlContent = (content) => {
        if (!content) return '';
        return marked(content);
    };

    return (
        <>
            {/* Featured Image */}
            {article.image && (
                <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-auto"
                    />
                </div>
            )}

            {/* Content */}
            <div
                className="prose prose-lg max-w-none mb-12 blog-content"
                dangerouslySetInnerHTML={{ __html: getHtmlContent(article.content) }}
                style={{
                    lineHeight: '1.8',
                }}
            />

            {/* Integrated Styles for Blog Content */}
            <style>{`
        .blog-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1a202c;
        }
        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #2d3748;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #2d3748;
        }
        .blog-content p {
          margin-bottom: 1.25rem;
          color: #4a5568;
          font-size: 1.125rem;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.25rem;
          padding-left: 2rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-size: 1.125rem;
        }
        .blog-content strong {
          font-weight: 600;
          color: #2d3748;
        }
        .blog-content table {
          width: 100%;
          margin: 1.5rem 0;
          border-collapse: collapse;
        }
        .blog-content th {
          background-color: #f7fafc;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          border: 1px solid #e2e8f0;
        }
        .blog-content td {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
        }
        .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4a5568;
        }
        .blog-content code {
          background-color: #f7fafc;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
        }
        .blog-content pre {
          background-color: #2d3748;
          color: #f7fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
      `}</style>
        </>
    );
}
