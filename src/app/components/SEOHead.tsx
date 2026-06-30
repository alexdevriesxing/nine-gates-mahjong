import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_DOMAIN } from '@shared/constants';
import { buildStructuredData, getSeoRoute } from '@shared/seo';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  jsonLd,
  noIndex = false,
}: SEOHeadProps) {
  const finalCanonical = canonical || SITE_DOMAIN;
  const routePath = finalCanonical.replace(SITE_DOMAIN, '') || '/';
  const routeMeta = getSeoRoute(routePath);
  const baseSchema = buildStructuredData(routePath);
  const keywords = routeMeta.keywords.join(', ');
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={finalCanonical} />
      <meta name="robots" content={noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
      
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={ogImage || `${SITE_DOMAIN}/hero-bg.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage || `${SITE_DOMAIN}/hero-bg.jpg`} />
      
      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>
      
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
