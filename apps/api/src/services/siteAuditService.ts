import { SiteAuditResult, HeaderScanResult, VulnScanResult, DomainAuditResult, ReputationResult, CertTransparencyResult, scoreToGrade } from '@watchpost/shared-types';
import { scanHeaders } from './headerService';
import { scanVulnerabilities } from './vulnerabilityService';
import { auditDomain } from './domainService';
import { checkReputation } from './reputationService';
import { checkCertTransparency } from './certTransparencyService';
import { TtlCache } from '../cache/ttlCache';

const cache = new TtlCache<SiteAuditResult>(5 * 60_000);

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
  return result;
}

// ── Streaming (with progress callback) ───────────────────────────────────────

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
  onProgress('done', 100);
  return result;
}
