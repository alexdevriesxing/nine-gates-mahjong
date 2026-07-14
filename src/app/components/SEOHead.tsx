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
  noIndex?: boolean;
  dateModified?: string;
}

function labelSegment(segment: string) {
  const aliases: Record<string, string> = {
    learn: 'Learn',
    play: 'Games',
    'real-mahjong': 'Real Mahjong Training',
    'mahjongg-solitaire': 'Mahjongg Solitaire',
    mcr: 'Chinese Official MCR',
    riichi: 'Japanese Riichi',
  };
  return aliases[segment] ?? segment.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
  dateModified = '2026-07-14',
}: SEOHeadProps) {
  const finalCanonical = canonical || SITE_DOMAIN;
  const canonicalUrl = new URL(finalCanonical, SITE_DOMAIN);
  const segments = canonicalUrl.pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_DOMAIN}/` },
    ...segments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: labelSegment(segment),
      item: `${SITE_DOMAIN}/${segments.slice(0, index + 1).join('/')}`,
    })),
  ];

  const baseSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_DOMAIN}/#website`,
        url: `${SITE_DOMAIN}/`,
        name: SITE_NAME,
        description: 'Free Mahjongg puzzles, guided regional Mahjong trainers, learning resources and private multiplayer rooms.',
        inLanguage: 'en',
        publisher: { '@id': `${SITE_DOMAIN}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_DOMAIN}/#organization`,
        name: 'Fire Dragon Interactive',
        alternateName: SITE_NAME,
        url: `${SITE_DOMAIN}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_DOMAIN}/logo_dark.png`,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${finalCanonical}#webpage`,
        url: finalCanonical,
        name: title,
        description,
        isPartOf: { '@id': `${SITE_DOMAIN}/#website` },
        about: { '@id': `${SITE_DOMAIN}/#organization` },
        inLanguage: 'en',
        dateModified,
        breadcrumb: { '@id': `${finalCanonical}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${finalCanonical}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };

  return (
    <Helmet>
      <html lang="en" dir="ltr" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Nine Gates Mahjong Editorial Team" />
      <link rel="canonical" href={finalCanonical} />
      <meta name="robots" content={noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={ogImage || `${SITE_DOMAIN}/hero-bg.jpg`} />
      <meta property="og:image:alt" content={`${SITE_NAME} Mahjong tiles and game table`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage || `${SITE_DOMAIN}/hero-bg.jpg`} />

      <script id="ngm-base-schema" type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>

      {jsonLd && (
        <script id="ngm-route-schema" type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
