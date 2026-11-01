import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface TiltCardProps {
  children: ReactNode;
  /** Max tilt in degrees. */
  maxTilt?: number;
  /** Scale on hover. */
  scale?: number;
  /** Transition back duration in ms. */
  resetDuration?: number;
  className?: string;
  style?: CSSProperties;
}

/** Card that tilts in 3D toward the pointer. */
export function TiltCard({
  children,
  maxTilt = 12,
  scale = 1.02,
  resetDuration = 400,
  className,
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(800px)');
  const [transition, setTransition] = useState(`transform ${resetDuration}ms ease`);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTransition('transform 60ms linear');
    setTransform(
      `perspective(800px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(
        px * maxTilt
      ).toFixed(2)}deg) scale(${scale})`,
    );
  };

  const onLeave = () => {
    setTransition(`transform ${resetDuration}ms cubic-bezier(0.34, 1.3, 0.64, 1)`);
    setTransform('perspective(800px)');
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transform, transition, willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
}
