import { useEffect, useMemo } from 'react';
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
    sichuan: 'Sichuan Bloody Rules',
    'zung-jung': 'Zung Jung Mahjong',
  };
  return aliases[segment] ?? segment.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  const matches = Array.from(document.head.querySelectorAll<HTMLMetaElement>(selector));
  const element = matches.shift() ?? document.createElement('meta');
  for (const duplicate of matches) duplicate.remove();
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  if (!element.isConnected) document.head.appendChild(element);
}

function upsertCanonical(href: string) {
  const matches = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));
  const element = matches.shift() ?? document.createElement('link');
  for (const duplicate of matches) duplicate.remove();
  element.rel = 'canonical';
  element.href = href;
  element.dataset.rh = 'true';
  if (!element.isConnected) document.head.appendChild(element);
}

function upsertSchema(id: string, value: Record<string, unknown> | null) {
  const matches = Array.from(document.head.querySelectorAll<HTMLScriptElement>(`script#${id}`));
  const element = matches.shift() ?? document.createElement('script');
  for (const duplicate of matches) duplicate.remove();

  if (!value) {
    element.remove();
    return;
  }

  element.id = id;
  element.type = 'application/ld+json';
  element.dataset.rh = 'true';
  element.textContent = JSON.stringify(value);
  if (!element.isConnected) document.head.appendChild(element);
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
  dateModified = '2026-07-22',
}: SEOHeadProps) {
  const finalCanonical = canonical || SITE_DOMAIN;
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalImage = ogImage || `${SITE_DOMAIN}/hero-bg.jpg`;

  const baseSchema = useMemo(() => {
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

    return {
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
  }, [dateModified, description, finalCanonical, title]);

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description, 'data-rh': 'true' });
    upsertMeta('meta[name="author"]', { name: 'author', content: 'Nine Gates Mahjong Editorial Team', 'data-rh': 'true' });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
      'data-rh': 'true',
    });
    upsertCanonical(finalCanonical);

    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME, 'data-rh': 'true' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_US', 'data-rh': 'true' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: finalOgTitle, 'data-rh': 'true' });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: finalOgDescription, 'data-rh': 'true' });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website', 'data-rh': 'true' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: finalCanonical, 'data-rh': 'true' });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: finalImage, 'data-rh': 'true' });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${SITE_NAME} Mahjong tiles and game table`, 'data-rh': 'true' });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image', 'data-rh': 'true' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: finalOgTitle, 'data-rh': 'true' });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: finalOgDescription, 'data-rh': 'true' });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: finalImage, 'data-rh': 'true' });

    upsertSchema('ngm-base-schema', baseSchema);
    upsertSchema('ngm-route-schema', jsonLd ?? null);
  }, [baseSchema, description, finalCanonical, finalImage, finalOgDescription, finalOgTitle, jsonLd, noIndex, title]);

  return null;
}
