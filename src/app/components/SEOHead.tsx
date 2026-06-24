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
          "url": "https://ninegatesmahjong.com/logo_white.png"
        }
      }
    ]
  };
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
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
