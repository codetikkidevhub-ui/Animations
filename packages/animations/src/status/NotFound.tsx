import type { CSSProperties } from 'react';
import { ensureKeyframes, KF } from '../runtime/keyframes';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface NotFoundProps {
  /** The large digits/characters shown floating. */
  code?: string;
  title?: string;
  message?: string;
  /** Renders a "go home" link when provided. */
  homeHref?: string;
  homeLabel?: string;
  digitColor?: string;
  className?: string;
  style?: CSSProperties;
}

/** Animated 404/error page block with gently floating digits. */
export function NotFound({
  code = '404',
  title = 'Page not found',
  message = "This page took a wrong turn at the last redirect — it happens to the best of us.",
  homeHref,
  homeLabel = 'Back to home',
  digitColor,
  className,
  style,
}: NotFoundProps) {
  const m = useMotionPrefs();
  const float = ensureKeyframes('float', KF.float);
  const pan = ensureKeyframes('gradient-pan', KF.gradientPan);

  const accent = m.themed ? m.tokens.colors.accent : '#6366f1';
  const accent2 = m.themed ? m.tokens.colors.accent2 : '#ec4899';
  const gradient = `linear-gradient(135deg, ${accent}, ${accent2}, ${m.themed ? m.tokens.colors.accent : '#f59e0b'})`;
  const scale = m.durationScale;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '48px 24px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{ display: 'flex', gap: '0.05em', userSelect: 'none' }}
      >
        {code.split('').map((char, i) => (
          <span
            key={i}
            style={{
              fontSize: 'clamp(4rem, 18vw, 9rem)',
              fontWeight: 800,
              lineHeight: 1,
              color: digitColor,
              backgroundImage: digitColor ? undefined : gradient,
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: digitColor ? undefined : 'text',
              backgroundClip: digitColor ? undefined : 'text',
              ...(digitColor ? {} : { color: 'transparent' }),
              animation: m.reduce
                ? 'none'
                : `${float} ${(3 + i * 0.4) * scale}s ease-in-out ${i * 0.25}s infinite, ${pan} ${6 * scale}s ease infinite`,
              display: 'inline-block',
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <h1 style={{ margin: '16px 0 0', fontSize: '1.5rem', fontWeight: 700, color: m.themed ? m.tokens.colors.text : undefined }}>{title}</h1>
      <p style={{ margin: 0, maxWidth: 420, opacity: 0.7, color: m.themed ? m.tokens.colors.text : undefined }}>{message}</p>
      {homeHref && (
        <a
          href={homeHref}
          style={{
            marginTop: 20,
            padding: '10px 24px',
            borderRadius: m.tokens.radius,
            background: accent,
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          {homeLabel}
        </a>
      )}
    </div>
  );
}
