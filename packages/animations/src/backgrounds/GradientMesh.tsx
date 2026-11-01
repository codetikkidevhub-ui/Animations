import type { CSSProperties } from 'react';

export interface GradientMeshProps {
  /** 2–4 blob colors. */
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
  colors = ['#6366f1', '#ec4899', '#f59e0b', '#3b82f6'],
  blur = 80,
  speed = 1,
  opacity = 0.55,
  className,
  style,
}: GradientMeshProps) {
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
      {colors.slice(0, 4).map((color, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '45%',
            height: '45%',
            borderRadius: '50%',
            backgroundColor: color,
            filter: `blur(${blur}px)`,
            animation: `anim-blob ${(14 + i * 3) / speed}s ease-in-out ${i * -3}s infinite`,
            ...positions[i % positions.length],
          }}
        />
      ))}
    </div>
  );
}
