import type { CSSProperties, ReactNode } from 'react';
import { GradientMesh } from '../backgrounds/GradientMesh';
import { TextReveal } from '../text/TextReveal';
import { AnimatedButton } from '../micro/AnimatedButton';

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  /** Extra content below the CTA (badges, screenshots, etc). */
  children?: ReactNode;
  gradientColors?: string[];
  /** Min height of the hero section. */
  minHeight?: number | string;
  className?: string;
  style?: CSSProperties;
}

/** Ready-made hero section: gradient mesh bg + staggered title reveal + CTA. */
export function HeroBanner({
  title,
  subtitle,
  ctaLabel,
  onCta,
  children,
  gradientColors,
  minHeight = 480,
  className,
  style,
}: HeroBannerProps) {
  return (
    <section
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 24px',
        fontFamily: 'system-ui, sans-serif',
        ...style,
      }}
    >
      <GradientMesh colors={gradientColors} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.25rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1 }}>
          <TextReveal text={title} by="words" stagger={0.06} />
        </h1>
        {subtitle && (
          <p style={{ margin: '20px auto 0', fontSize: '1.15rem', opacity: 0.75, maxWidth: 560 }}>
            {subtitle}
          </p>
        )}
        {ctaLabel && (
          <div style={{ marginTop: 32 }}>
            <AnimatedButton variant="shine" onClick={onCta}>
              {ctaLabel}
            </AnimatedButton>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
