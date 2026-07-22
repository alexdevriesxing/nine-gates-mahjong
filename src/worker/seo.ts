const SITE_ORIGIN = 'https://ninegatesmahjong.com';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/hero-bg.jpg`;

export interface RouteMeta {
  title: string;
  description: string;
  kind: 'page' | 'game' | 'article' | 'trainer';
  noIndex?: boolean;
}

const ROUTES: Record<string, RouteMeta> = {
  '/': {
    title: 'Nine Gates Mahjong — Free Mahjongg Games and Mahjong Training',
    description: 'Play free Mahjongg Solitaire and daily puzzles, learn traditional Mahjong, practice guided regional variants, and create private multiplayer rooms.',
    kind: 'page',
  },
  '/play': {
    title: 'Free Online Mahjongg Games | Nine Gates Mahjong',
    description: 'Choose from Mahjongg Solitaire, Daily Mahjongg, Zen Mahjongg, Time Attack, Mahjong Connect, Shisen-Sho, Memory and Mahjong training modes.',
    kind: 'page',
  },
  '/mahjongg-solitaire': {
    title: 'Play Mahjongg Solitaire Free Online | Nine Gates Mahjong',
    description: 'Play a guaranteed-solvable layered Mahjongg Solitaire board with hints, undo, shuffle, keyboard controls and responsive touch-friendly tiles.',
    kind: 'game',
  },
  '/daily': {
    title: 'Daily Mahjongg Puzzle | Free Daily Mahjong Challenge',
    description: 'Play today’s shared, deterministic and solvable Mahjongg puzzle with a timer, hints, score and daily challenge progress.',
    kind: 'game',
  },
  '/zen-mahjongg': {
    title: 'Zen Mahjongg Online | Relaxing Free Mahjong Tile Game',
    description: 'Play a calm untimed Mahjongg matching game with unlimited hints, shuffles and responsive tiles.',
    kind: 'game',
  },
  '/time-attack': {
    title: 'Mahjongg Time Attack | Fast Free Matching Game',
    description: 'Race a two-minute timer, match Mahjong tiles, build combos and earn time bonuses before the board closes.',
    kind: 'game',
  },
  '/mahjong-connect': {
    title: 'Play Mahjong Connect Online Free | Nine Gates Mahjong',
    description: 'Connect matching Mahjong tiles through open paths with no more than two turns on desktop, tablet or mobile.',
    kind: 'game',
  },
  '/shisen-sho': {
    title: 'Play Shisen-Sho Online Free | Mahjong Tile Puzzle',
    description: 'Play the Japanese open-path Mahjong tile puzzle with hints, shuffles and touch-friendly controls.',
    kind: 'game',
  },
  '/mahjongg-memory': {
    title: 'Mahjongg Memory Game | Free Tile Matching Challenge',
    description: 'Train visual memory by revealing and matching pairs of Mahjong tiles in as few moves as possible.',
    kind: 'game',
  },
  '/real-mahjong': {
    title: 'Real Mahjong Training vs AI Online | Nine Gates Mahjong',
    description: 'Practice a simplified four-seat Mahjong draw-and-discard hand against AI and learn turn rhythm, table reading and standard winning-hand shape.',
    kind: 'trainer',
  },
  '/variants': {
    title: 'Mahjong Variants | Seven Playable Regional Rule Trainers',
    description: 'Compare and practice Hong Kong, Riichi, MCR, American, Taiwanese, Sichuan Bloody Rules, and Zung Jung Mahjong.',
    kind: 'article',
  },
  '/real-mahjong/hong-kong': {
    title: 'Hong Kong Mahjong Rules and Guided Trainer | Nine Gates Mahjong',
    description: 'Learn the flow and selected concepts of Hong Kong Mahjong through an answer-first guide and simplified interactive training hand.',
    kind: 'trainer',
  },
  '/real-mahjong/riichi': {
    title: 'Japanese Riichi Mahjong Rules and Guided Trainer',
    description: 'Learn riichi, tenpai and selected Japanese Mahjong concepts with a concise guide and simplified interactive training hand.',
    kind: 'trainer',
  },
  '/real-mahjong/mcr': {
    title: 'Chinese Official MCR Mahjong Guide and Trainer',
    description: 'Explore Chinese Official Mahjong Competition Rules concepts and practice a simplified guided hand.',
    kind: 'trainer',
  },
  '/real-mahjong/american': {
    title: 'American Mahjongg Guide and Charleston Trainer',
    description: 'Learn selected American Mahjongg concepts, including the Charleston pass, through a concise guide and simplified training hand.',
    kind: 'trainer',
  },
  '/real-mahjong/taiwanese': {
    title: 'Taiwanese Mahjong Guide and Guided Trainer',
    description: 'Learn selected Taiwanese Mahjong concepts and practice a simplified guided hand with the larger hand-size target.',
    kind: 'trainer',
  },
  '/real-mahjong/sichuan': {
    title: 'Sichuan Bloody Rules Mahjong and Dingque Trainer',
    description: 'Learn Sichuan Blood Battle Mahjong with a playable dingque missing-suit trainer, the 108-tile suited set, no-chow calls and multi-winner flow.',
    kind: 'trainer',
  },
  '/real-mahjong/zung-jung': {
    title: 'Zung Jung Mahjong Rules and Pattern Trainer',
    description: 'Learn Zung Jung Mahjong with guided standard-hand practice, additive pattern-scoring concepts and clear comparisons with MCR and Riichi.',
    kind: 'trainer',
  },
  '/learn': {
    title: 'Learn Mahjong and Mahjongg | Rules, Strategy and Terminology',
    description: 'Learn the difference between Mahjong and Mahjongg, understand legal hands, calls, variants and beginner strategy, and practice online.',
    kind: 'page',
  },
  '/learn/mahjong-vs-mahjongg': {
    title: 'Mahjong vs Mahjongg: Real Mahjong and Solitaire Explained',
    description: 'Understand the difference between traditional four-player Mahjong, Mahjongg Solitaire and American Mahjongg.',
    kind: 'article',
  },
  '/learn/how-to-play-mahjongg-solitaire': {
    title: 'How to Play Mahjongg Solitaire: Rules and Strategy',
    description: 'Learn free-tile rules, matching, hints, shuffles and practical strategy for clearing layered Mahjongg Solitaire boards.',
    kind: 'article',
  },
  '/learn/how-to-play-real-mahjong': {
    title: 'How to Play Traditional Mahjong | Beginner Guide',
    description: 'Learn the four-player draw-and-discard rhythm, legal hand shape, turn order and the role of regional rulesets.',
    kind: 'article',
  },
  '/learn/chi-pung-kong': {
    title: 'Chi, Pung and Kong Explained | Mahjong Calls Guide',
    description: 'Learn what Chi, Pung and Kong mean, when each call is permitted and how exposed melds affect a Mahjong hand.',
    kind: 'article',
  },
  '/learn/beginner-strategy': {
    title: 'Mahjong Beginner Strategy | Safer Discards and Better Shapes',
    description: 'Improve tile efficiency, hand shape, discard reading and defensive awareness with practical beginner Mahjong strategy.',
    kind: 'article',
  },
  '/learn/mahjong-variants': {
    title: 'Mahjong Variants Guide | Hong Kong, Riichi, MCR and More',
    description: 'Compare Hong Kong, Riichi, MCR, American, Taiwanese, Sichuan Bloody Rules and Zung Jung Mahjong.',
    kind: 'article',
  },
  '/how-to-play': {
    title: 'How to Play Nine Gates Mahjong Games | Interactive Tutorials',
    description: 'Follow step-by-step tutorials for Mahjongg Solitaire, Connect, Shisen-Sho and the traditional Mahjong training table.',
    kind: 'article',
  },
  '/history': {
    title: 'History of Mahjong | From Chinese Tile Game to Global Pastime',
    description: 'Explore the history of Mahjong, its regional development and the later rise of Mahjongg Solitaire.',
    kind: 'article',
  },
  '/events': {
    title: 'Mahjong Challenges and Events | Nine Gates Mahjong',
    description: 'Track daily challenge progress, complete portal goals and review current Nine Gates Mahjong events.',
    kind: 'page',
  },
  '/lobby': {
    title: 'Private Multiplayer Mahjong Training Rooms | Nine Gates Mahjong',
    description: 'Create or join a private real-time Mahjong training room for two to four players, with AI filling empty seats.',
    kind: 'trainer',
  },
  '/leaderboards': {
    title: 'Mahjong Rankings and Leaderboards | Nine Gates Mahjong',
    description: 'Review ratings, wins and category rankings for registered Nine Gates Mahjong players.',
    kind: 'page',
  },
  '/login': {
    title: 'Log In | Nine Gates Mahjong',
    description: 'Log in to your Nine Gates Mahjong profile.',
    kind: 'page',
    noIndex: true,
  },
  '/register': {
    title: 'Create a Free Mahjong Profile | Nine Gates Mahjong',
    description: 'Create a Nine Gates Mahjong profile for ratings, avatar choices and multiplayer results.',
    kind: 'page',
    noIndex: true,
  },
  '/guest': {
    title: 'Play as a Guest | Nine Gates Mahjong',
    description: 'Start a local guest session and play the core games without creating an account.',
    kind: 'page',
    noIndex: true,
  },
  '/profile': {
    title: 'Player Profile | Nine Gates Mahjong',
    description: 'View your Nine Gates Mahjong profile, rating, progress and avatar.',
    kind: 'page',
    noIndex: true,
  },
  '/privacy': {
    title: 'Privacy Policy | Nine Gates Mahjong',
    description: 'Learn how Nine Gates Mahjong uses account, session, multiplayer, browser-storage and advertising data.',
    kind: 'article',
  },
  '/terms': {
    title: 'Terms of Service | Nine Gates Mahjong',
    description: 'Read the rules for accounts, training games, multiplayer rooms, chat, ratings, advertising and fair play.',
    kind: 'article',
  },
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character]!);
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

export function canonicalRedirect(url: URL) {
  if (url.hostname !== 'www.ninegatesmahjong.com' && url.protocol === 'https:') return null;
  if (!['ninegatesmahjong.com', 'www.ninegatesmahjong.com'].includes(url.hostname)) return null;
  const canonical = new URL(url.pathname + url.search, SITE_ORIGIN);
  return Response.redirect(canonical.toString(), 308);
}

export function isKnownRoute(pathname: string) {
  return Object.prototype.hasOwnProperty.call(ROUTES, pathname);
}

export function routeMeta(pathname: string): RouteMeta {
  return ROUTES[pathname] ?? {
    title: 'Page Not Found | Nine Gates Mahjong',
    description: 'The requested Nine Gates Mahjong page could not be found. Browse the game hall, learning guides and Mahjong training modes.',
    kind: 'page',
    noIndex: true,
  };
}

export function applySecurityHeaders(response: Response) {
  const headers = new Headers(response.headers);
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  headers.set(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.highperformanceformat.com https://*.effectivecpmnetwork.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' wss: https:; frame-src 'self' https://www.highperformanceformat.com https://*.effectivecpmnetwork.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
  );
  return headers;
}

export function renderHtmlResponse(request: Request, response: Response, pathname: string) {
  const meta = routeMeta(pathname);
  const canonical = `${SITE_ORIGIN}${pathname === '/' ? '/' : pathname}`;
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
    ...segments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: labelSegment(segment),
      item: `${SITE_ORIGIN}/${segments.slice(0, index + 1).join('/')}`,
    })),
  ];
  const routeType = meta.kind === 'game' || meta.kind === 'trainer' ? 'VideoGame' : meta.kind === 'article' ? 'Article' : 'WebPage';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: 'Fire Dragon Interactive',
        alternateName: 'Nine Gates Mahjong',
        url: `${SITE_ORIGIN}/`,
        logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/logo_dark.png` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: 'Nine Gates Mahjong',
        inLanguage: 'en',
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      {
        '@type': routeType,
        '@id': `${canonical}#primary`,
        url: canonical,
        name: meta.title,
        headline: meta.title,
        description: meta.description,
        inLanguage: 'en',
        dateModified: '2026-07-22',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        image: DEFAULT_IMAGE,
        ...(routeType === 'VideoGame' ? {
          applicationCategory: 'Game',
          operatingSystem: 'Any modern web browser',
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
        } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };
  const fallback = `
    <main id="server-seo-fallback" style="max-width:900px;margin:0 auto;padding:48px 24px;font-family:system-ui,sans-serif;color:#f5ead0;background:#080810">
      <p style="color:#c4a35a;text-transform:uppercase;letter-spacing:.12em">Nine Gates Mahjong</p>
      <h1>${escapeHtml(meta.title.replace(/ \| Nine Gates Mahjong$/, ''))}</h1>
      <p>${escapeHtml(meta.description)}</p>
      <nav aria-label="Featured links">
        <a href="/play">Browse free games</a> · <a href="/learn">Learn Mahjong</a> · <a href="/variants">Compare variants</a>
      </nav>
    </main>`;

  const rewritten = new HTMLRewriter()
    .on('title', { element(element) { element.setInnerContent(meta.title); } })
    .on('meta[name="description"]', { element(element) { element.setAttribute('content', meta.description); } })
    .on('meta[name="robots"]', { element(element) { element.setAttribute('content', meta.noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'); } })
    .on('link[rel="canonical"]', { element(element) { element.setAttribute('href', canonical); } })
    .on('meta[property="og:title"]', { element(element) { element.setAttribute('content', meta.title); } })
    .on('meta[property="og:description"]', { element(element) { element.setAttribute('content', meta.description); } })
    .on('meta[property="og:url"]', { element(element) { element.setAttribute('content', canonical); } })
    .on('meta[property="og:image"]', { element(element) { element.setAttribute('content', DEFAULT_IMAGE); } })
    .on('meta[name="twitter:title"]', { element(element) { element.setAttribute('content', meta.title); } })
    .on('meta[name="twitter:description"]', { element(element) { element.setAttribute('content', meta.description); } })
    .on('meta[name="twitter:image"]', { element(element) { element.setAttribute('content', DEFAULT_IMAGE); } })
    .on('script#ngm-base-schema', { element(element) { element.setInnerContent(JSON.stringify(schema)); } })
    .on('#root', { element(element) { element.setInnerContent(fallback, { html: true }); } })
    .transform(response);

  const headers = applySecurityHeaders(rewritten);
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Vary', 'Accept-Encoding');

  return new Response(rewritten.body, {
    status: isKnownRoute(pathname) ? rewritten.status : 404,
    statusText: isKnownRoute(pathname) ? rewritten.statusText : 'Not Found',
    headers,
  });
}
