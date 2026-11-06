import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { devWarn, positiveNumber } from '../runtime/devWarn';

export interface DotsProps {
  /** Dot diameter in px. */
  size?: number;
  /** Space between dots in px. */
  gap?: number;
  /** Dot color. Defaults to theme accent when themed. */
  color?: string;
  /** Number of dots. */
  count?: number;
  /** Animation cycle in seconds. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export function Dots({
  size,
  gap = 6,
  color,
  count,
  speed = 1.2,
  className,
  style,
}: DotsProps) {
  const m = useMotionPrefs();
  const bounce = ensureKeyframes('dot-bounce', KF.dotBounce);

  const s = positiveNumber(size, 8, 'size');
  const n = Math.max(1, Math.floor(positiveNumber(count, 3, 'count')));
  devWarn(count === undefined || count >= 1, `"count" must be at least 1, got ${count}.`);

  const dot = color ?? (m.themed ? m.tokens.colors.accent : 'currentColor');
  const cycle = speed * m.durationScale;

  return (
    <span
      role="status"
      aria-label="Loading"
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap, ...style }}
    >
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          style={{
            width: s,
            height: s,
            borderRadius: '50%',
            backgroundColor: dot,
            animation: m.reduce ? 'none' : `${bounce} ${cycle}s ease-in-out ${(i * cycle) / n / 2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
