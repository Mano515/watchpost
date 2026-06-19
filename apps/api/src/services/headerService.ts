import { HeaderScanResult, ScoreDetail } from '@watchpost/shared-types';
import { buildScore } from '../scoring';
import { httpGet } from '../http/client';

const SECURITY_HEADERS = [
  {
    name: 'content-security-policy',
    label: 'Content-Security-Policy',
    recommendation: 'Add a CSP header to prevent XSS and data injection attacks.',
  },
  {
    name: 'strict-transport-security',
    label: 'Strict-Transport-Security',
    recommendation: 'Add HSTS to enforce HTTPS connections.',
  },
  {
    name: 'x-frame-options',
    label: 'X-Frame-Options',
    recommendation: 'Add X-Frame-Options to prevent clickjacking attacks.',
  },
  {
    name: 'x-content-type-options',
    label: 'X-Content-Type-Options',
    recommendation: 'Add "nosniff" to prevent MIME-type sniffing.',
  },
  {
    name: 'referrer-policy',
    label: 'Referrer-Policy',
    recommendation: 'Add a Referrer-Policy to control referrer information leakage.',
  },
  {
    name: 'permissions-policy',
    label: 'Permissions-Policy',
    recommendation: 'Add Permissions-Policy to restrict access to browser features.',
  },
];

export async function scanHeaders(url: string): Promise<HeaderScanResult> {
  const res = await httpGet(url);
  const headerMap: Record<string, string | null> = {};
  const details: ScoreDetail[] = [];

  for (const h of SECURITY_HEADERS) {
    const value = res.headers.get(h.name);
    headerMap[h.name] = value;
    details.push({
      label: h.label,
      passed: value !== null,
      recommendation: value === null ? h.recommendation : undefined,
    });
  }

  return { url, headers: headerMap, ...buildScore(details) };
}
