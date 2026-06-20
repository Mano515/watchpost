const STORAGE_KEY = 'watchpost:scan-results';

interface StoredResult {
  score: number;
  grade: string;
  timestamp: number;
}

type ScanStore = Record<string, StoredResult>;

function load(): ScanStore {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); }
  catch { return {}; }
}

function cacheKey(type: string, input: string) {
  return `${type}:${input}`;
}

export interface ScanDiff {
  previousScore: number;
  previousGrade: string;
  delta: number;        // positive = improved, negative = regressed
  previousDate: Date;
}

export function useScanDiff(type: string, input: string) {
  function getPrevious(): ScanDiff | null {
    const entry = load()[cacheKey(type, input)];
    if (!entry) return null;
    return {
      previousScore: entry.score,
      previousGrade: entry.grade,
      delta: 0,
      previousDate: new Date(entry.timestamp),
    };
  }

  function saveCurrent(score: number, grade: string): ScanDiff | null {
    const store = load();
    const key   = cacheKey(type, input);
    const prev  = store[key] ?? null;
    store[key]  = { score, grade, timestamp: Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch {}
    if (!prev) return null;
    return {
      previousScore: prev.score,
      previousGrade: prev.grade,
      delta: score - prev.score,
      previousDate: new Date(prev.timestamp),
    };
  }

  return { getPrevious, saveCurrent };
}
