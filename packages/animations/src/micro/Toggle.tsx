import { useState } from 'react';
import type { CSSProperties } from 'react';

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Track width in px. */
  width?: number;
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
  color = '#6366f1',
  label,
  className,
  style,
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked ?? internal;
  const height = width / 2;
  const knob = height - 6;

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
          backgroundColor: on ? color : 'rgba(128,128,128,0.35)',
          position: 'relative',
          transition: 'background-color 0.25s ease',
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
            transition: 'left 0.25s cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}
