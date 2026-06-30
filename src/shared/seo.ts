export interface SeoRouteMeta {
  path: string;
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
  section: 'home' | 'games' | 'learn' | 'variants' | 'community' | 'account' | 'legal';
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
  noIndex?: boolean;
}

const SITE_URL = 'https://ninegatesmahjong.com';
const DEFAULT_IMAGE = `${SITE_URL}/hero-bg.jpg`;

export const SEO_ROUTES: SeoRouteMeta[] = [
  {
    path: '/',
    title: 'Nine Gates Mahjong - Free Online Mahjong Games and Mahjongg Portal',
    description:
      'Play free online Mahjongg Solitaire, daily Mahjong puzzles, Mahjong Connect, Shisen-Sho, memory games, and real four-player Mahjong training at Nine Gates Mahjong.',
    canonical: `${SITE_URL}/`,
    keywords: ['free online mahjong', 'mahjongg solitaire', 'mahjong games', 'play mahjong online', 'mahjong portal'],
    section: 'home',
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/play',
    title: 'Play Mahjong Games Free Online | Nine Gates Mahjong',
    description:
      'Choose free Mahjong games including Mahjongg Solitaire, Daily Mahjongg Puzzle, Zen Mahjongg, Time Attack, Mahjong Connect, Shisen-Sho, Mahjongg Memory, and Real Mahjong.',
    canonical: `${SITE_URL}/play`,
    keywords: ['play mahjong', 'mahjong games free', 'online mahjong games', 'mahjongg games'],
    section: 'games',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/mahjongg-solitaire',
    title: 'Play Mahjongg Solitaire Free Online | Nine Gates Mahjong',
    description:
      'Play free Mahjongg Solitaire online with guaranteed-solvable layouts, hints, undo, shuffle, touch controls, and polished Mahjong tile graphics.',
    canonical: `${SITE_URL}/mahjongg-solitaire`,
    keywords: ['mahjongg solitaire', 'free mahjongg solitaire', 'mahjong solitaire online', 'tile matching game'],
    section: 'games',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/daily',
    title: 'Daily Mahjongg Puzzle | Free Daily Mahjong Challenge',
    description:
      'Play today\'s free deterministic Mahjongg puzzle. Everyone gets the same solvable board with score, timer, hints, and daily challenge controls.',
    canonical: `${SITE_URL}/daily`,
    keywords: ['daily mahjong', 'daily mahjongg puzzle', 'mahjong challenge', 'free daily puzzle'],
    section: 'games',
    changefreq: 'daily',
    priority: '0.9',
  },
  {
    path: '/zen-mahjongg',
    title: 'Zen Mahjongg Online | Relaxing Free Mahjong Tile Game',
    description:
      'Play relaxing untimed Mahjongg with calm visuals, unlimited hints, shuffle controls, and responsive touch-friendly tiles.',
    canonical: `${SITE_URL}/zen-mahjongg`,
    keywords: ['zen mahjongg', 'relaxing mahjong', 'untimed mahjongg', 'free tile game'],
    section: 'games',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/time-attack',
    title: 'Mahjongg Time Attack | Fast Free Matching Game',
    description:
      'Race the Mahjongg timer, build combos, earn time bonuses, and clear the responsive tile grid before time expires.',
    canonical: `${SITE_URL}/time-attack`,
    keywords: ['mahjong time attack', 'fast mahjongg', 'mahjong speed game', 'tile matching challenge'],
    section: 'games',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/mahjong-connect',
    title: 'Play Mahjong Connect Online Free | Nine Gates Mahjong',
    description:
      'Play Mahjong Connect online. Link matching tiles using open paths with no more than two turns on desktop, tablet, or mobile.',
    canonical: `${SITE_URL}/mahjong-connect`,
    keywords: ['mahjong connect', 'mahjong connect online', 'free connect game', 'tile link puzzle'],
    section: 'games',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/shisen-sho',
    title: 'Play Shisen-Sho Online Free | Mahjong Tile Puzzle',
    description:
      'Play Shisen-Sho online with open-path pair matching, responsive controls, hints, shuffles, and polished Mahjong tile graphics.',
    canonical: `${SITE_URL}/shisen-sho`,
    keywords: ['shisen sho', 'shisen-sho online', 'mahjong tile puzzle', 'free shisen-sho'],
    section: 'games',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/mahjongg-memory',
    title: 'Mahjongg Memory Game | Free Tile Matching Challenge',
    description:
      'Train visual memory with a free Mahjong tile matching game featuring responsive cards, animated reveals, score, moves, and touch controls.',
    canonical: `${SITE_URL}/mahjongg-memory`,
    keywords: ['mahjongg memory', 'mahjong memory game', 'tile memory game', 'free memory game'],
    section: 'games',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/real-mahjong',
    title: 'Play Real Mahjong vs AI Online | Nine Gates Mahjong',
    description:
      'Play a free four-seat Mahjong training hand against three AI personalities. Draw, sort, discard, read the table, and complete a legal hand.',
    canonical: `${SITE_URL}/real-mahjong`,
    keywords: ['real mahjong online', 'four player mahjong', 'mahjong vs ai', 'learn real mahjong'],
    section: 'games',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/lobby',
    title: 'Multiplayer Mahjong Lobby | Nine Gates Mahjong',
    description:
      'Create or join real-time Mahjong rooms, play with friends, add AI seats, chat safely, and practice multiplayer table flow.',
    canonical: `${SITE_URL}/lobby`,
    keywords: ['multiplayer mahjong', 'mahjong lobby', 'online mahjong room', 'play mahjong with friends'],
    section: 'community',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/events',
    title: 'Mahjong Events and Daily Challenges | Nine Gates Mahjong',
    description:
      'Follow Mahjong events, daily challenges, weekly tile trials, leaderboard seasons, and fair-play tournament formats.',
    canonical: `${SITE_URL}/events`,
    keywords: ['mahjong events', 'mahjong tournaments', 'daily mahjong challenge', 'mahjong leaderboard'],
    section: 'community',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/leaderboards',
    title: 'Mahjong Leaderboards and Rankings | Nine Gates Mahjong',
    description:
      'Track Mahjongg Solitaire scores, daily puzzle streaks, Time Attack rankings, rated Mahjong results, and all-time leaderboard standings.',
    canonical: `${SITE_URL}/leaderboards`,
    keywords: ['mahjong leaderboard', 'mahjong rankings', 'mahjong scores', 'daily puzzle ranking'],
    section: 'community',
    changefreq: 'daily',
    priority: '0.8',
  },
  {
    path: '/variants',
    title: 'Mahjong Variants | Hong Kong, Riichi, MCR, American and Taiwanese',
    description:
      'Compare major Mahjong variants by region, rules, scoring complexity, player style, and current online play status.',
    canonical: `${SITE_URL}/variants`,
    keywords: ['mahjong variants', 'riichi mahjong', 'hong kong mahjong', 'american mahjongg', 'mcr mahjong'],
    section: 'variants',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/real-mahjong/hong-kong',
    title: 'Hong Kong Mahjong Rules, Style and Online Play | Nine Gates Mahjong',
    description:
      'Learn Hong Kong Mahjong rules, fan scoring, common hands, table style, and how this fast social variant differs from Riichi and MCR.',
    canonical: `${SITE_URL}/real-mahjong/hong-kong`,
    keywords: ['hong kong mahjong', 'hong kong mahjong rules', 'cantonese mahjong', 'fan scoring'],
    section: 'variants',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/real-mahjong/riichi',
    title: 'Japanese Riichi Mahjong Rules and Online Practice | Nine Gates Mahjong',
    description:
      'Learn Japanese Riichi Mahjong, including yaku, riichi declarations, dora, furiten, defense, and the strategic features that define the game.',
    canonical: `${SITE_URL}/real-mahjong/riichi`,
    keywords: ['riichi mahjong', 'japanese mahjong', 'riichi rules', 'yaku', 'furiten'],
    section: 'variants',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/real-mahjong/mcr',
    title: 'Chinese Official Mahjong MCR Rules and Online Practice | Nine Gates Mahjong',
    description:
      'Learn Mahjong Competition Rules, the international Chinese Official format with standardized patterns and an eight-point minimum.',
    canonical: `${SITE_URL}/real-mahjong/mcr`,
    keywords: ['mcr mahjong', 'chinese official mahjong', 'mahjong competition rules', 'eight point minimum'],
    section: 'variants',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/real-mahjong/american',
    title: 'American Mahjongg Rules, Jokers and Charleston | Nine Gates Mahjong',
    description:
      'Learn how American Mahjongg uses jokers, the Charleston pass, racks, and an annually updated card of valid hands.',
    canonical: `${SITE_URL}/real-mahjong/american`,
    keywords: ['american mahjongg', 'american mahjongg rules', 'charleston mahjong', 'mahjong jokers'],
    section: 'variants',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/real-mahjong/taiwanese',
    title: 'Taiwanese Mahjong Rules and Sixteen-Tile Play | Nine Gates Mahjong',
    description:
      'Learn Taiwanese Mahjong, including the sixteen-tile hand, five-meld structure, fast table rhythm, and common regional scoring traits.',
    canonical: `${SITE_URL}/real-mahjong/taiwanese`,
    keywords: ['taiwanese mahjong', 'sixteen tile mahjong', 'taiwanese mahjong rules', 'tai scoring'],
    section: 'variants',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/learn',
    title: 'Learn Mahjong | Rules, Strategy, History and Tutorials',
    description:
      'Learn Mahjong with beginner rules, Mahjongg Solitaire guidance, meld explanations, strategy, regional variants, interactive tutorials, and history.',
    canonical: `${SITE_URL}/learn`,
    keywords: ['learn mahjong', 'mahjong rules', 'mahjong strategy', 'how to play mahjong'],
    section: 'learn',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/how-to-play',
    title: 'How to Play Mahjong | Guided Lessons and Tutorials',
    description:
      'Move through interactive Mahjong lessons covering tile recognition, solitaire free-tile rules, real Mahjong turns, discards, melds, and beginner strategy.',
    canonical: `${SITE_URL}/how-to-play`,
    keywords: ['how to play mahjong', 'mahjong tutorial', 'mahjong lessons', 'beginner mahjong'],
    section: 'learn',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/history',
    title: 'History of Mahjong | Origins, Culture and Global Spread',
    description:
      'Explore the history of Mahjong from Chinese tile traditions to global Mahjongg, Riichi, American Mahjongg, online play, and cultural impact.',
    canonical: `${SITE_URL}/history`,
    keywords: ['mahjong history', 'history of mahjong', 'mahjong culture', 'mahjong origins'],
    section: 'learn',
    changefreq: 'yearly',
    priority: '0.8',
  },
  {
    path: '/learn/mahjong-vs-mahjongg',
    title: 'Mahjong vs Mahjongg: Real Mahjong and Solitaire Explained | Nine Gates Mahjong',
    description:
      'Learn the clear difference between four-player Mahjong, Mahjongg Solitaire, American Mahjongg, and the spellings players see online.',
    canonical: `${SITE_URL}/learn/mahjong-vs-mahjongg`,
    keywords: ['mahjong vs mahjongg', 'mahjongg solitaire', 'real mahjong', 'american mahjongg'],
    section: 'learn',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/learn/how-to-play-mahjongg-solitaire',
    title: 'How to Play Mahjongg Solitaire: Rules and Strategy | Nine Gates Mahjong',
    description:
      'Learn Mahjongg Solitaire rules, free-tile logic, matching, hints, shuffles, and practical strategy for clearing layered boards.',
    canonical: `${SITE_URL}/learn/how-to-play-mahjongg-solitaire`,
    keywords: ['how to play mahjongg solitaire', 'mahjongg solitaire rules', 'free tile logic', 'solitaire strategy'],
    section: 'learn',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/learn/how-to-play-real-mahjong',
    title: 'How to Play Mahjong: Beginner Four-Player Guide | Nine Gates Mahjong',
    description:
      'Learn the basic turn, hand structure, draw and discard flow, melds, winning, and table awareness used in real four-player Mahjong.',
    canonical: `${SITE_URL}/learn/how-to-play-real-mahjong`,
    keywords: ['how to play mahjong', 'four player mahjong rules', 'draw discard mahjong', 'mahjong beginner guide'],
    section: 'learn',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/learn/chi-pung-kong',
    title: 'Chi, Pung, Kong: Mahjong Melds Explained Clearly | Nine Gates Mahjong',
    description:
      'Understand chi sequences, pung triplets, kong quads, claim restrictions, exposed melds, and how calls change a Mahjong hand.',
    canonical: `${SITE_URL}/learn/chi-pung-kong`,
    keywords: ['chi pung kong', 'mahjong melds', 'mahjong chi', 'mahjong pung', 'mahjong kong'],
    section: 'learn',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/learn/beginner-strategy',
    title: 'Beginner Mahjong Strategy: Improve Hands and Discards | Nine Gates Mahjong',
    description:
      'Learn beginner Mahjong strategy for tile efficiency, pairs, shapes, safe discards, calls, and reading the table.',
    canonical: `${SITE_URL}/learn/beginner-strategy`,
    keywords: ['mahjong strategy', 'beginner mahjong strategy', 'mahjong discards', 'tile efficiency'],
    section: 'learn',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/learn/mahjong-variants',
    title: 'Mahjong Variants Guide: Hong Kong, Riichi, MCR and More | Nine Gates Mahjong',
    description:
      'Compare Hong Kong Mahjong, Japanese Riichi, Chinese Official MCR, American Mahjongg, and Taiwanese Mahjong.',
    canonical: `${SITE_URL}/learn/mahjong-variants`,
    keywords: ['mahjong variants guide', 'compare mahjong variants', 'riichi vs hong kong mahjong', 'mcr mahjong'],
    section: 'learn',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/login',
    title: 'Log In | Nine Gates Mahjong',
    description: 'Log in to your Nine Gates Mahjong profile.',
    canonical: `${SITE_URL}/login`,
    keywords: ['nine gates mahjong login'],
    section: 'account',
    changefreq: 'yearly',
    priority: '0.1',
    noIndex: true,
  },
  {
    path: '/register',
    title: 'Create a Mahjong Profile | Nine Gates Mahjong',
    description: 'Register a free Nine Gates Mahjong profile for ratings, streaks, multiplayer rooms, and events.',
    canonical: `${SITE_URL}/register`,
    keywords: ['nine gates mahjong register'],
    section: 'account',
    changefreq: 'yearly',
    priority: '0.1',
    noIndex: true,
  },
  {
    path: '/guest',
    title: 'Play as Guest | Nine Gates Mahjong',
    description: 'Start playing Nine Gates Mahjong as a guest without creating an account.',
    canonical: `${SITE_URL}/guest`,
    keywords: ['play mahjong as guest'],
    section: 'account',
    changefreq: 'yearly',
    priority: '0.1',
    noIndex: true,
  },
  {
    path: '/profile',
    title: 'Your Profile | Nine Gates Mahjong',
    description: 'Manage your private Nine Gates Mahjong profile.',
    canonical: `${SITE_URL}/profile`,
    keywords: ['mahjong profile'],
    section: 'account',
    changefreq: 'yearly',
    priority: '0.1',
    noIndex: true,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Nine Gates Mahjong',
    description: 'Read the Nine Gates Mahjong privacy policy, data handling notes, account storage, and advertising disclosures.',
    canonical: `${SITE_URL}/privacy`,
    keywords: ['nine gates mahjong privacy'],
    section: 'legal',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    path: '/terms',
    title: 'Terms of Service | Nine Gates Mahjong',
    description: 'Read the Nine Gates Mahjong terms for fair play, accounts, chat, rankings, events, intellectual property, and no-wagering use.',
    canonical: `${SITE_URL}/terms`,
    keywords: ['nine gates mahjong terms'],
    section: 'legal',
    changefreq: 'yearly',
    priority: '0.3',
  },
];

const routeByPath = new Map(SEO_ROUTES.map((route) => [route.path, route]));

export function normalizedSeoPath(pathname: string) {
  if (!pathname || pathname === '/') return '/';
  const clean = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return clean || '/';
}

export function getSeoRoute(pathname: string): SeoRouteMeta {
  const path = normalizedSeoPath(pathname);
  return routeByPath.get(path) ?? {
    path,
    title: 'Page Not Found | Nine Gates Mahjong',
    description:
      'This Nine Gates Mahjong page was not found. Continue to free Mahjong games, Mahjongg Solitaire, real Mahjong practice, variants, and tutorials.',
    canonical: `${SITE_URL}${path === '/' ? '/' : path}`,
    keywords: ['free online mahjong', 'mahjong games', 'mahjongg solitaire'],
    section: 'home',
    changefreq: 'weekly',
    priority: '0.5',
    noIndex: true,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsonForScript(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildStructuredData(pathname: string) {
  const meta = getSeoRoute(pathname);
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Nine Gates Mahjong',
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo_dark.png`,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Nine Gates Mahjong',
      description:
        'A free online Mahjong portal for Mahjongg Solitaire, daily puzzles, real Mahjong practice, regional variants, tutorials, and leaderboards.',
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': meta.section === 'learn' ? 'Article' : 'WebPage',
      '@id': `${meta.canonical}#webpage`,
      url: meta.canonical,
      name: meta.title,
      headline: meta.title,
      description: meta.description,
      image: DEFAULT_IMAGE,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: meta.keywords.map((name) => ({ '@type': 'Thing', name })),
      inLanguage: 'en',
    },
  ];

  if (meta.section === 'games') {
    graph.push({
      '@type': 'VideoGame',
      '@id': `${meta.canonical}#game`,
      name: meta.title.replace(' | Nine Gates Mahjong', ''),
      url: meta.canonical,
      description: meta.description,
      image: DEFAULT_IMAGE,
      applicationCategory: 'Game',
      gamePlatform: ['Web browser', 'Desktop', 'Tablet', 'Mobile'],
      operatingSystem: 'Any modern web browser',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: 0,
        priceCurrency: 'USD',
      },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function buildSeoHeadTags(pathname: string) {
  const meta = getSeoRoute(pathname);
  const robots = meta.noIndex
    ? 'noindex,follow'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  const keywords = meta.keywords.join(', ');

  return [
    '<!-- Nine Gates route SEO -->',
    `<title data-rh="true">${escapeHtml(meta.title)}</title>`,
    `<meta data-rh="true" name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta data-rh="true" name="keywords" content="${escapeHtml(keywords)}" />`,
    `<link data-rh="true" rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta data-rh="true" name="robots" content="${robots}" />`,
    '<meta data-rh="true" property="og:site_name" content="Nine Gates Mahjong" />',
    `<meta data-rh="true" property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta data-rh="true" property="og:description" content="${escapeHtml(meta.description)}" />`,
    '<meta data-rh="true" property="og:type" content="website" />',
    `<meta data-rh="true" property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    `<meta data-rh="true" property="og:image" content="${DEFAULT_IMAGE}" />`,
    '<meta data-rh="true" name="twitter:card" content="summary_large_image" />',
    `<meta data-rh="true" name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta data-rh="true" name="twitter:image" content="${DEFAULT_IMAGE}" />`,
    `<script data-rh="true" type="application/ld+json">${escapeJsonForScript(buildStructuredData(pathname))}</script>`,
  ].join('\n  ');
}
