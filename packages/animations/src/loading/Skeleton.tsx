import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { positiveNumber } from '../runtime/devWarn';
import { withAlpha } from '../utils/color';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  /** Set to a high number for a pill/circle shape. */
  borderRadius?: number | string;
  /** Render `count` skeleton lines, last one at `lastLineWidth`. */
  lines?: number;
  lastLineWidth?: number | string;
  lineGap?: number;
  className?: string;
  style?: CSSProperties;
}

/** Shimmering placeholder block. */
export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius,
  lines,
  lastLineWidth = '60%',
  lineGap = 10,
  className,
  style,
}: SkeletonProps) {
  const m = useMotionPrefs();
  const shimmer = ensureKeyframes('shimmer', KF.shimmer);

  const n = Math.max(1, Math.floor(positiveNumber(lines, 1, 'lines')));
  const radius = borderRadius ?? m.tokens.radius * 0.75;
  const wash = m.themed ? m.tokens.colors.muted : '#808080';

  const block = (w: number | string, key?: number) => (
    <div
      key={key}
      style={{
        width: w,
        height,
        borderRadius: radius,
        background: `linear-gradient(90deg, ${withAlpha(wash, 0.15)} 25%, ${withAlpha(wash, 0.3)} 50%, ${withAlpha(wash, 0.15)} 75%)`,
        backgroundSize: '200% 100%',
        animation: m.anim(shimmer, 1.4, 'ease-in-out'),
      }}
      aria-hidden
    />
  );

  if (n <= 1) {
    return (
      <div className={className} style={style}>
        {block(width)}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: lineGap, ...style }}
      aria-label="Loading content"
      role="status"
    >
      {Array.from({ length: n }, (_, i) =>
        block(i === n - 1 ? lastLineWidth : width, i),
      )}
    </div>
  );
}
