import type { CSSProperties } from 'react';

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

/** Shimmering placeholder block. Requires `@codetikki/animations/styles.css`. */
export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 6,
  lines = 1,
  lastLineWidth = '60%',
  lineGap = 10,
  className,
  style,
}: SkeletonProps) {
  const block = (w: number | string, key?: number) => (
    <div
      key={key}
      className="anim-skeleton"
      style={{ width: w, height, borderRadius }}
      aria-hidden
    />
  );

  if (lines <= 1) {
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
      {Array.from({ length: lines }, (_, i) =>
        block(i === lines - 1 ? lastLineWidth : width, i),
      )}
    </div>
  );
}
