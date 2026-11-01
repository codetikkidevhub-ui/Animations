import { CopyButton } from './CopyButton';

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div
      style={{
        border: '1px solid #1e293b',
        borderRadius: 10,
        overflow: 'hidden',
        background: '#0d0d17',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          borderBottom: '1px solid #1e293b',
          background: '#12121e',
        }}
      >
        <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
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
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
