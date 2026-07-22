const origin = (process.env.NGM_PRODUCTION_ORIGIN || 'https://ninegatesmahjong.com').replace(/\/$/, '');
const maxAttempts = Number.parseInt(process.env.NGM_PRODUCTION_MAX_ATTEMPTS || '30', 10);
const retryDelayMs = Number.parseInt(process.env.NGM_PRODUCTION_RETRY_DELAY_MS || '10000', 10);
const expectedReleaseMarker = 'Last reviewed: 2026-07-22 (production audit release)';

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function request(path, options = {}) {
  const response = await fetch(`${origin}${path}`, {
    redirect: options.redirect || 'follow',
    headers: {
      'User-Agent': 'Nine-Gates-Production-Smoke/1.0',
      Accept: options.accept || '*/*',
    },
  });
  const body = options.readBody === false ? '' : await response.text();
  return { response, body };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForRelease() {
  let lastStatus = 0;
  let lastBody = '';
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await request('/llms.txt', { accept: 'text/plain' });
      lastStatus = result.response.status;
      lastBody = result.body;
      if (result.response.status === 200 && result.body.includes(expectedReleaseMarker)) {
        return { attempts: attempt, result };
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < maxAttempts) {
      console.log(`Release marker not live yet (attempt ${attempt}/${maxAttempts}); retrying.`);
      await sleep(retryDelayMs);
    }
  }

  throw new Error(
    `Production release marker did not appear after ${maxAttempts} attempts. `
      + `Last status: ${lastStatus || 'request failed'}. `
      + `Last error: ${lastError ? String(lastError) : 'none'}. `
      + `Body preview: ${lastBody.slice(0, 200)}`
  );
}

const release = await waitForRelease();

const home = await request('/', { accept: 'text/html' });
assert(home.response.status === 200, `Home returned ${home.response.status}.`);
assert(home.body.includes('Nine Gates Mahjong — Free Mahjongg Games and Mahjong Training'), 'Home initial HTML is missing the production title.');
assert(home.body.includes('server-seo-fallback'), 'Home initial HTML is missing the crawlable fallback.');
assert((home.response.headers.get('x-content-type-options') || '').toLowerCase() === 'nosniff', 'Home is missing X-Content-Type-Options.');
assert((home.response.headers.get('strict-transport-security') || '').includes('max-age='), 'Home is missing HSTS.');
assert((home.response.headers.get('referrer-policy') || '') === 'strict-origin-when-cross-origin', 'Home is missing the expected Referrer-Policy.');

const solitaire = await request('/mahjongg-solitaire', { accept: 'text/html' });
assert(solitaire.response.status === 200, `Solitaire route returned ${solitaire.response.status}.`);
assert(solitaire.body.includes('Play Mahjongg Solitaire Free Online'), 'Solitaire initial HTML is missing route-specific metadata.');
assert(solitaire.body.includes('guaranteed-solvable layered Mahjongg Solitaire board'), 'Solitaire initial HTML is missing the route description.');
assert(solitaire.body.includes('WebApplication') && solitaire.body.includes('GameApplication'), 'Solitaire initial HTML is missing web-game structured data.');

const approvedFrame = await request('/ad-frame?placement=320x50', { accept: 'text/html' });
assert(approvedFrame.response.status === 200, `Approved advertising frame returned ${approvedFrame.response.status}.`);
assert((approvedFrame.response.headers.get('x-robots-tag') || '').toLowerCase() === 'noindex, nofollow', 'Approved advertising frame is missing its noindex header.');

const rejectedFrame = await request('/ad-frame?key=cdc33de3506804ba73d2d3661ed4fd0a&w=320&h=50', { accept: 'text/html' });
assert(rejectedFrame.response.status === 400, `Unapproved advertising parameters returned ${rejectedFrame.response.status}.`);

const retiredFrame = await request('/ad.html', { accept: 'text/html' });
assert(retiredFrame.response.status === 410, `Retired advertising endpoint returned ${retiredFrame.response.status}.`);

const heroWebp = await request('/hero-bg.webp', { readBody: false });
assert(heroWebp.response.status === 200, `Optimized hero image returned ${heroWebp.response.status}.`);
assert((heroWebp.response.headers.get('content-type') || '').includes('image/webp'), 'Optimized hero image has the wrong content type.');

const sichuan = await request('/real-mahjong/sichuan', { accept: 'text/html' });
assert(sichuan.response.status === 200, `Sichuan trainer route returned ${sichuan.response.status}.`);
assert(sichuan.body.includes('Sichuan Bloody Rules Mahjong and Dingque Trainer'), 'Sichuan route is missing its edge-rendered metadata.');

const zungJung = await request('/real-mahjong/zung-jung', { accept: 'text/html' });
assert(zungJung.response.status === 200, `Zung Jung trainer route returned ${zungJung.response.status}.`);
assert(zungJung.body.includes('Zung Jung Mahjong Rules and Pattern Trainer'), 'Zung Jung route is missing its edge-rendered metadata.');

const missing = await request('/production-smoke-route-that-does-not-exist', { accept: 'text/html' });
assert(missing.response.status === 404, `Unknown route returned ${missing.response.status} instead of 404.`);
assert(missing.body.includes('Page Not Found'), 'Unknown route body is missing its not-found metadata.');

const nativeFrame = await request('/native-frame', { accept: 'text/html' });
assert(nativeFrame.response.status === 200, `Native advertising frame returned ${nativeFrame.response.status}.`);
assert((nativeFrame.response.headers.get('x-robots-tag') || '').toLowerCase() === 'noindex, nofollow', 'Native frame is missing its noindex header.');

const wwwResponse = await fetch('https://www.ninegatesmahjong.com/', {
  redirect: 'manual',
  headers: { 'User-Agent': 'Nine-Gates-Production-Smoke/1.0' },
});
assert([301, 302, 307, 308].includes(wwwResponse.status), `www hostname returned ${wwwResponse.status} instead of a redirect.`);
assert(wwwResponse.headers.get('location') === 'https://ninegatesmahjong.com/', `www hostname redirected to ${wwwResponse.headers.get('location')}.`);

const trailingSlashResponse = await fetch('https://ninegatesmahjong.com/play/', {
  redirect: 'manual',
  headers: { 'User-Agent': 'Nine-Gates-Production-Smoke/1.0' },
});
assert(trailingSlashResponse.status === 308, `Trailing-slash URL returned ${trailingSlashResponse.status} instead of 308.`);
assert(trailingSlashResponse.headers.get('location') === 'https://ninegatesmahjong.com/play', `Trailing-slash URL redirected to ${trailingSlashResponse.headers.get('location')}.`);

console.log(JSON.stringify({
  origin,
  releaseMarkerAttempts: release.attempts,
  homeStatus: home.response.status,
  solitaireStatus: solitaire.response.status,
  sichuanStatus: sichuan.response.status,
  zungJungStatus: zungJung.response.status,
  notFoundStatus: missing.response.status,
  nativeFrameStatus: nativeFrame.response.status,
  approvedAdFrameStatus: approvedFrame.response.status,
  rejectedAdFrameStatus: rejectedFrame.response.status,
  retiredAdFrameStatus: retiredFrame.response.status,
  heroWebpStatus: heroWebp.response.status,
  wwwRedirectStatus: wwwResponse.status,
  trailingSlashRedirectStatus: trailingSlashResponse.status,
  securityHeaders: true,
  edgeMetadata: true,
  releaseMarker: true,
}));
