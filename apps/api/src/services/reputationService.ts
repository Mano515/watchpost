import { promises as dns } from 'dns';
import { ReputationResult } from '@watchpost/shared-types';
import { TtlCache } from '../cache/ttlCache';

const cache = new TtlCache<ReputationResult>(5 * 60_000);

// DNSBL lists to query (domain-based)
const DNSBL_LISTS = [
  'dbl.spamhaus.org',
  'multi.uribl.com',
  'black.uriblack.org',
];

async function checkUrlhaus(domain: string): Promise<{ listed: boolean; url?: string }> {
  try {
    const body = new URLSearchParams({ url: `http://${domain}` });
    const res = await fetch('https://urlhaus-api.abuse.ch/v1/host/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return { listed: false };
    const json = await res.json() as { query_status: string; urls?: Array<{ url: string }> };
    if (json.query_status === 'is_host') {
      return { listed: true, url: json.urls?.[0]?.url };
    }
    return { listed: false };
  } catch {
    return { listed: false };
  }
}

async function checkDnsbl(domain: string): Promise<string[]> {
  const hits: string[] = [];
  await Promise.all(
    DNSBL_LISTS.map(async (list) => {
      try {
        // DNSBL lookup: query <domain>.<list>
        await dns.resolve4(`${domain}.${list}`);
        hits.push(list);
      } catch {
        // Not listed (NXDOMAIN is expected for clean domains)
      }
    })
  );
  return hits;
}

export async function checkReputation(domain: string): Promise<ReputationResult> {
  const cached = cache.get(domain);
  if (cached) return cached;

  const [urlhausResult, dnsblListings] = await Promise.all([
    checkUrlhaus(domain),
    checkDnsbl(domain),
  ]);

  const flagCount = (urlhausResult.listed ? 2 : 0) + dnsblListings.length;
  const score = flagCount === 0 ? 100 : flagCount === 1 ? 40 : 0;

  const result: ReputationResult = {
    domain,
    urlhausListed: urlhausResult.listed,
    urlhausUrl: urlhausResult.url,
    dnsblListings,
    score,
    grade: score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 50 ? 'C' : score >= 25 ? 'D' : 'F',
  };

  cache.set(domain, result);
  return result;
}
