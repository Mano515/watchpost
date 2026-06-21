import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';
import { SiteAuditResult, HeaderScanResult, VulnScanResult, DomainAuditResult, ReputationResult, CertTransparencyResult, scoreToGrade } from '@watchpost/shared-types';
import { scanHeaders } from './headerService';
import { scanVulnerabilities } from './vulnerabilityService';
import { auditDomain } from './domainService';
import { checkReputation } from './reputationService';
import { checkCertTransparency } from './certTransparencyService';
import { TtlCache } from '../cache/ttlCache';

const cache = new TtlCache<SiteAuditResult>(5 * 60_000);

// ── SQLite scan cache (survives restarts, max 1 row per domain) ───────────────

const DATA_DIR = process.env['DATA_DIR'] ?? path.join(__dirname, '../../data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'watchpost.db'));
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS scan_cache (
    domain      TEXT PRIMARY KEY,
    result_json TEXT NOT NULL,
    scanned_at  TEXT NOT NULL
  )
`);

const ONE_HOUR = 60 * 60 * 1000;

function dbGet(domain: string): SiteAuditResult | null {
  const row = db.prepare('SELECT result_json, scanned_at FROM scan_cache WHERE domain = ?').get(domain) as
    { result_json: string; scanned_at: string } | undefined;
  if (!row) return null;
  const age = Date.now() - new Date(row.scanned_at).getTime();
  if (age > 24 * ONE_HOUR) return null; // stale after 24 h
  return JSON.parse(row.result_json) as SiteAuditResult;
}

function dbSet(domain: string, result: SiteAuditResult): void {
  db.prepare(
    'INSERT OR REPLACE INTO scan_cache (domain, result_json, scanned_at) VALUES (?, ?, ?)',
  ).run(domain, JSON.stringify(result), result.scannedAt);
}

// ── Shared result builder ─────────────────────────────────────────────────────

function buildResult(
  domain: string,
  headersSettled:    PromiseSettledResult<HeaderScanResult>,
  vulnSettled:       PromiseSettledResult<VulnScanResult>,
  domainSettled:     PromiseSettledResult<DomainAuditResult>,
  reputationSettled: PromiseSettledResult<ReputationResult>,
  ctSettled:         PromiseSettledResult<CertTransparencyResult>,
): SiteAuditResult {
  const headers          = headersSettled.status    === 'fulfilled' ? headersSettled.value    : null;
  const headersError     = headersSettled.status    === 'rejected'  ? (headersSettled.reason as Error).message    : null;
  const vuln             = vulnSettled.status       === 'fulfilled' ? vulnSettled.value       : null;
  const vulnError        = vulnSettled.status       === 'rejected'  ? (vulnSettled.reason as Error).message      : null;
  const domainAudit      = domainSettled.status     === 'fulfilled' ? domainSettled.value     : null;
  const domainError      = domainSettled.status     === 'rejected'  ? (domainSettled.reason as Error).message    : null;
  const reputation       = reputationSettled.status === 'fulfilled' ? reputationSettled.value : null;
  const reputationError  = reputationSettled.status === 'rejected'  ? (reputationSettled.reason as Error).message : null;
  const certTransparency = ctSettled.status         === 'fulfilled' ? ctSettled.value         : null;
  const certTransparencyError = ctSettled.status    === 'rejected'  ? (ctSettled.reason as Error).message        : null;

  // Weighted average: vuln 30 %, headers 25 %, SSL 20 %, email security 15 %, reputation 10 %
  const parts: Array<{ score: number; weight: number }> = [];
  if (headers)                           parts.push({ score: headers.score,                              weight: 0.25 });
  if (vuln)                              parts.push({ score: vuln.score,                                 weight: 0.30 });
  if (domainAudit?.ssl)                  parts.push({ score: domainAudit.ssl.score,                     weight: 0.20 });
  if (domainAudit?.dns?.emailSecurity)   parts.push({ score: domainAudit.dns.emailSecurity.score.score, weight: 0.15 });
  if (reputation)                        parts.push({ score: reputation.score,                           weight: 0.10 });

  const totalWeight  = parts.reduce((s, p) => s + p.weight, 0);
  const overallScore = totalWeight > 0
    ? Math.round(parts.reduce((s, p) => s + p.score * p.weight, 0) / totalWeight)
    : 0;

  return {
    domain,
    overallScore,
    overallGrade: scoreToGrade(overallScore),
    headers,
    headersError,
    vuln,
    vulnError,
    domainAudit,
    domainError,
    reputation,
    reputationError,
    certTransparency,
    certTransparencyError,
    scannedAt: new Date().toISOString(),
  };
}

// ── Non-streaming (cached) ────────────────────────────────────────────────────

export async function auditSite(domain: string): Promise<SiteAuditResult> {
  const cached = cache.get(domain);
  if (cached) return cached;

  // Check SQLite (survives server restarts)
  const persisted = dbGet(domain);
  if (persisted) {
    const age = Date.now() - new Date(persisted.scannedAt).getTime();
    if (age < ONE_HOUR) {
      cache.set(domain, persisted); // warm up in-memory cache
      return persisted;
    }
    // 1–24 h old: return stale while triggering background refresh
    setImmediate(() => refreshInBackground(domain));
    cache.set(domain, persisted);
    return persisted;
  }

  const url = `https://${domain}`;

  const settled = await Promise.allSettled([
    scanHeaders(url),
    scanVulnerabilities(url),
    auditDomain(domain),
    checkReputation(domain),
    checkCertTransparency(domain),
  ]);

  const result = buildResult(domain, settled[0], settled[1], settled[2], settled[3], settled[4]);
  cache.set(domain, result);
  dbSet(domain, result);
  return result;
}

async function refreshInBackground(domain: string): Promise<void> {
  try {
    const url = `https://${domain}`;
    const settled = await Promise.allSettled([
      scanHeaders(url), scanVulnerabilities(url), auditDomain(domain),
      checkReputation(domain), checkCertTransparency(domain),
    ]);
    const result = buildResult(domain, settled[0], settled[1], settled[2], settled[3], settled[4]);
    cache.set(domain, result);
    dbSet(domain, result);
  } catch {
    // silent — background refresh; caller already has stale data
  }
}

// ── Streaming (with progress callback) ───────────────────────────────────────

export function getCachedAudit(domain: string): SiteAuditResult | null {
  return cache.get(domain) ?? dbGet(domain);
}

export async function streamAuditSite(
  domain: string,
  onProgress: (step: string, pct: number) => void,
): Promise<SiteAuditResult> {
  const cached = cache.get(domain);
  if (cached) {
    onProgress('cached', 100);
    return cached;
  }

  const url = `https://${domain}`;
  let completed = 0;
  const total = 5;

  function tick(step: string) {
    completed++;
    onProgress(step, 10 + Math.round((completed / total) * 85));
  }

  onProgress('start', 5);

  const settled = await Promise.allSettled([
    scanHeaders(url).then((r) => { tick('headers'); return r; }).catch((e: unknown) => { tick('headers'); throw e; }),
    scanVulnerabilities(url).then((r) => { tick('vuln'); return r; }).catch((e: unknown) => { tick('vuln'); throw e; }),
    auditDomain(domain).then((r) => { tick('domain'); return r; }).catch((e: unknown) => { tick('domain'); throw e; }),
    checkReputation(domain).then((r) => { tick('reputation'); return r; }).catch((e: unknown) => { tick('reputation'); throw e; }),
    checkCertTransparency(domain).then((r) => { tick('ct'); return r; }).catch((e: unknown) => { tick('ct'); throw e; }),
  ]);

  const result = buildResult(domain, settled[0], settled[1], settled[2], settled[3], settled[4]);
  cache.set(domain, result);
  dbSet(domain, result);
  onProgress('done', 100);
  return result;
}
