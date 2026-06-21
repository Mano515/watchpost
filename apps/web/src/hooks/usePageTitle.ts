import { useEffect } from 'react';

const BASE = 'Watchpost';

export function usePageTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Security Audit Suite`;
    return () => { document.title = `${BASE} — Security Audit Suite`; };
  }, [title]);
}
