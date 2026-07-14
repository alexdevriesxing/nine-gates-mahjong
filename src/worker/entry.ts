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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const redirect = canonicalRedirect(url);
    if (redirect) return secureResponse(redirect);

    const limited = rateLimitFor(request, url);
    if (limited) return secureResponse(limited);

    const response = await app.fetch(request, env);
    const contentType = response.headers.get('Content-Type') ?? '';

    if (contentType.includes('text/html')) {
      return renderHtmlResponse(request, response, url.pathname);
    }

    return secureResponse(response);
  },
};
