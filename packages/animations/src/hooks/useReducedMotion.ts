import { useEffect, useState } from 'react';

/**
 * Tracks `prefers-reduced-motion: reduce` live.
 * SSR-safe (defaults to `false`). Provider `reducedMotion` prop can
 * force the value — see `AnimationProvider`.
 */
export function useReducedMotion(forced?: boolean): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    if (forced !== undefined) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [forced]);

  return forced ?? reduce;
}
