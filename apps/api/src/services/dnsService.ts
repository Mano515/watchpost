import { promises as dns } from 'dns';
import { DnsLookupResult } from '@watchpost/shared-types';
import { httpGet } from '../http/client';

async function rdapLookup(domain: string) {
  try {
    const res = await httpGet(`https://rdap.org/domain/${domain}`);
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;

    const events = (data.events as Array<{ eventAction: string; eventDate: string }>) ?? [];
    const created = events.find((e) => e.eventAction === 'registration')?.eventDate ?? '';
    const expires = events.find((e) => e.eventAction === 'expiration')?.eventDate ?? '';
    const entities = (data.entities as Array<{ roles: string[]; vcardArray?: unknown[] }>) ?? [];
    const registrar = entities.find((e) => e.roles.includes('registrar'));
    const registrarName = extractVcardFn(registrar?.vcardArray) ?? 'Unknown';
    const ns = ((data.nameservers as Array<{ ldhName: string }>) ?? []).map((n) => n.ldhName);
    const domainAge = created
      ? Math.floor((Date.now() - new Date(created).getTime()) / 86_400_000)
      : 0;

    return { registrar: registrarName, createdDate: created, expiresDate: expires, domainAge, nameservers: ns };
  } catch {
    return null;
  }
}

function extractVcardFn(vcardArray: unknown): string | null {
  if (!Array.isArray(vcardArray)) return null;
  const props = vcardArray[1] as unknown[];
  if (!Array.isArray(props)) return null;
  const fn = (props as unknown[]).find((p) => Array.isArray(p) && (p as unknown[])[0] === 'fn') as unknown[] | undefined;
  return fn ? String((fn as unknown[])[3]) : null;
}

export async function dnsLookup(domain: string): Promise<DnsLookupResult> {
  const [aRecords, mxRecords, txtRecords, nsRecords, whois] = await Promise.allSettled([
    dns.resolve4(domain).catch(() => [] as string[]),
    dns.resolveMx(domain).then((r) => r.map((m) => m.exchange)).catch(() => [] as string[]),
    dns.resolveTxt(domain).then((r) => r.map((t) => t.join(''))).catch(() => [] as string[]),
    dns.resolveNs(domain).catch(() => [] as string[]),
    rdapLookup(domain),
  ]);

  return {
    domain,
    records: {
      A: aRecords.status === 'fulfilled' ? (aRecords.value as string[]) : [],
      MX: mxRecords.status === 'fulfilled' ? (mxRecords.value as string[]) : [],
      TXT: txtRecords.status === 'fulfilled' ? (txtRecords.value as string[]) : [],
      NS: nsRecords.status === 'fulfilled' ? (nsRecords.value as string[]) : [],
    },
    whois: whois.status === 'fulfilled' ? whois.value : null,
  };
}
