import type { BreachCheckResult, BreachEntry, BreachRiskLevel, Grade } from '@watchpost/shared-types';
import { httpGet } from '../http/client';
import { TtlCache } from '../cache/ttlCache';

const cache = new TtlCache<BreachCheckResult>(5 * 60 * 1000);

interface XonBreachStat {
  breach: string;
  xposed_date?: string;
  xposed_data?: string[];
  xposed_records?: number;
  domain?: string;
  password_risk?: string; // "plain" | "hashed" | "" | undefined
}

interface XonAnalytics {
  BreachMetrics?: {
    breach_stats?: XonBreachStat[];
  };
}

function scoreToGrade(score: number): Grade {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 55) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

function computeRisk(breaches: BreachEntry[]): { score: number; grade: Grade; riskLevel: BreachRiskLevel } {
  if (breaches.length === 0) return { score: 100, grade: 'A', riskLevel: 'safe' };

  let score = 100;
  const now = new Date().getFullYear();

  for (const b of breaches) {
    score -= 8; // base penalty per breach

    if (b.dataTypes?.some((d) => /password/i.test(d))) {
      score -= b.passwordRisk === 'plain' ? 20 : 10;
    }

    if (b.date) {
      const year = new Date(b.date).getFullYear();
      const age = now - year;
      if (age <= 1) score -= 10;
      else if (age <= 3) score -= 5;
    }

    const sensitiveTypes = ['Credit Cards', 'Bank Account Numbers', 'Social Security Numbers', 'Passport Numbers', 'Phone Numbers'];
    if (b.dataTypes?.some((d) => sensitiveTypes.some((s) => d.toLowerCase().includes(s.toLowerCase())))) {
      score -= 8;
    }
  }

  score = Math.max(0, Math.min(100, score));
  const grade = scoreToGrade(score);

  let riskLevel: BreachRiskLevel;
  if (score >= 90)      riskLevel = 'safe';
  else if (score >= 70) riskLevel = 'low';
  else if (score >= 50) riskLevel = 'medium';
  else if (score >= 25) riskLevel = 'high';
  else                  riskLevel = 'critical';

  return { score, grade, riskLevel };
}

export async function checkBreach(email: string): Promise<BreachCheckResult> {
  const cached = cache.get(email);
  if (cached) return cached;

  const encoded = encodeURIComponent(email);

  // Run basic check and analytics in parallel
  const [basicRes, analyticsRes] = await Promise.allSettled([
    httpGet(`https://api.xposedornot.com/v1/check-email/${encoded}`),
    httpGet(`https://api.xposedornot.com/v1/analytics/${encoded}`),
  ]);

  // Parse basic check
  if (basicRes.status === 'rejected') throw new Error('XposedOrNot unreachable');
  const basicData = await basicRes.value.json() as Record<string, unknown>;

  if (basicData['Error'] === 'Not found' || !basicData['breaches']) {
    const result: BreachCheckResult = { email, breached: false, breaches: [], score: 100, grade: 'A', riskLevel: 'safe' };
    cache.set(email, result);
    return result;
  }

  const raw = basicData['breaches'];
  const names: string[] = Array.isArray(raw)
    ? (Array.isArray(raw[0]) ? (raw[0] as string[]) : (raw as string[]))
    : [];

  // Parse analytics (best-effort — may fail for some emails)
  let statsMap = new Map<string, XonBreachStat>();
  if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
    try {
      const analyticsData = await analyticsRes.value.json() as XonAnalytics;
      const stats = analyticsData?.BreachMetrics?.breach_stats ?? [];
      for (const s of stats) {
        statsMap.set(s.breach.toLowerCase(), s);
      }
    } catch { /* analytics parse failure — degrade gracefully */ }
  }

  const breaches: BreachEntry[] = names.map((name) => {
    const stat = statsMap.get(name.toLowerCase());
    if (!stat) return { name };

    const passwordRisk = stat.password_risk === 'plain' ? 'plain'
      : stat.password_risk === 'hashed' ? 'hashed'
      : stat.xposed_data?.some((d) => /password/i.test(d)) ? 'unknown'
      : 'none';

    return {
      name,
      date: stat.xposed_date,
      dataTypes: stat.xposed_data,
      passwordRisk,
      recordCount: stat.xposed_records,
      domain: stat.domain,
    };
  });

  const { score, grade, riskLevel } = computeRisk(breaches);
  const result: BreachCheckResult = { email, breached: true, breaches, score, grade, riskLevel };
  cache.set(email, result);
  return result;
}
