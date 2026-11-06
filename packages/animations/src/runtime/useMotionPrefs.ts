import { useAnimationTheme } from './AnimationProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { usePerfTier, type PerfTier } from '../hooks/usePerfTier';
import type { ThemeTokens } from '../theme/tokens';

export interface MotionPrefs {
  tokens: ThemeTokens;
  /** True when an AnimationProvider is active. */
  themed: boolean;
  /** Combined duration multiplier: theme.durationScale × provider speed. */
  durationScale: number;
  /** Effective reduced-motion flag (provider-forced or OS). */
  reduce: boolean;
  /** 'full' | 'lite' | 'static' — graceful perf tier. */
  tier: PerfTier;
  /** Theme default easing curve. */
  easing: string;
  /** `animation` shorthand helper — returns 'none' under reduced motion. */
  anim: (name: string, duration: number, timing?: string, extra?: string) => string;
}

/** Internal per-component resolver: theme tokens + motion preferences. */
export function useMotionPrefs(): MotionPrefs {
  const ctx = useAnimationTheme();
  const osReduce = useReducedMotion();
  const tier = usePerfTier();
  const reduce = ctx.themed ? ctx.reducedMotion : osReduce;
  const durationScale = ctx.tokens.motion.durationScale * ctx.speed;

  return {
    tokens: ctx.tokens,
    themed: ctx.themed,
    durationScale,
    reduce,
    tier,
    easing: ctx.tokens.motion.easing,
    anim: (name, duration, timing = ctx.tokens.motion.easing, extra = 'infinite') =>
      reduce || tier === 'static'
        ? 'none'
        : `${name} ${(duration * durationScale).toFixed(3)}s ${timing} ${extra}`,
  };
}
