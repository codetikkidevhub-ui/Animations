import type { CSSProperties } from 'react';

export interface ProgressBarProps {
  /** 0–100. Omit (or pass undefined) for indeterminate mode. */
  value?: number;
  color?: string;
  /** Track (background) color. */
  trackColor?: string;
  height?: number;
  borderRadius?: number;
  /** Animated diagonal stripes over the fill. */
  striped?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ProgressBar({
  value,
  color = '#6366f1',
  trackColor = 'rgba(128,128,128,0.2)',
  height = 8,
  borderRadius = 999,
  striped = false,
  className,
  style,
}: ProgressBarProps) {
  const indeterminate = value === undefined;
  const fillBase: CSSProperties = {
    height: '100%',
    borderRadius,
    backgroundColor: color,
    backgroundImage: striped
      ? 'linear-gradient(45deg, rgba(255,255,255,0.25) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.25) 75%, transparent 75%)'
      : undefined,
    backgroundSize: striped ? '40px 40px' : undefined,
    animation: striped ? 'anim-progress-stripes 1s linear infinite' : undefined,
  };

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(value!)}
      className={className}
      style={{
        width: '100%',
        height,
        borderRadius,
        backgroundColor: trackColor,
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {indeterminate ? (
        <div
          style={{
            ...fillBase,
            position: 'absolute',
            width: '40%',
            animation: 'anim-progress-indeterminate 1.2s ease-in-out infinite',
          }}
        />
      ) : (
        <div
          style={{
            ...fillBase,
            width: `${Math.min(Math.max(value!, 0), 100)}%`,
            transition: 'width 0.35s ease',
          }}
        />
      )}
    </div>
  );
}
