import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { positiveNumber } from '../runtime/devWarn';

export interface SpinnerProps {
  /** Diameter in px. */
  size?: number;
  /** Border color — accepts any CSS color. Defaults to theme accent when themed. */
  color?: string;
  /** Ring thickness in px. */
  thickness?: number;
  /** Seconds per rotation. */
  speed?: number;
  /** 'ring' = classic border spinner, 'dual' = two counter-rotating arcs. */
  variant?: 'ring' | 'dual';
  className?: string;
  style?: CSSProperties;
}

export function Spinner({
  size,
  color,
  thickness,
  speed = 0.8,
  variant = 'ring',
  className,
  style,
}: SpinnerProps) {
  const m = useMotionPrefs();
  const spin = ensureKeyframes('spin', KF.spin);
  const spinReverse = ensureKeyframes('spin-reverse', KF.spinReverse);

  const s = positiveNumber(size, 32, 'size');
  const t = positiveNumber(thickness, 3, 'thickness');
  const arc = color ?? (m.themed ? m.tokens.colors.accent : 'currentColor');

  const ring: CSSProperties = {
    width: s,
    height: s,
    borderRadius: '50%',
    border: `${t}px solid transparent`,
    animation: m.anim(spin, speed, 'linear'),
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={className}
      style={{ display: 'inline-block', lineHeight: 0, ...style }}
    >
      {variant === 'ring' ? (
        <span
          style={{
            ...ring,
            borderTopColor: arc,
            borderRightColor: arc,
            display: 'block',
          }}
        />
      ) : (
        <span style={{ position: 'relative', display: 'block', width: s, height: s }}>
          <span
            style={{
              ...ring,
              position: 'absolute',
              inset: 0,
              borderTopColor: arc,
              display: 'block',
            }}
          />
          <span
            style={{
              ...ring,
              position: 'absolute',
              inset: t * 2,
              width: s - t * 4,
              height: s - t * 4,
              borderBottomColor: arc,
              animationName: spinReverse,
              display: 'block',
            }}
          />
        </span>
      )}
    </span>
  );
}
