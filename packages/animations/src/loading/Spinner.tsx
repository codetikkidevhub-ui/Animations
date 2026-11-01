import type { CSSProperties } from 'react';

export interface SpinnerProps {
  /** Diameter in px. */
  size?: number;
  /** Border color — accepts any CSS color. */
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
  size = 32,
  color = 'currentColor',
  thickness = 3,
  speed = 0.8,
  variant = 'ring',
  className,
  style,
}: SpinnerProps) {
  const ring: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    border: `${thickness}px solid transparent`,
    animation: `anim-spin ${speed}s linear infinite`,
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
            borderTopColor: color,
            borderRightColor: color,
            display: 'block',
          }}
        />
      ) : (
        <span style={{ position: 'relative', display: 'block', width: size, height: size }}>
          <span
            style={{
              ...ring,
              position: 'absolute',
              inset: 0,
              borderTopColor: color,
              display: 'block',
            }}
          />
          <span
            style={{
              ...ring,
              position: 'absolute',
              inset: thickness * 2,
              width: size - thickness * 4,
              height: size - thickness * 4,
              borderBottomColor: color,
              animationName: 'anim-spin-reverse',
              display: 'block',
            }}
          />
        </span>
      )}
    </span>
  );
}
