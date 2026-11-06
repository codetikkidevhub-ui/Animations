import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { useSeed, mulberry32 } from '../utils/seed';
import { positiveNumber } from '../runtime/devWarn';

export interface FloatingShapesProps {
  count?: number;
  colors?: string[];
  shapes?: Array<'circle' | 'square' | 'triangle'>;
  /** Max shape size in px. */
  maxSize?: number;
  opacity?: number;
  /** Seed for reproducible layout; omit for a fresh arrangement every mount. */
  seed?: number;
  className?: string;
  style?: CSSProperties;
}

interface Shape {
  left: number;
  top: number;
  size: number;
  color: string;
  kind: 'circle' | 'square' | 'triangle';
  duration: number;
  delay: number;
}

/** Gently floating geometric shapes — decorative background layer. */
export function FloatingShapes({
  count,
  colors,
  shapes = ['circle', 'square', 'triangle'],
  maxSize = 40,
  opacity = 0.35,
  seed,
  className,
  style,
}: FloatingShapesProps) {
  const m = useMotionPrefs();
  const floatX = ensureKeyframes('float-x', KF.floatX);
  const s = useSeed(seed);

  const n = Math.max(1, Math.floor(positiveNumber(count, 12, 'count')));
  const palette =
    colors && colors.length > 0
      ? colors
      : m.themed
        ? [m.tokens.colors.accent, m.tokens.colors.accent2, m.tokens.colors.muted]
        : ['#6366f1', '#ec4899', '#f59e0b', '#3b82f6', '#22c55e'];
  const total = m.tier === 'lite' ? Math.max(4, Math.floor(n / 2)) : n;

  const items = useMemo<Shape[]>(() => {
    const rand = mulberry32(s);
    return Array.from({ length: total }, (_, i) => ({
      left: rand() * 100,
      top: rand() * 100,
      size: 12 + rand() * maxSize,
      color: palette[i % palette.length],
      kind: shapes[i % shapes.length],
      duration: (4 + rand() * 5) * m.durationScale,
      delay: rand() * -6,
    }));
  }, [total, palette, shapes, maxSize, s, m.durationScale]);

  const render = (sh: Shape, i: number) => {
    const common: CSSProperties = {
      position: 'absolute',
      left: `${sh.left}%`,
      top: `${sh.top}%`,
      animation: m.reduce ? 'none' : `${floatX} ${sh.duration}s ease-in-out ${sh.delay}s infinite`,
    };
    if (sh.kind === 'triangle') {
      return (
        <span
          key={i}
          style={{
            ...common,
            width: 0,
            height: 0,
            borderLeft: `${sh.size / 2}px solid transparent`,
            borderRight: `${sh.size / 2}px solid transparent`,
            borderBottom: `${sh.size}px solid ${sh.color}`,
          }}
        />
      );
    }
    return (
      <span
        key={i}
        style={{
          ...common,
          width: sh.size,
          height: sh.size,
          backgroundColor: sh.color,
          borderRadius: sh.kind === 'circle' ? '50%' : 6,
        }}
      />
    );
  };

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    >
      {items.map(render)}
    </div>
  );
}
