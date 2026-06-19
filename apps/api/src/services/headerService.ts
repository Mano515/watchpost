import { HeaderScanResult, ScoreDetail } from '@watchpost/shared-types';
import { buildScore } from '../scoring';
import { httpGet } from '../http/client';
import { TtlCache } from '../cache/ttlCache';

const cache = new TtlCache<HeaderScanResult>(5 * 60_000);

const SECURITY_HEADERS: Array<{ name: string; key: string }> = [
  { name: 'content-security-policy',   key: 'header.csp'  },
  { name: 'strict-transport-security', key: 'header.hsts' },
  { name: 'x-frame-options',           key: 'header.xfo'  },
  { name: 'x-content-type-options',    key: 'header.xcto' },
  { name: 'referrer-policy',           key: 'header.rp'   },
  { name: 'permissions-policy',        key: 'header.pp'   },
];

async function detectHttpsRedirect(url: string): Promise<boolean> {
  try {
    const httpUrl = url.replace(/^https:\/\//, 'http://');
    if (httpUrl === url) return true; // already http, skip
    const res = await httpGet(httpUrl, { redirect: 'manual' });
    const location = res.headers.get('location') ?? '';
    return res.status >= 300 && res.status < 400 && location.startsWith('https://');
  } catch {
    return false;
  }
}

export async function scanHeaders(url: string): Promise<HeaderScanResult> {
  const cached = cache.get(url);
  if (cached) return cached;

  const [res, httpsRedirect] = await Promise.all([
    httpGet(url),
    detectHttpsRedirect(url),
  ]);

  const headerMap: Record<string, string | null> = {};
  const details: ScoreDetail[] = [];

  for (const h of SECURITY_HEADERS) {
    const value = res.headers.get(h.name);
    headerMap[h.name] = value;
    details.push({ key: h.key, label: h.name, passed: value !== null });
  }

  details.push({
    key: 'header.https_redirect',
    label: 'HTTP → HTTPS redirect',
    passed: httpsRedirect,
  });

  const result: HeaderScanResult = { url, headers: headerMap, ...buildScore(details) };
  cache.set(url, result);
  return result;
}
