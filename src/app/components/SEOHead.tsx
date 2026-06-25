import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_DOMAIN } from '@shared/constants';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  jsonLd
}: SEOHeadProps) {
  const finalCanonical = canonical || SITE_DOMAIN;
  
  const baseSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://ninegatesmahjong.com/#website",
        "url": "https://ninegatesmahjong.com/",
        "name": "Nine Gates Mahjong",
        "description": "The definitive online Mahjong portal for casual and serious players. Play Solitaire, Riichi, MCR, and more.",
        "publisher": {
          "@id": "https://ninegatesmahjong.com/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://ninegatesmahjong.com/#organization",
        "name": "Nine Gates Mahjong",
        "url": "https://ninegatesmahjong.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ninegatesmahjong.com/logo_dark.png"
        }
      }
    ]
  };
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={finalCanonical} />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      
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
