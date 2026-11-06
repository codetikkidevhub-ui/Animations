import type { CSSProperties, ReactNode } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { devWarn } from '../runtime/devWarn';

export interface GradientTextProps {
  children: ReactNode;
  /** Two or more CSS colors. Defaults to theme accent pair when themed. */
  colors?: string[];
  /** Gradient angle in degrees. */
  angle?: number;
  /** Pan animation speed in seconds. 0 disables. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

/** Animated gradient-clipped text. */
export function GradientText({
  children,
  colors,
  angle = 90,
  speed = 4,
  className,
  style,
}: GradientTextProps) {
  const m = useMotionPrefs();
  const pan = ensureKeyframes('gradient-pan', KF.gradientPan);

  devWarn(colors === undefined || colors.length >= 2, '"colors" needs at least 2 entries for a gradient.');
  const palette =
    colors && colors.length >= 2
      ? colors
      : m.themed
        ? [m.tokens.colors.accent, m.tokens.colors.accent2, m.tokens.colors.accent]
        : ['#6366f1', '#ec4899', '#f59e0b'];

  return (
    <span
      className={className}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${palette.join(', ')})`,
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: m.reduce || speed === 0 ? 'none' : `${pan} ${speed * m.durationScale}s ease infinite`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
