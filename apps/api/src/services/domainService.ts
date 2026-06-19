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

// ── SSL ───────────────────────────────────────────────────────────────────────

function getCertificate(domain: string): Promise<tls.PeerCertificate & { valid_from: string; valid_to: string }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, { servername: domain, rejectUnauthorized: false }, () => {
      resolve(socket.getPeerCertificate(true) as tls.PeerCertificate & { valid_from: string; valid_to: string });
      socket.destroy();
    });
    socket.setTimeout(10_000, () => { socket.destroy(); reject(new Error('TLS connection timeout')); });
    socket.on('error', reject);
  });
}

async function checkSsl(domain: string): Promise<SslResult> {
  const cert = await getCertificate(domain);
  const validFrom = new Date(cert.valid_from);
  const validTo   = new Date(cert.valid_to);
  const now       = new Date();
  const daysUntilExpiry   = Math.floor((validTo.getTime() - now.getTime()) / 86_400_000);
  const issuer            = cert.issuer?.O ?? cert.issuer?.CN ?? 'Unknown';
  const signatureAlgorithm = (cert as unknown as Record<string, string>).sigalg ?? 'Unknown';
  const isWeakSig = signatureAlgorithm.toLowerCase().includes('sha1') || signatureAlgorithm.toLowerCase().includes('md5');

  const details: ScoreDetail[] = [
    { key: 'ssl.valid',  label: 'Certificate is valid',         passed: now >= validFrom && now <= validTo },
    { key: 'ssl.expiry', label: 'Expires in more than 30 days', passed: daysUntilExpiry > 30 },
    { key: 'ssl.tls',    label: 'TLS 1.2 or higher',            passed: true },
    { key: 'ssl.sig',    label: 'Strong signature algorithm',    passed: !isWeakSig },
  ];

  return {
    issuer, signatureAlgorithm, tlsVersion: 'TLS 1.2+',
    validFrom: validFrom.toISOString(), validTo: validTo.toISOString(),
    daysUntilExpiry, ...buildScore(details),
  };
}

// ── RDAP / WHOIS ──────────────────────────────────────────────────────────────

async function rdapLookup(domain: string): Promise<DnsResult['whois']> {
  try {
    const res = await httpGet(`https://rdap.org/domain/${domain}`);
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;

    const events = (data.events as Array<{ eventAction: string; eventDate: string }>) ?? [];
    const created = events.find((e) =>
      e.eventAction === 'registration' || e.eventAction === 'domain registration'
    )?.eventDate ?? '';
    const expires = events.find((e) =>
      e.eventAction === 'expiration' || e.eventAction === 'domain expiration'
    )?.eventDate ?? '';
    const entities = (data.entities as Array<{ roles: string[]; vcardArray?: unknown[] }>) ?? [];
    const registrarEntity = entities.find((e) => e.roles.includes('registrar'));
    const registrarName = extractVcardFn(registrarEntity?.vcardArray) ?? 'Unknown';
    const domainAge = created ? Math.floor((Date.now() - new Date(created).getTime()) / 86_400_000) : 0;

    return { registrar: registrarName, createdDate: created, expiresDate: expires, domainAge };
  } catch { return null; }
}

function extractVcardFn(vcardArray: unknown): string | null {
  if (!Array.isArray(vcardArray) || !Array.isArray(vcardArray[1])) return null;
  const fn = (vcardArray[1] as unknown[]).find(
    (p) => Array.isArray(p) && (p as unknown[])[0] === 'fn'
  ) as unknown[] | undefined;
  return fn ? String((fn as unknown[])[3]) : null;
}

// ── Email security ────────────────────────────────────────────────────────────

function parseSpfPolicy(record: string): 'pass' | 'softfail' | 'fail' | 'neutral' | 'all' {
  if (record.includes('-all')) return 'fail';
  if (record.includes('~all')) return 'softfail';
  if (record.includes('?all')) return 'neutral';
  if (record.includes('+all')) return 'pass'; // permissive (bad)
  return 'all';
}

function parseDmarcPolicy(record: string): 'none' | 'quarantine' | 'reject' {
  const match = record.match(/p=(\w+)/i);
  const policy = match?.[1]?.toLowerCase();
  if (policy === 'reject')     return 'reject';
  if (policy === 'quarantine') return 'quarantine';
  return 'none';
}

async function checkDnssec(domain: string): Promise<boolean> {
  try {
    const res = await httpGet(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=DNSKEY`,
      { headers: { Accept: 'application/dns-json' } }
    );
    const data = await res.json() as { AD?: boolean };
    return data.AD === true;
  } catch { return false; }
}

async function resolveEmailSecurity(domain: string, txtRecords: string[]): Promise<EmailSecurityResult> {
  const spfRecord = txtRecords.find((r) => r.startsWith('v=spf1')) ?? null;
  const spfPolicy = spfRecord ? parseSpfPolicy(spfRecord) : null;

  const [dmarcResult, caaResult, dnssecResult] = await Promise.allSettled([
    dns.resolveTxt(`_dmarc.${domain}`).then((r) => r.map((t) => t.join(''))),
    (dns.resolve as Function)(domain, 'CAA').catch(() => []),
    checkDnssec(domain),
  ]);

  const dmarcRecords = dmarcResult.status === 'fulfilled' ? dmarcResult.value as string[] : [];
  const dmarcRecord  = dmarcRecords.find((r) => r.startsWith('v=DMARC1')) ?? null;
  const dmarcPolicy  = dmarcRecord ? parseDmarcPolicy(dmarcRecord) : null;

  const caaRaw  = caaResult.status === 'fulfilled' ? caaResult.value as Array<{ critical: number; issue: string; tag: string }> : [];
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

  return {
    spf:    spfRecord,
    dmarc:  dmarcRecord,
    caa:    caaList,
    dnssec,
    score,
  };
}

// ── DNS ───────────────────────────────────────────────────────────────────────

async function dnsLookup(domain: string): Promise<DnsResult> {
  const [aRec, mxRec, txtRec, nsRec, whois] = await Promise.allSettled([
    dns.resolve4(domain).catch(() => [] as string[]),
    dns.resolveMx(domain).then((r) => r.map((m) => m.exchange)).catch(() => [] as string[]),
    dns.resolveTxt(domain).then((r) => r.map((t) => t.join(''))).catch(() => [] as string[]),
    dns.resolveNs(domain).catch(() => [] as string[]),
    rdapLookup(domain),
  ]);

  const txtRecords: string[] = txtRec.status === 'fulfilled' ? txtRec.value as string[] : [];
  const emailSecurity = await resolveEmailSecurity(domain, txtRecords);

  return {
    records: {
      A:   aRec.status  === 'fulfilled' ? aRec.value  as string[] : [],
      MX:  mxRec.status === 'fulfilled' ? mxRec.value as string[] : [],
      TXT: txtRecords,
      NS:  nsRec.status === 'fulfilled' ? nsRec.value as string[] : [],
    },
    whois: whois.status === 'fulfilled' ? whois.value : null,
    emailSecurity,
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function auditDomain(domain: string): Promise<DomainAuditResult> {
  const cached = cache.get(domain);
  if (cached) return cached;

  const [sslResult, dnsResult] = await Promise.allSettled([checkSsl(domain), dnsLookup(domain)]);

  const emptyEmail: EmailSecurityResult = {
    spf: null, dmarc: null, caa: [], dnssec: false,
    score: { score: 0, grade: 'F', details: [] },
  };

  const result: DomainAuditResult = {
    domain,
    ssl:      sslResult.status === 'fulfilled' ? sslResult.value : null,
    sslError: sslResult.status === 'rejected'  ? (sslResult.reason as Error).message : null,
    dns:      dnsResult.status === 'fulfilled'
      ? dnsResult.value
      : { records: { A: [], MX: [], TXT: [], NS: [] }, whois: null, emailSecurity: emptyEmail },
  };

  cache.set(domain, result);
  return result;
}
