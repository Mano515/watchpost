import { BreachCheckResult } from '@watchpost/shared-types';
import { httpGet } from '../http/client';

export async function checkBreach(email: string): Promise<BreachCheckResult> {
  const encoded = encodeURIComponent(email);
  const res = await httpGet(`https://api.xposedornot.com/v1/check-email/${encoded}`);

  if (!res.ok) {
    throw new Error(`XposedOrNot API error: ${res.status}`);
  }

  const data = await res.json() as Record<string, unknown>;

  // API returns { Error: "Not found" } for unknown emails (still HTTP 200)
  if (data['Error'] === 'Not found' || !data['breaches']) {
    return { email, breached: false, breaches: [] };
  }

  // breaches is [[name1, name2, ...]] — one nested array of strings
  const raw = data['breaches'];
  const names: string[] = Array.isArray(raw)
    ? (Array.isArray(raw[0]) ? (raw[0] as string[]) : (raw as string[]))
    : [];

  return {
    email,
    breached: names.length > 0,
    breaches: names.map((name) => ({ name })),
  };
}
