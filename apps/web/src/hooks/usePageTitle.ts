import { useEffect } from 'react';

const BASE = 'Watchpost';
const BASE_TITLE = `${BASE} — Security Audit Suite`;

export function usePageTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE_TITLE;
    return () => { document.title = BASE_TITLE; };
  }, [title]);
}
