import app, { MahjongRoom } from './index';
import { applySecurityHeaders, canonicalRedirect, renderHtmlResponse } from './seo';
import { enforceRateLimit } from './rateLimit';

export { MahjongRoom };

interface Env {
  ASSETS: Fetcher;
  MAHJONG_ROOM: DurableObjectNamespace;
  DB: D1Database;
}

function secureResponse(response: Response) {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: applySecurityHeaders(response),
  });
}

function advertisingFrame(url: URL) {
  if (url.pathname === '/native-frame') {
    return secureResponse(new Response(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex,nofollow"><style>body{margin:0;padding:0;background:transparent;overflow:hidden}</style></head>
<body><script async data-cfasync="false" src="https://pl29884536.effectivecpmnetwork.com/c9947e22755623a8fe8d556aa1ba06d5/invoke.js"></script><div id="container-c9947e22755623a8fe8d556aa1ba06d5"></div></body></html>`, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }));
  }

  if (url.pathname !== '/ad-frame') return null;
  const key = url.searchParams.get('key') ?? '';
  const width = Number.parseInt(url.searchParams.get('w') ?? '0', 10);
  const height = Number.parseInt(url.searchParams.get('h') ?? '0', 10);
  if (!/^[a-f0-9]+$/i.test(key) || width <= 0 || width > 2000 || height <= 0 || height > 2000) {
    return secureResponse(new Response('Invalid advertising frame parameters.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    }));
  }

  const options = JSON.stringify({ key, format: 'iframe', height, width, params: {} });
  return secureResponse(new Response(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex,nofollow"><style>body{margin:0;padding:0;background:transparent;overflow:hidden;display:flex;justify-content:center;align-items:center}</style></head>
<body><script>window.atOptions=${options};document.write('<script src="https://www.highperformanceformat.com/${key}/invoke.js"></'+'script>');</script></body></html>`, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  }));
}

function rateLimitFor(request: Request, url: URL) {
  if (request.method === 'POST' && url.pathname === '/api/auth/register') {
    return enforceRateLimit(request, 'register', 5, 15 * 60_000);
  }
  if (request.method === 'POST' && url.pathname === '/api/auth/login') {
    return enforceRateLimit(request, 'login', 10, 15 * 60_000);
  }
  if (request.method === 'POST' && url.pathname === '/api/rooms') {
    return enforceRateLimit(request, 'room-create', 20, 10 * 60_000);
  }
  if (request.method === 'PUT' && url.pathname === '/api/profile') {
    return enforceRateLimit(request, 'profile-update', 30, 10 * 60_000);
  }
  return null;
}

function shouldApplyCanonicalRedirect(request: Request) {
  // CF-Visitor is added on real Cloudflare edge requests. Wrangler's local runtime
  // can internally present the configured production hostname, so hostname alone
  // is not a reliable local-development signal.
  return request.headers.has('CF-Visitor');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const redirect = shouldApplyCanonicalRedirect(request) ? canonicalRedirect(url) : null;
    if (redirect) return secureResponse(redirect);

    const frame = advertisingFrame(url);
    if (frame) return frame;

    const limited = rateLimitFor(request, url);
    if (limited) return secureResponse(limited);

    const response = await app.fetch(request, env);

    // A Cloudflare WebSocket upgrade response carries an attached WebSocket object.
    // Reconstructing the Response to add headers would silently discard that object.
    if (response.status === 101 || response.webSocket) return response;

    const contentType = response.headers.get('Content-Type') ?? '';
    if (contentType.includes('text/html')) {
      return renderHtmlResponse(request, response, url.pathname);
    }

    return secureResponse(response);
  },
};
