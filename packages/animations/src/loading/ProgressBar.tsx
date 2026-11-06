import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { devWarn } from '../runtime/devWarn';
import { withAlpha } from '../utils/color';

export interface ProgressBarProps {
  /** 0–100. Omit (or pass undefined) for indeterminate mode. */
  value?: number;
  /** Fill color. Defaults to theme accent when themed. */
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
  color,
  trackColor,
  height = 8,
  borderRadius = 999,
  striped = false,
  className,
  style,
}: ProgressBarProps) {
  const m = useMotionPrefs();
  const stripes = ensureKeyframes('progress-stripes', KF.progressStripes);
  const indeterminate = ensureKeyframes('progress-indeterminate', KF.progressIndeterminate);

  devWarn(
    value === undefined || (Number.isFinite(value) && value >= 0 && value <= 100),
    `"value" should be between 0 and 100, got ${value}. It will be clamped.`,
  );

  const fill = color ?? (m.themed ? m.tokens.colors.accent : '#6366f1');
  const track = trackColor ?? (m.themed ? withAlpha(m.tokens.colors.muted, 0.2) : 'rgba(128,128,128,0.2)');
  const isIndeterminate = value === undefined;

  const fillBase: CSSProperties = {
    height: '100%',
    borderRadius,
    backgroundColor: fill,
    backgroundImage: striped
      ? 'linear-gradient(45deg, rgba(255,255,255,0.25) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.25) 75%, transparent 75%)'
      : undefined,
    backgroundSize: striped ? '40px 40px' : undefined,
    animation: striped ? m.anim(stripes, 1, 'linear') : undefined,
  };

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={isIndeterminate ? undefined : Math.round(value!)}
      className={className}
      style={{
        width: '100%',
        height,
        borderRadius,
        backgroundColor: track,
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {isIndeterminate ? (
        <div
          style={{
            ...fillBase,
            position: 'absolute',
            width: '40%',
            animation: m.anim(indeterminate, 1.2, 'ease-in-out'),
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
