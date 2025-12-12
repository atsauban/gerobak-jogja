import { Helmet } from 'react-helmet-async';

export default function SEO({
    title,
    description,
    name = 'Gerobak Jogja',
    type = 'website',
    image,
    url
}) {
    const siteUrl = window.location.origin;
    const currentUrl = url || window.location.href;
    const defaultImage = `${siteUrl}/images/hero/workshop-gerobak.jpg`; // Fallback image
    const metaImage = image || defaultImage;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title ? `${title} | ${name}` : name}</title>
            <meta name='description' content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title || name} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content={name} />

            {/* Twitter tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || name} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={metaImage} />
        </Helmet>
    );
}
