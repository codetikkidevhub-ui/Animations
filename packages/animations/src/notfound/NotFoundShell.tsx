import type { CSSProperties, ReactNode } from 'react';
import { LoaderCanvas, type LoaderDrawContext } from '../loaders/LoaderCanvas';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface NotFoundShellProps {
  /** Small caps label above the heading. */
  eyebrow?: string;
  /** Big display text — defaults to '404'. */
  title?: string;
  /** Heading under the title. */
  heading?: string;
  /** Supporting line. */
  sub?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  /** `[accent, secondary]` — scene + text accents. */
  colors?: [string, string];
  /** Canvas scene painter rendered behind the copy. */
  scene?: (d: LoaderDrawContext, o: { c1: string; c2: string }) => void;
  /** Extra node rendered between sub and button (custom decor). */
  decor?: ReactNode;
  height?: number;
  className?: string;
  style?: CSSProperties;
}

/** Shared 404-page layout — canvas scene behind, witty copy + CTA in front. */
export function NotFoundShell({
  eyebrow = 'error 404',
  title = '404',
  heading = 'Page not found',
  sub = 'The page you were looking for has moved, or never existed.',
  buttonLabel = 'Back to safety',
  onButtonClick,
  colors,
  scene,
  decor,
  height = 340,
  className,
  style,
}: NotFoundShellProps) {
  const m = useMotionPrefs();
  const [c1, c2] = colors ??
    (m.themed ? [m.tokens.colors.accent, m.tokens.colors.accent2] : ['#818cf8', '#22d3ee']);
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        height,
        width: '100%',
        overflow: 'hidden',
        borderRadius: 16,
        border: `1px solid ${m.tokens.colors.muted}44`,
        background: m.themed ? m.tokens.colors.surface : '#0d0d17',
        display: 'grid',
        placeItems: 'center',
        ...style,
      }}
    >
      {scene && (
        <LoaderCanvas
          draw={(d) => scene(d, { c1, c2 })}
          size={Math.max(height, 400)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}
          label=""
        />
      )}
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '24px 20px',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: c2,
            marginBottom: 10,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            background: `linear-gradient(120deg, ${c1}, ${c2})`,
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 10,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: m.themed ? m.tokens.colors.text : '#e2e8f0', marginBottom: 6 }}>
          {heading}
        </div>
        <div style={{ fontSize: 13.5, color: m.themed ? m.tokens.colors.muted : '#94a3b8', maxWidth: 420, margin: '0 auto 20px' }}>
          {sub}
        </div>
        {decor}
        <button
          onClick={onButtonClick}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: `linear-gradient(120deg, ${c1}, ${c2})`,
            color: '#fff',
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: `0 6px 22px ${c1}44`,
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
