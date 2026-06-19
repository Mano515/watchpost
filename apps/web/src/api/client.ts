import type {
  HeaderScanResult,
  PasswordCheckResult,
  BreachCheckResult,
  DomainAuditResult,
} from '@watchpost/shared-types';

const BASE = '/api';

async function post<T>(path: string, body: Record<string, string>): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data as T;
}

export const api = {
  scanHeaders:  (url: string)    => post<HeaderScanResult>('/headers',  { url }),
  checkPassword:(password: string) => post<PasswordCheckResult>('/password', { password }),
  checkBreach:  (email: string)  => post<BreachCheckResult>('/breach',  { email }),
  auditDomain:  (domain: string) => post<DomainAuditResult>('/domain',  { domain }),
};
