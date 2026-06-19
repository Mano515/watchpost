import { useState, useEffect, useRef } from 'react';
import { RateLimitError } from '../api/client';

export function useRateLimit() {
  const [countdown, setCountdown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleError(err: unknown): string | null {
    if (err instanceof RateLimitError) {
      setCountdown(err.retryAfterSeconds);
      timer.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timer.current!); return 0; }
          return c - 1;
        });
      }, 1000);
      return null; // signal: rate limited, not a regular error
    }
    return (err as Error).message;
  }

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return { countdown, handleError, isRateLimited: countdown > 0 };
}
