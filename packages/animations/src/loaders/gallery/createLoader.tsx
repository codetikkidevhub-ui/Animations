import type { CSSProperties } from 'react';
import { LoaderCanvas, type LoaderDrawContext } from '../LoaderCanvas';
import { useMotionPrefs } from '../../runtime/useMotionPrefs';

export interface SceneLoaderProps {
  /** Canvas size in px. */
  size?: number;
  /** `[primary, secondary]` colors — interpolated across the scene. */
  colors?: [string, string];
  /** Time multiplier. */
  speed?: number;
  /** 0–1 complexity/energy knob — particle counts and flourish scale. */
  intensity?: number;
  /** Reproducible generative layout. */
  seed?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export type SceneFn = (
  d: LoaderDrawContext,
  o: { c1: string; c2: string; energy: number },
) => void;

interface SceneDefaults {
  colors: [string, string];
  /** Suggested size. */
  size?: number;
}

/** Builds a themed, tier-aware canvas loader component from a scene painter. */
export function createLoader(scene: SceneFn, defaults: SceneDefaults) {
  function SceneLoader({
    size = defaults.size ?? 140,
    colors,
    speed = 1,
    intensity = 0.75,
    seed,
    label = 'Loading',
    className,
    style,
  }: SceneLoaderProps) {
    const m = useMotionPrefs();
    const [c1, c2] = colors ??
      (m.themed ? [m.tokens.colors.accent, m.tokens.colors.accent2] : defaults.colors);
    return (
      <LoaderCanvas
        draw={(d) => scene(d, { c1, c2, energy: Math.min(Math.max(intensity, 0), 1) })}
        size={size}
        speed={speed}
        seed={seed}
        label={label}
        className={className}
        style={style}
      />
    );
  }
  return SceneLoader;
}
