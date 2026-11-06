import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (non-secure context) — fall back
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      style={{
        padding: '5px 12px',
        fontSize: 12,
        fontWeight: 600,
        borderRadius: 6,
        border: '1px solid var(--site-border-strong)',
        background: copied ? '#14532d' : 'var(--site-surface3)',
        color: copied ? '#86efac' : 'var(--site-text-dim)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
