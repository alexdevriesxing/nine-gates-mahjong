import app, { MahjongRoom } from './index';
import {
  ADSTERRA_NATIVE,
  ADSTERRA_PLACEMENTS,
  isAdsterraPlacementId,
} from '../shared/ads';
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
<body><script async data-cfasync="false" src="${ADSTERRA_NATIVE.scriptUrl}"></script><div id="${ADSTERRA_NATIVE.containerId}"></div></body></html>`, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }));
  }

  if (url.pathname !== '/ad-frame') return null;
  const placementId = url.searchParams.get('placement') ?? '';
  if (!isAdsterraPlacementId(placementId)) {
    return secureResponse(new Response('Invalid advertising frame parameters.', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }));
  }

  const { key, width, height } = ADSTERRA_PLACEMENTS[placementId];
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

function retiredAdvertisingFrame(pathname: string) {
  if (!['/ad.html', '/ad-frame.htm', '/native.html', '/native-frame.htm'].includes(pathname)) return null;
  return secureResponse(new Response('This advertising endpoint has been retired.', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
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

    const retiredFrame = retiredAdvertisingFrame(url.pathname);
    if (retiredFrame) return retiredFrame;

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
