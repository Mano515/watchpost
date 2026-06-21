import { SiteAuditResult, scoreToGrade } from '@watchpost/shared-types';
import { scanHeaders } from './headerService';
import { scanVulnerabilities } from './vulnerabilityService';
import { auditDomain } from './domainService';
import { checkReputation } from './reputationService';
import { checkCertTransparency } from './certTransparencyService';
import { TtlCache } from '../cache/ttlCache';

const cache = new TtlCache<SiteAuditResult>(5 * 60_000);

export async function auditSite(domain: string): Promise<SiteAuditResult> {
  const cached = cache.get(domain);
  if (cached) return cached;

  const url = `https://${domain}`;

  const [headersSettled, vulnSettled, domainSettled, reputationSettled, ctSettled] = await Promise.allSettled([
    scanHeaders(url),
    scanVulnerabilities(url),
    auditDomain(domain),
    checkReputation(domain),
    checkCertTransparency(domain),
  ]);

  const headers          = headersSettled.status === 'fulfilled'     ? headersSettled.value     : null;
  const headersError     = headersSettled.status === 'rejected'      ? (headersSettled.reason as Error).message    : null;
  const vuln             = vulnSettled.status === 'fulfilled'        ? vulnSettled.value        : null;
  const vulnError        = vulnSettled.status === 'rejected'         ? (vulnSettled.reason as Error).message      : null;
  const domainAudit      = domainSettled.status === 'fulfilled'      ? domainSettled.value      : null;
  const domainError      = domainSettled.status === 'rejected'       ? (domainSettled.reason as Error).message    : null;
  const reputation       = reputationSettled.status === 'fulfilled'  ? reputationSettled.value  : null;
  const reputationError  = reputationSettled.status === 'rejected'   ? (reputationSettled.reason as Error).message : null;
  const certTransparency = ctSettled.status === 'fulfilled'          ? ctSettled.value          : null;
  const certTransparencyError = ctSettled.status === 'rejected'      ? (ctSettled.reason as Error).message        : null;

  // Weighted average: vuln 30 %, headers 25 %, SSL 20 %, email security 15 %, reputation 10 %
  const parts: Array<{ score: number; weight: number }> = [];
  if (headers)                           parts.push({ score: headers.score,                              weight: 0.25 });
  if (vuln)                              parts.push({ score: vuln.score,                                 weight: 0.30 });
  if (domainAudit?.ssl)                  parts.push({ score: domainAudit.ssl.score,                     weight: 0.20 });
  if (domainAudit?.dns?.emailSecurity)   parts.push({ score: domainAudit.dns.emailSecurity.score.score, weight: 0.15 });
  if (reputation)                        parts.push({ score: reputation.score,                           weight: 0.10 });

  const totalWeight    = parts.reduce((s, p) => s + p.weight, 0);
  const overallScore   = totalWeight > 0
    ? Math.round(parts.reduce((s, p) => s + p.score * p.weight, 0) / totalWeight)
    : 0;

  const result: SiteAuditResult = {
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

  cache.set(domain, result);
  return result;
}
