import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { useSeed, mulberry32 } from '../utils/seed';
import { devWarn, positiveNumber } from '../runtime/devWarn';

export interface ConfettiProps {
  /** Number of confetti pieces. */
  pieces?: number;
  colors?: string[];
  /** Fall duration in seconds. */
  duration?: number;
  /** Set false to render pieces statically (no animation). */
  animate?: boolean;
  /** Seed for reproducible spread; omit for a fresh burst every mount. */
  seed?: number;
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
  pieces,
  colors,
  duration = 2.4,
  animate = true,
  seed,
  className,
  style,
}: ConfettiProps) {
  const m = useMotionPrefs();
  const fall = ensureKeyframes('confetti-fall', KF.confettiFall);
  const s = useSeed(seed);

  const n = Math.max(1, Math.floor(positiveNumber(pieces, 40, 'pieces')));
  devWarn(colors === undefined || colors.length > 0, '"colors" must be a non-empty array.');
  const palette =
    colors && colors.length > 0
      ? colors
      : m.themed
        ? [m.tokens.colors.accent, m.tokens.colors.accent2, m.tokens.colors.text]
        : ['#6366f1', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6'];
  const count = m.tier === 'lite' ? Math.max(8, Math.floor(n / 2)) : n;

  const confetti = useMemo<Piece[]>(() => {
    const rand = mulberry32(s);
    return Array.from({ length: count }, (_, i) => ({
      left: rand() * 100,
      delay: rand() * 0.4,
      duration: duration * (0.7 + rand() * 0.6) * m.durationScale,
      color: palette[i % palette.length],
      size: 6 + rand() * 6,
      round: rand() > 0.5,
    }));
  }, [count, palette, duration, s, m.durationScale]);

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
            animation: animate && !m.reduce
              ? `${fall} ${p.duration}s ease-in ${p.delay}s both`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
