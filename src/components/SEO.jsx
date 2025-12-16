import { Helmet } from 'react-helmet-async';

export default function SEO({
    title,
    description,
    name = 'Gerobak Jogja',
    type = 'website',
    image,
    url,
    schema,
    noindex = false,
    article = null // { publishedTime, modifiedTime, author, tags }
}) {
    const siteUrl = window.location.origin;
    const currentUrl = url || window.location.href;
    const defaultImage = `${siteUrl}/images/logo.webp`;
    const metaImage = image || defaultImage;
    const fullTitle = title ? `${title} | ${name}` : name;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={description} />
            <link rel="canonical" href={currentUrl} />
            
            {/* Language */}
            <html lang="id" />
            <meta property="og:locale" content="id_ID" />
            
            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            )}

            {/* Facebook/Open Graph tags */}
            <meta property="og:type" content={article ? 'article' : type} />
            <meta property="og:title" content={title || name} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content={name} />
            
            {/* Article specific tags */}
            {article && (
                <>
                    {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
                    {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
                    {article.author && <meta property="article:author" content={article.author} />}
                    {article.tags?.map((tag, i) => <meta key={i} property="article:tag" content={tag} />)}
                </>
            )}

            {/* Twitter tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || name} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={metaImage} />

            {/* JSON-LD Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
                </script>
            )}
        </Helmet>
    );
}
