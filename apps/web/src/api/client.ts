import type {
  HeaderScanResult,
  PasswordCheckResult,
  BreachCheckResult,
  DomainAuditResult,
  VulnScanResult,
  SiteAuditResult,
} from '@watchpost/shared-types';

const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

export class RateLimitError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super(`rate-limited:${retryAfterSeconds}`);
    this.name = 'RateLimitError';
  }
}

async function post<T>(path: string, body: Record<string, string>): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    const resetHeader = res.headers.get('RateLimit-Reset') ?? res.headers.get('X-RateLimit-Reset');
    let seconds = 60;
    if (resetHeader) {
      const reset = Number(resetHeader);
      seconds = Math.max(1, Math.ceil(reset - Date.now() / 1000));
    }
    throw new RateLimitError(seconds);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data as T;
}

export const api = {
  scanHeaders:   (url: string)      => post<HeaderScanResult>('/headers',  { url }),
  checkPassword: (password: string) => post<PasswordCheckResult>('/password', { password }),
  checkBreach:   (email: string)    => post<BreachCheckResult>('/breach',  { email }),
  auditDomain:   (domain: string)   => post<DomainAuditResult>('/domain',  { domain }),
  scanVulns:     (url: string)      => post<VulnScanResult>('/vuln',      { url }),
  auditSite:     (domain: string)   => post<SiteAuditResult>('/site-audit', { domain }),
};
