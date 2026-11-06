import type { CSSProperties, ReactNode } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  /** Optional CTA element — e.g. an AnimatedButton. */
  action?: ReactNode;
  /** Custom illustration; defaults to a floating dashed-box icon. */
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Empty-state block with a floating illustration, for "no data / no results" screens. */
export function EmptyState({
  title = 'Nothing here yet',
  message = 'It is suspiciously empty in here. Add something and it will show up.',
  action,
  icon,
  className,
  style,
}: EmptyStateProps) {
  const m = useMotionPrefs();
  const float = ensureKeyframes('float', KF.float);
  const fadeIn = ensureKeyframes('fade-in', KF.fadeIn);
  const stroke = m.themed ? m.tokens.colors.muted : '#94a3b8';
  const paper = m.themed ? m.tokens.colors.surface : 'white';

  const defaultIcon = (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden
      style={{ animation: m.anim(float, 3.5, 'ease-in-out') }}
    >
      <rect
        x="18"
        y="26"
        width="60"
        height="44"
        rx="6"
        stroke={stroke}
        strokeWidth="3"
        strokeDasharray="8 6"
      />
      <circle cx="62" cy="62" r="14" stroke={stroke} strokeWidth="3" fill={paper} />
      <line x1="72" y1="72" x2="82" y2="82" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '48px 24px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        animation: m.anim(fadeIn, 0.5, 'ease', 'both'),
        ...style,
      }}
    >
      {icon ?? defaultIcon}
      <h2 style={{ margin: '12px 0 0', fontSize: '1.25rem', fontWeight: 700, color: m.themed ? m.tokens.colors.text : undefined }}>{title}</h2>
      <p style={{ margin: 0, maxWidth: 380, opacity: 0.65, color: m.themed ? m.tokens.colors.text : undefined }}>{message}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
