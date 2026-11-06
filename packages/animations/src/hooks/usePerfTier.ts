import { useContext, useEffect, useState } from 'react';
import { AnimationTierContext } from '../runtime/tierContext';

export type PerfTier = 'full' | 'lite' | 'static';

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

function detectTier(reducedMotion: boolean): PerfTier {
  if (reducedMotion) return 'static';
  if (typeof navigator === 'undefined') return 'full';
  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  if (cores <= 4 || memory <= 4) return 'lite';
  return 'full';
}

/**
 * Graceful performance tiers: 'full' | 'lite' | 'static'.
 * `static` when reduced-motion is on or the environment can't animate;
 * `lite` on low-end devices; `full` otherwise. A `tier` prop on
 * `AnimationProvider` overrides detection; an explicit `forced`
 * argument overrides everything.
 */
export function usePerfTier(forced?: PerfTier): PerfTier {
  const ctxTier = useContext(AnimationTierContext);
  const [tier, setTier] = useState<PerfTier>('full');
  const effective = forced ?? ctxTier;

  useEffect(() => {
    if (effective !== undefined) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setTier(detectTier(mq.matches));
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [effective]);

  return effective ?? tier;
}
