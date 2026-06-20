import * as tls from 'tls';
import { promises as dns } from 'dns';
import {
  DomainAuditResult, SslResult, DnsResult, EmailSecurityResult,
  ScoreDetail, SecurityScore,
} from '@watchpost/shared-types';
import { buildScore } from '../scoring';
import { httpGet } from '../http/client';
import { TtlCache } from '../cache/ttlCache';

const cache = new TtlCache<DomainAuditResult>(5 * 60_000);

// =============================================================================
// SSL / TLS checks
// =============================================================================

/** Connect to port 443 and return the server's TLS certificate. */
function fetchCertificate(domain: string): Promise<tls.PeerCertificate & { valid_from: string; valid_to: string }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, { servername: domain, rejectUnauthorized: false }, () => {
      resolve(socket.getPeerCertificate(true) as tls.PeerCertificate & { valid_from: string; valid_to: string });
      socket.destroy();
    });
    socket.setTimeout(10_000, () => { socket.destroy(); reject(new Error('TLS connection timeout')); });
    socket.on('error', reject);
  });
}

/**
 * Check whether a server accepts a specific (legacy) TLS version.
 * Returns true if the connection succeeds — meaning the old version is still enabled (bad).
 * We force both minVersion and maxVersion to the target version so the handshake
 * fails immediately if the server requires a newer version.
 */
function serverAcceptsLegacyTls(domain: string, version: 'TLSv1' | 'TLSv1.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = tls.connect(443, domain, {
      servername: domain,
      rejectUnauthorized: false,
      minVersion: version,
      maxVersion: version,
    } as tls.ConnectionOptions, () => {
      socket.destroy();
      resolve(true); // connected = server accepts this legacy version
    });
    socket.setTimeout(5_000, () => { socket.destroy(); resolve(false); });
    socket.on('error', () => resolve(false));
  });
}

async function checkSsl(domain: string): Promise<SslResult> {
  // Fetch the cert and probe for legacy TLS support in parallel
  const [cert, supportsTls10, supportsTls11] = await Promise.all([
    fetchCertificate(domain),
    serverAcceptsLegacyTls(domain, 'TLSv1'),
    serverAcceptsLegacyTls(domain, 'TLSv1.1'),
  ]);

  const validFrom          = new Date(cert.valid_from);
  const validTo            = new Date(cert.valid_to);
  const now                = new Date();
  const daysUntilExpiry    = Math.floor((validTo.getTime() - now.getTime()) / 86_400_000);
  const rawIssuer          = cert.issuer?.O ?? cert.issuer?.CN ?? 'Unknown';
  const issuer             = Array.isArray(rawIssuer) ? rawIssuer[0] : rawIssuer;
  const signatureAlgorithm = (cert as unknown as Record<string, string>).sigalg ?? 'Unknown';
  const isWeakSignature    = signatureAlgorithm.toLowerCase().includes('sha1')
                          || signatureAlgorithm.toLowerCase().includes('md5');

  // Show the actual minimum TLS version the server still accepts
  const tlsVersion = supportsTls10 ? 'TLS 1.0+' : supportsTls11 ? 'TLS 1.1+' : 'TLS 1.2+';

  const details: ScoreDetail[] = [
    {
      key: 'ssl.valid',
      label: 'Certificate is valid',
      passed: now >= validFrom && now <= validTo,
    },
    {
      key: 'ssl.expiry',
      label: 'Expires in more than 30 days',
      passed: daysUntilExpiry > 30,
    },
    {
      key: 'ssl.no_tls10',
      label: 'TLS 1.0 disabled',
      passed: !supportsTls10,
      recommendation: 'Disable TLS 1.0 in your server config — it has known vulnerabilities (POODLE, BEAST).',
    },
    {
      key: 'ssl.no_tls11',
      label: 'TLS 1.1 disabled',
      passed: !supportsTls11,
      recommendation: 'Disable TLS 1.1 and serve only TLS 1.2 and TLS 1.3.',
    },
    {
      key: 'ssl.sig',
      label: 'Strong signature algorithm',
      passed: !isWeakSignature,
    },
  ];

  return {
    issuer,
    signatureAlgorithm,
    tlsVersion,
    validFrom: validFrom.toISOString(),
    validTo:   validTo.toISOString(),
    daysUntilExpiry,
    ...buildScore(details),
  };
}

// =============================================================================
// RDAP / WHOIS lookup
// =============================================================================

/** Look up registration info via the RDAP protocol (the modern replacement for WHOIS). */
async function rdapLookup(domain: string): Promise<DnsResult['whois']> {
  try {
    const response = await httpGet(`https://rdap.org/domain/${domain}`);
    if (!response.ok) return null;

    const data = await response.json() as Record<string, unknown>;

    const events = (data.events as Array<{ eventAction: string; eventDate: string }>) ?? [];
    const created = events.find((e) =>
      e.eventAction === 'registration' || e.eventAction === 'domain registration'
    )?.eventDate ?? '';
    const expires = events.find((e) =>
      e.eventAction === 'expiration' || e.eventAction === 'domain expiration'
    )?.eventDate ?? '';

    const entities = (data.entities as Array<{ roles: string[]; vcardArray?: unknown[] }>) ?? [];
    const registrarEntity = entities.find((e) => e.roles.includes('registrar'));
    const registrarName   = extractVcardFn(registrarEntity?.vcardArray) ?? 'Unknown';
    const domainAge       = created ? Math.floor((Date.now() - new Date(created).getTime()) / 86_400_000) : 0;

    return { registrar: registrarName, createdDate: created, expiresDate: expires, domainAge };
  } catch {
    return null;
  }
}

/** Extract the "fn" (full name) field from a vCard array. */
function extractVcardFn(vcardArray: unknown): string | null {
  if (!Array.isArray(vcardArray) || !Array.isArray(vcardArray[1])) return null;
  const fnEntry = (vcardArray[1] as unknown[]).find(
    (p) => Array.isArray(p) && (p as unknown[])[0] === 'fn'
  ) as unknown[] | undefined;
  return fnEntry ? String((fnEntry as unknown[])[3]) : null;
}

// =============================================================================
// Email security (SPF, DMARC, CAA, DNSSEC)
// =============================================================================

/**
 * Parse an SPF record and return its all-mechanism policy.
 * '-all' = fail (strict), '~all' = softfail, '?all' = neutral, '+all' = pass (permissive, bad).
 */
export function parseSpfPolicy(record: string): 'fail' | 'softfail' | 'neutral' | 'pass' | 'all' {
  if (record.includes('-all')) return 'fail';
  if (record.includes('~all')) return 'softfail';
  if (record.includes('?all')) return 'neutral';
  if (record.includes('+all')) return 'pass'; // allows anyone to send as you — very bad
  return 'all';
}

/** Parse a DMARC record and return the 'p=' policy value. */
export function parseDmarcPolicy(record: string): 'none' | 'quarantine' | 'reject' {
  const match = record.match(/p=(\w+)/i);
  const policy = match?.[1]?.toLowerCase();
  if (policy === 'reject')     return 'reject';
  if (policy === 'quarantine') return 'quarantine';
  return 'none'; // p=none = monitoring only, does not stop phishing emails
}

/**
 * Check DNSSEC by asking Cloudflare's DNS-over-HTTPS API for a DNSKEY record.
 * The 'AD' (Authenticated Data) bit in the response means the answer is DNSSEC-validated.
 */
async function checkDnssec(domain: string): Promise<boolean> {
  try {
    const url      = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=DNSKEY`;
    const response = await httpGet(url, { headers: { Accept: 'application/dns-json' } });
    const data     = await response.json() as { AD?: boolean };
    return data.AD === true;
  } catch {
    return false;
  }
}

async function resolveEmailSecurity(domain: string, txtRecords: string[]): Promise<EmailSecurityResult> {
  // SPF is stored as a TXT record directly on the domain
  const spfRecord = txtRecords.find((r) => r.startsWith('v=spf1')) ?? null;
  const spfPolicy = spfRecord ? parseSpfPolicy(spfRecord) : null;

  // DMARC, CAA, and DNSSEC are independent — resolve them in parallel
  const [dmarcResult, caaResult, dnssecResult] = await Promise.allSettled([
    dns.resolveTxt(`_dmarc.${domain}`).then((r) => r.map((t) => t.join(''))),
    (dns.resolve as Function)(domain, 'CAA').catch(() => []),
    checkDnssec(domain),
  ]);

  const dmarcRecords = dmarcResult.status === 'fulfilled' ? dmarcResult.value as string[] : [];
  const dmarcRecord  = dmarcRecords.find((r) => r.startsWith('v=DMARC1')) ?? null;
  const dmarcPolicy  = dmarcRecord ? parseDmarcPolicy(dmarcRecord) : null;

  const caaRaw  = caaResult.status === 'fulfilled'
    ? caaResult.value as Array<{ critical: number; issue: string; tag: string }>
    : [];
  const caaList = caaRaw.map((r) => `${r.tag} "${r.issue}"`);

  const dnssec = dnssecResult.status === 'fulfilled' ? dnssecResult.value as boolean : false;

  const details: ScoreDetail[] = [
    {
      key: 'email.spf_present',
      label: 'SPF record present',
      passed: spfRecord !== null,
    },
    {
      key: 'email.spf_strict',
      label: 'SPF policy is strict (not +all)',
      // '+all' or missing 'all' means any server can send as this domain
      passed: spfPolicy !== null && spfPolicy !== 'pass' && spfPolicy !== 'all',
    },
    {
      key: 'email.dmarc_present',
      label: 'DMARC record present',
      passed: dmarcRecord !== null,
    },
    {
      key: 'email.dmarc_policy',
      label: 'DMARC policy is quarantine or reject',
      // 'none' is monitoring only — it does not prevent phishing emails from reaching inboxes
      passed: dmarcPolicy === 'quarantine' || dmarcPolicy === 'reject',
    },
    {
      key: 'email.caa',
      label: 'CAA records restrict certificate issuance',
      passed: caaList.length > 0,
    },
    {
      key: 'email.dnssec',
      label: 'DNSSEC enabled',
      passed: dnssec,
    },
  ];

  const score: SecurityScore = buildScore(details);

  return { spf: spfRecord, dmarc: dmarcRecord, caa: caaList, dnssec, score };
}

// =============================================================================
// DNS lookup
// =============================================================================

async function dnsLookup(domain: string): Promise<DnsResult> {
  // Resolve all record types and WHOIS in parallel
  const [aResult, mxResult, txtResult, nsResult, whoisResult] = await Promise.allSettled([
    dns.resolve4(domain).catch((): string[] => []),
    dns.resolveMx(domain).then((r) => r.map((m) => m.exchange)).catch((): string[] => []),
    dns.resolveTxt(domain).then((r) => r.map((t) => t.join(''))).catch((): string[] => []),
    dns.resolveNs(domain).catch((): string[] => []),
    rdapLookup(domain),
  ]);

  const txtRecords: string[] = txtResult.status === 'fulfilled' ? txtResult.value as string[] : [];

  // Email security analysis depends on TXT records, so it runs after
  const emailSecurity = await resolveEmailSecurity(domain, txtRecords);

  return {
    records: {
      A:   aResult.status   === 'fulfilled' ? aResult.value   as string[] : [],
      MX:  mxResult.status  === 'fulfilled' ? mxResult.value  as string[] : [],
      TXT: txtRecords,
      NS:  nsResult.status  === 'fulfilled' ? nsResult.value  as string[] : [],
    },
    whois: whoisResult.status === 'fulfilled' ? whoisResult.value : null,
    emailSecurity,
  };
}

// =============================================================================
// Main export
// =============================================================================

export async function auditDomain(domain: string): Promise<DomainAuditResult> {
  const cached = cache.get(domain);
  if (cached) return cached;

  // Run SSL and DNS checks in parallel — they are fully independent
  const [sslResult, dnsResult] = await Promise.allSettled([
    checkSsl(domain),
    dnsLookup(domain),
  ]);

  const emptyEmailSecurity: EmailSecurityResult = {
    spf: null, dmarc: null, caa: [], dnssec: false,
    score: { score: 0, grade: 'F', details: [] },
  };

  const result: DomainAuditResult = {
    domain,
    ssl:      sslResult.status === 'fulfilled' ? sslResult.value : null,
    sslError: sslResult.status === 'rejected'  ? (sslResult.reason as Error).message : null,
    dns:      dnsResult.status === 'fulfilled'
      ? dnsResult.value
      : { records: { A: [], MX: [], TXT: [], NS: [] }, whois: null, emailSecurity: emptyEmailSecurity },
  };

  cache.set(domain, result);
  return result;
}
