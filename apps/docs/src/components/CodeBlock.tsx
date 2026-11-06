import { CopyButton } from './CopyButton';

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div
      style={{
        border: '1px solid var(--site-border)',
        borderRadius: 10,
        overflow: 'hidden',
        background: 'var(--site-surface)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          borderBottom: '1px solid var(--site-border)',
          background: 'var(--site-surface2)',
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--site-muted)', fontFamily: 'monospace' }}>
          {label ?? 'tsx'}
        </span>
        <CopyButton text={code} />
      </div>
      <pre
        style={{
          margin: 0,
          padding: 14,
          overflow: 'auto',
          maxHeight: 420,
          fontSize: 12.5,
          lineHeight: 1.6,
          fontFamily: 'ui-monospace, Consolas, monospace',
          color: 'var(--site-text)',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
