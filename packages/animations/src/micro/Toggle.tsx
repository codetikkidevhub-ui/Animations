import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useMotionPrefs } from '../runtime/useMotionPrefs';

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Track width in px. */
  width?: number;
  /** On-state track color. Defaults to theme accent when themed. */
  color?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Sliding toggle switch (controlled or uncontrolled). */
export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  width = 48,
  color,
  label,
  className,
  style,
}: ToggleProps) {
  const m = useMotionPrefs();
  const accent = color ?? (m.themed ? m.tokens.colors.accent : '#6366f1');
  const trackOff = m.themed ? m.tokens.colors.muted : 'rgba(128,128,128,0.35)';
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked ?? internal;
  const height = width / 2;
  const knob = height - 6;
  const noMotion = m.reduce ? 'none' : undefined;

  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (checked === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label ?? 'Toggle'}
      disabled={disabled}
      onClick={toggle}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        font: 'inherit',
        ...style,
      }}
    >
      <span
        style={{
          width,
          height,
          borderRadius: 999,
          backgroundColor: on ? accent : trackOff,
          position: 'relative',
          transition: noMotion ?? 'background-color 0.25s ease',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: on ? width - knob - 3 : 3,
            width: knob,
            height: knob,
            borderRadius: '50%',
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            transition: noMotion ?? 'left 0.25s cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}
