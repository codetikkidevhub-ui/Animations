import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { withAlpha } from '../utils/color';

export interface GradientMeshProps {
  /** 2–4 blob colors. Defaults to theme palette when themed. */
  colors?: string[];
  /** Blur radius in px. */
  blur?: number;
  /** Blob drift speed multiplier. */
  speed?: number;
  /** 0–1. */
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Animated gradient-mesh background — place inside a `position: relative`
 * container with `overflow: hidden`.
 */
export function GradientMesh({
  colors,
  blur = 80,
  speed = 1,
  opacity = 0.55,
  className,
  style,
}: GradientMeshProps) {
  const m = useMotionPrefs();
  const blob = ensureKeyframes('blob', KF.blob);

  const palette =
    colors && colors.length >= 2
      ? colors
      : m.themed
        ? [m.tokens.colors.accent, m.tokens.colors.accent2, withAlpha(m.tokens.colors.accent, 0.9), m.tokens.colors.accent2]
        : ['#6366f1', '#ec4899', '#f59e0b', '#3b82f6'];
  const scale = m.durationScale;

  const positions = [
    { top: '5%', left: '10%' },
    { top: '40%', left: '60%' },
    { top: '60%', left: '20%' },
    { top: '15%', left: '70%' },
  ];

  return (
    <div
      aria-hidden
      className={className}
      style={{ position: 'absolute', inset: 0, opacity, zIndex: 0, ...style }}
    >
      {palette.slice(0, 4).map((color, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '45%',
            height: '45%',
            borderRadius: '50%',
            backgroundColor: color,
            filter: `blur(${blur}px)`,
            animation: m.reduce ? 'none' : `${blob} ${((14 + i * 3) * scale) / speed}s ease-in-out ${i * -3}s infinite`,
            ...positions[i % positions.length],
          }}
        />
      ))}
    </div>
  );
}
