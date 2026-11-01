import { useMemo } from 'react';
import type { CSSProperties } from 'react';

export interface ConfettiProps {
  /** Number of confetti pieces. */
  pieces?: number;
  colors?: string[];
  /** Fall duration in seconds. */
  duration?: number;
  /** Set false to render pieces statically (no animation). */
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Piece {
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  round: boolean;
}

/** Lightweight CSS confetti burst — position inside a `relative` container. */
export function Confetti({
  pieces = 40,
  colors = ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6'],
  duration = 2.4,
  animate = true,
  className,
  style,
}: ConfettiProps) {
  const confetti = useMemo<Piece[]>(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: duration * (0.7 + Math.random() * 0.6),
        color: colors[i % colors.length],
        size: 6 + Math.random() * 6,
        round: Math.random() > 0.5,
      })),
    [pieces, colors, duration],
  );

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {confetti.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: -12,
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.6,
            borderRadius: p.round ? '50%' : 2,
            backgroundColor: p.color,
            animation: animate
              ? `anim-confetti-fall ${p.duration}s ease-in ${p.delay}s both`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
