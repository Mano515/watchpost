import { HeaderScanResult, ScoreDetail } from '@watchpost/shared-types';
import { buildScore } from '../scoring';
import { httpGet } from '../http/client';
import { TtlCache } from '../cache/ttlCache';

const cache = new TtlCache<HeaderScanResult>(5 * 60_000);

const SIX_MONTHS_SEC = 15_552_000;

async function detectHttpsRedirect(url: string): Promise<boolean> {
  try {
    const httpUrl = url.replace(/^https:\/\//, 'http://');
    if (httpUrl === url) return true;
    const res = await httpGet(httpUrl, { redirect: 'manual' });
    const location = res.headers.get('location') ?? '';
    return res.status >= 300 && res.status < 400 && location.startsWith('https://');
  } catch {
    return false;
  }
}

function parseHstsMaxAge(header: string): number {
  const match = header.toLowerCase().match(/max-age=(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
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

  // ── Basic presence checks ─────────────────────────────────────────────────
  const basicHeaders: Array<{ name: string; key: string }> = [
    { name: 'content-security-policy',   key: 'header.csp'  },
    { name: 'x-frame-options',           key: 'header.xfo'  },
    { name: 'x-content-type-options',    key: 'header.xcto' },
    { name: 'referrer-policy',           key: 'header.rp'   },
    { name: 'permissions-policy',        key: 'header.pp'   },
  ];

  for (const h of basicHeaders) {
    const value = res.headers.get(h.name);
    headerMap[h.name] = value;
    details.push({ key: h.key, label: h.name, passed: value !== null });
  }

  // ── HSTS quality ──────────────────────────────────────────────────────────
  const hsts = res.headers.get('strict-transport-security');
  headerMap['strict-transport-security'] = hsts;
  details.push({
    key: 'header.hsts',
    label: 'Strict-Transport-Security present',
    passed: hsts !== null,
  });
  if (hsts) {
    const maxAge = parseHstsMaxAge(hsts);
    details.push({
      key: 'header.hsts_age',
      label: `HSTS max-age ≥ 6 months (${SIX_MONTHS_SEC}s)`,
      passed: maxAge >= SIX_MONTHS_SEC,
    });
    details.push({
      key: 'header.hsts_subdomains',
      label: 'HSTS includes subdomains',
      passed: hsts.toLowerCase().includes('includesubdomains'),
    });
  }

  // ── X-XSS-Protection (harmful if set to "1") ─────────────────────────────
  const xxss = res.headers.get('x-xss-protection');
  headerMap['x-xss-protection'] = xxss;
  details.push({
    key: 'header.no_xxss',
    label: 'X-XSS-Protection absent or disabled',
    // present and not "0" is BAD — modern browsers ignore or misuse it
    passed: !xxss || xxss.trim() === '0',
  });

  // ── HTTPS redirect ────────────────────────────────────────────────────────
  details.push({
    key: 'header.https_redirect',
    label: 'HTTP → HTTPS redirect',
    passed: httpsRedirect,
  });

  const result: HeaderScanResult = { url, headers: headerMap, ...buildScore(details) };
  cache.set(url, result);
  return result;
}
