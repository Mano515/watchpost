import { BreachCheckResult, BreachEntry } from '@watchpost/shared-types';
import { httpGet } from '../http/client';

export async function checkBreach(email: string): Promise<BreachCheckResult> {
  const encoded = encodeURIComponent(email);
  const res = await httpGet(`https://api.xposedornot.com/v1/check-email/${encoded}`);

  if (res.status === 404) {
    return { email, breached: false, breaches: [] };
  }

  if (!res.ok) {
    throw new Error(`XposedOrNot API error: ${res.status}`);
  }

  const data = await res.json() as { breaches?: Array<{ name: string; date: string; xposed_data: string }> };
  const breaches: BreachEntry[] = (data.breaches ?? []).map((b) => ({
    name: b.name,
    date: b.date,
    dataTypes: b.xposed_data ? b.xposed_data.split(', ') : [],
  }));

  return { email, breached: breaches.length > 0, breaches };
}
