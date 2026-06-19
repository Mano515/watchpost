import { useState, useEffect } from 'react';
import type { Grade } from '@watchpost/shared-types';

export interface HistoryEntry {
  id: string;
  type: 'headers' | 'password' | 'breach' | 'domain';
  input: string;
  grade?: Grade;
  timestamp: number;
}

const KEY = 'watchpost:history';
const MAX = 8;

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(entries));
  }, [entries]);

  function push(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
    setEntries((prev) => {
      const next: HistoryEntry[] = [
        { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
        ...prev.filter((e) => !(e.type === entry.type && e.input === entry.input)),
      ].slice(0, MAX);
      return next;
    });
  }

  function clear() { setEntries([]); }

  return { entries, push, clear };
}
