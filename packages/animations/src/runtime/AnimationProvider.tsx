import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { PRESETS, DEFAULT_PRESET, type PresetName } from '../theme/presets';
import type { ThemeTokens } from '../theme/tokens';
import type { PerfTier } from '../hooks/usePerfTier';
import { AnimationTierContext } from './tierContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type ThemeInput = PresetName | { light: ThemeTokens; dark: ThemeTokens };
export type ModeInput = 'light' | 'dark' | 'auto';

export interface AnimationContextValue {
  tokens: ThemeTokens;
  mode: 'light' | 'dark';
  /** Global duration multiplier applied on top of theme.durationScale. */
  speed: number;
  reducedMotion: boolean;
  /** Forced perf tier from the provider, if any. */
  tier?: PerfTier;
  /** Whether a provider is present (false = baked defaults in use). */
  themed: boolean;
}

const fallbackTokens = PRESETS[DEFAULT_PRESET].dark;

const AnimationContext = createContext<AnimationContextValue>({
  tokens: fallbackTokens,
  mode: 'dark',
  speed: 1,
  reducedMotion: false,
  themed: false,
});

export interface AnimationProviderProps {
  children: ReactNode;
  /** Preset name or a custom { light, dark } token pair. */
  theme?: ThemeInput;
  /** 'light' | 'dark' | 'auto' (follows prefers-color-scheme). */
  mode?: ModeInput;
  /** Global speed multiplier — 1 = normal, 0.5 = half-speed. */
  speed?: number;
  /** Force reduced-motion on/off; 'auto' follows the OS. */
  reducedMotion?: boolean | 'auto';
  /** Force the perf tier instead of auto-detecting. */
  tier?: PerfTier;
  className?: string;
  style?: CSSProperties;
}

function useColorScheme(input: ModeInput): 'light' | 'dark' {
  const [system, setSystem] = useState<'light' | 'dark'>('dark');
  useEffect(() => {
    if (input !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const update = () => setSystem(mq.matches ? 'light' : 'dark');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [input]);
  return input === 'auto' ? system : input;
}

/**
 * Optional theming + global motion control. Everything works without it;
 * wrap the app once to enable preset themes and global tuning.
 *
 * @example
 * <AnimationProvider theme="diwali" mode="auto">
 *   <App />
 * </AnimationProvider>
 */
export function AnimationProvider({
  children,
  theme = DEFAULT_PRESET,
  mode: modeInput = 'auto',
  speed = 1,
  reducedMotion = 'auto',
  tier,
  className,
  style,
}: AnimationProviderProps) {
  const mode = useColorScheme(modeInput);
  const reduce = useReducedMotion(reducedMotion === 'auto' ? undefined : reducedMotion);

  const tokens = useMemo<ThemeTokens>(() => {
    const pair = typeof theme === 'string' ? PRESETS[theme] : theme;
    return pair[mode];
  }, [theme, mode]);

  const value = useMemo<AnimationContextValue>(
    () => ({ tokens, mode, speed, reducedMotion: reduce, tier, themed: true }),
    [tokens, mode, speed, reduce, tier],
  );

  const vars = {
    '--ct-accent': tokens.colors.accent,
    '--ct-accent2': tokens.colors.accent2,
    '--ct-bg': tokens.colors.bg,
    '--ct-surface': tokens.colors.surface,
    '--ct-text': tokens.colors.text,
    '--ct-muted': tokens.colors.muted,
    '--ct-radius': `${tokens.radius}px`,
    '--ct-duration-scale': String(tokens.motion.durationScale * speed),
    '--ct-easing': tokens.motion.easing,
  } as CSSProperties;

  return (
    <AnimationContext.Provider value={value}>
      <AnimationTierContext.Provider value={tier}>
        <div className={className} style={{ display: 'contents', ...vars, ...style }}>
          {children}
        </div>
      </AnimationTierContext.Provider>
    </AnimationContext.Provider>
  );
}

/**
 * Reads the animation context. Without a provider returns baked
 * `midnight/dark` defaults and `themed: false`.
 */
export function useAnimationTheme(): AnimationContextValue {
  return useContext(AnimationContext);
}
