import type { CSSProperties } from 'react';
import { GradientText } from '../text/GradientText';
import { AnimatedButton } from '../micro/AnimatedButton';
import { FadeIn } from '../scroll/FadeIn';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface CTABlockProps {
  title: string;
  /** Rendered with the animated gradient — typically the key phrase. */
  highlight?: string;
  ctaLabel?: string;
  onCta?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
  style?: CSSProperties;
}

/** Centered call-to-action block with gradient headline and animated buttons. */
export function CTABlock({
  title,
  highlight,
  ctaLabel = 'Get started',
  onCta,
  secondaryLabel,
  onSecondary,
  className,
  style,
}: CTABlockProps) {
  const m = useMotionPrefs();
  return (
    <FadeIn
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        padding: '72px 24px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        ...style,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 800, color: m.themed ? m.tokens.colors.text : undefined }}>
        {title} {highlight && <GradientText>{highlight}</GradientText>}
      </h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <AnimatedButton variant="shine" onClick={onCta}>
          {ctaLabel}
        </AnimatedButton>
        {secondaryLabel && (
          <AnimatedButton variant="outline" onClick={onSecondary}>
            {secondaryLabel}
          </AnimatedButton>
        )}
      </div>
    </FadeIn>
  );
}
