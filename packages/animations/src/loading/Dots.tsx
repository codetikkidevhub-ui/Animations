import type { CSSProperties } from 'react';

export interface DotsProps {
  /** Dot diameter in px. */
  size?: number;
  /** Space between dots in px. */
  gap?: number;
  color?: string;
  /** Number of dots. */
  count?: number;
  /** Animation cycle in seconds. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export function Dots({
  size = 8,
  gap = 6,
  color = 'currentColor',
  count = 3,
  speed = 1.2,
  className,
  style,
}: DotsProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap, ...style }}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            animation: `anim-dot-bounce ${speed}s ease-in-out ${(i * speed) / count / 2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
