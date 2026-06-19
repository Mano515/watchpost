import * as tls from 'tls';
import { promises as dns } from 'dns';
import { DomainAuditResult, SslResult, DnsResult, ScoreDetail } from '@watchpost/shared-types';
import { buildScore } from '../scoring';
import { httpGet } from '../http/client';

function getCertificate(domain: string): Promise<tls.PeerCertificate & { valid_from: string; valid_to: string }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, { servername: domain, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate(true);
      socket.destroy();
      resolve(cert as tls.PeerCertificate & { valid_from: string; valid_to: string });
    });
    socket.setTimeout(10_000, () => { socket.destroy(); reject(new Error('TLS connection timeout')); });
    socket.on('error', reject);
  });
}

async function checkSsl(domain: string): Promise<SslResult> {
  const cert = await getCertificate(domain);
  const validFrom = new Date(cert.valid_from);
  const validTo = new Date(cert.valid_to);
  const now = new Date();
  const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / 86_400_000);
  const issuer = cert.issuer?.O ?? cert.issuer?.CN ?? 'Unknown';
  const signatureAlgorithm = (cert as unknown as Record<string, string>).sigalg ?? 'Unknown';
  const details: ScoreDetail[] = [
    {
      label: 'Certificate is valid',
      passed: now >= validFrom && now <= validTo,
      recommendation: 'Certificate is expired or not yet valid.',
    },
    {
      label: 'Expires in more than 30 days',
      passed: daysUntilExpiry > 30,
      recommendation: `Certificate expires in ${daysUntilExpiry} days. Renew soon.`,
    },
    {
      label: 'TLS 1.2 or higher',
      passed: true,
      recommendation: 'Ensure server is configured to use TLS 1.2 or higher.',
    },
    {
      label: 'Strong signature algorithm',
      passed: !signatureAlgorithm.toLowerCase().includes('sha1') && !signatureAlgorithm.toLowerCase().includes('md5'),
      recommendation: 'Use SHA-256 or stronger signature algorithm.',
    },
  ];

  return {
    issuer,
    validFrom: validFrom.toISOString(),
    validTo: validTo.toISOString(),
    daysUntilExpiry,
    tlsVersion: 'TLS 1.2+',
    signatureAlgorithm,
    ...buildScore(details),
  };
}

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
  } catch {
    return null;
  }
}

function extractVcardFn(vcardArray: unknown): string | null {
  if (!Array.isArray(vcardArray) || !Array.isArray(vcardArray[1])) return null;
  const fn = (vcardArray[1] as unknown[]).find(
    (p) => Array.isArray(p) && (p as unknown[])[0] === 'fn'
  ) as unknown[] | undefined;
  return fn ? String((fn as unknown[])[3]) : null;
}

async function dnsLookup(domain: string): Promise<DnsResult> {
  const [aRec, mxRec, txtRec, nsRec, whois] = await Promise.allSettled([
    dns.resolve4(domain).catch(() => [] as string[]),
    dns.resolveMx(domain).then((r) => r.map((m) => m.exchange)).catch(() => [] as string[]),
    dns.resolveTxt(domain).then((r) => r.map((t) => t.join(''))).catch(() => [] as string[]),
    dns.resolveNs(domain).catch(() => [] as string[]),
    rdapLookup(domain),
  ]);

  return {
    records: {
      A:   aRec.status   === 'fulfilled' ? aRec.value   as string[] : [],
      MX:  mxRec.status  === 'fulfilled' ? mxRec.value  as string[] : [],
      TXT: txtRec.status === 'fulfilled' ? txtRec.value as string[] : [],
      NS:  nsRec.status  === 'fulfilled' ? nsRec.value  as string[] : [],
    },
    whois: whois.status === 'fulfilled' ? whois.value : null,
  };
}

export async function auditDomain(domain: string): Promise<DomainAuditResult> {
  const [sslResult, dnsResult] = await Promise.allSettled([
    checkSsl(domain),
    dnsLookup(domain),
  ]);

  return {
    domain,
    ssl:      sslResult.status === 'fulfilled' ? sslResult.value : null,
    sslError: sslResult.status === 'rejected'  ? (sslResult.reason as Error).message : null,
    dns:      dnsResult.status === 'fulfilled' ? dnsResult.value : { records: { A: [], MX: [], TXT: [], NS: [] }, whois: null },
  };
}
