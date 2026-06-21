import { CertTransparencyResult } from '@watchpost/shared-types';
import { TtlCache } from '../cache/ttlCache';

const cache = new TtlCache<CertTransparencyResult>(5 * 60_000);

interface CrtEntry {
  name_value: string;
  issuer_name: string;
}

export async function checkCertTransparency(domain: string): Promise<CertTransparencyResult> {
  const cached = cache.get(domain);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://crt.sh/?q=%25.${encodeURIComponent(domain)}&output=json`,
      { signal: AbortSignal.timeout(10_000) }
    );

    if (!res.ok) throw new Error(`crt.sh returned ${res.status}`);

    const entries = await res.json() as CrtEntry[];

    const subdomainSet = new Set<string>();
    const issuerSet = new Set<string>();

    for (const entry of entries) {
      // name_value can be newline-separated list of SANs
      for (const name of entry.name_value.split('\n')) {
        const trimmed = name.trim().toLowerCase();
        if (trimmed && !trimmed.startsWith('*.') && trimmed !== domain) {
          subdomainSet.add(trimmed);
        }
      }
      // Extract CN from issuer string: "CN=Let's Encrypt Authority X3, ..."
      const cn = entry.issuer_name.match(/CN=([^,]+)/)?.[1]?.trim();
      if (cn) issuerSet.add(cn);
    }

    const result: CertTransparencyResult = {
      domain,
      certCount: entries.length,
      subdomains: [...subdomainSet].slice(0, 50),
      issuers: [...issuerSet].slice(0, 20),
    };

    cache.set(domain, result);
    return result;
  } catch {
    const result: CertTransparencyResult = {
      domain,
      certCount: 0,
      subdomains: [],
      issuers: [],
    };
    cache.set(domain, result);
    return result;
  }
}
