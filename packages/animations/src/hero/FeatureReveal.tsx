import type { CSSProperties, ReactNode } from 'react';
import { Stagger, StaggerItem } from '../scroll/Stagger';

export interface Feature {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export interface FeatureRevealProps {
  features: Feature[];
  columns?: number;
  stagger?: number;
  cardStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
}

/** Grid of feature cards that reveal one-by-one on scroll. */
export function FeatureReveal({
  features,
  columns = 3,
  stagger = 0.12,
  cardStyle,
  className,
  style,
}: FeatureRevealProps) {
  return (
    <Stagger
      stagger={stagger}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${Math.floor(720 / columns)}px, 1fr))`,
        gap: 20,
        ...style,
      }}
    >
      {features.map((f, i) => (
        <StaggerItem key={i}>
          <div
            style={{
              padding: 24,
              borderRadius: 14,
              border: '1px solid rgba(128,128,128,0.2)',
              background: 'rgba(255,255,255,0.04)',
              height: '100%',
              boxSizing: 'border-box',
              ...cardStyle,
            }}
          >
            {f.icon && <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>{f.icon}</div>}
            <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 700 }}>{f.title}</h3>
            {f.description && (
              <p style={{ margin: 0, opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.5 }}>
                {f.description}
              </p>
            )}
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
