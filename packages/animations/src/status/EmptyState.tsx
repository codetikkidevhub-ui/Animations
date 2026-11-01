import type { CSSProperties, ReactNode } from 'react';

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

function DefaultIcon() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden
      style={{ animation: 'anim-float 3.5s ease-in-out infinite' }}
    >
      <rect
        x="18"
        y="26"
        width="60"
        height="44"
        rx="6"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeDasharray="8 6"
      />
      <circle cx="62" cy="62" r="14" stroke="#94a3b8" strokeWidth="3" fill="white" />
      <line x1="72" y1="72" x2="82" y2="82" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Empty-state block with a floating illustration, for "no data / no results" screens. */
export function EmptyState({
  title = 'Nothing here yet',
  message = 'When items are added they will show up here.',
  action,
  icon,
  className,
  style,
}: EmptyStateProps) {
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
        animation: 'anim-fade-in 0.5s ease both',
        ...style,
      }}
    >
      {icon ?? <DefaultIcon />}
      <h2 style={{ margin: '12px 0 0', fontSize: '1.25rem', fontWeight: 700 }}>{title}</h2>
      <p style={{ margin: 0, maxWidth: 380, opacity: 0.65 }}>{message}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
