import { useMemo } from 'react';
import type { CSSProperties } from 'react';

export interface FloatingShapesProps {
  count?: number;
  colors?: string[];
  shapes?: Array<'circle' | 'square' | 'triangle'>;
  /** Max shape size in px. */
  maxSize?: number;
  opacity?: number;
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
  count = 12,
  colors = ['#6366f1', '#ec4899', '#f59e0b', '#3b82f6', '#22c55e'],
  shapes = ['circle', 'square', 'triangle'],
  maxSize = 40,
  opacity = 0.35,
  className,
  style,
}: FloatingShapesProps) {
  const items = useMemo<Shape[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 12 + Math.random() * maxSize,
        color: colors[i % colors.length],
        kind: shapes[i % shapes.length],
        duration: 4 + Math.random() * 5,
        delay: Math.random() * -6,
      })),
    [count, colors, shapes, maxSize],
  );

  const render = (s: Shape, i: number) => {
    const common: CSSProperties = {
      position: 'absolute',
      left: `${s.left}%`,
      top: `${s.top}%`,
      animation: `anim-float-x ${s.duration}s ease-in-out ${s.delay}s infinite`,
    };
    if (s.kind === 'triangle') {
      return (
        <span
          key={i}
          style={{
            ...common,
            width: 0,
            height: 0,
            borderLeft: `${s.size / 2}px solid transparent`,
            borderRight: `${s.size / 2}px solid transparent`,
            borderBottom: `${s.size}px solid ${s.color}`,
          }}
        />
      );
    }
    return (
      <span
        key={i}
        style={{
          ...common,
          width: s.size,
          height: s.size,
          backgroundColor: s.color,
          borderRadius: s.kind === 'circle' ? '50%' : 6,
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
