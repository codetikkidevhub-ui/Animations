import type { CSSProperties } from 'react';

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
  message = "The page you're looking for doesn't exist or has been moved.",
  homeHref,
  homeLabel = 'Back to home',
  digitColor,
  className,
  style,
}: NotFoundProps) {
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
              backgroundImage: digitColor
                ? undefined
                : 'linear-gradient(135deg, #6366f1, #ec4899, #f59e0b)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: digitColor ? undefined : 'text',
              backgroundClip: digitColor ? undefined : 'text',
              ...(digitColor ? {} : { color: 'transparent' }),
              animation: `anim-float ${3 + i * 0.4}s ease-in-out ${i * 0.25}s infinite, anim-gradient-pan 6s ease infinite`,
              display: 'inline-block',
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <h1 style={{ margin: '16px 0 0', fontSize: '1.5rem', fontWeight: 700 }}>{title}</h1>
      <p style={{ margin: 0, maxWidth: 420, opacity: 0.7 }}>{message}</p>
      {homeHref && (
        <a
          href={homeHref}
          style={{
            marginTop: 20,
            padding: '10px 24px',
            borderRadius: 8,
            background: '#6366f1',
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
