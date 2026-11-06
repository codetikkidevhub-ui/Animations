import { CATEGORIES, registry } from '../registry';

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <nav
      style={{
        width: 240,
        flexShrink: 0,
        borderRight: '1px solid var(--site-border)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        padding: '20px 0',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '0 20px 16px', fontWeight: 800, fontSize: 17, color: 'var(--site-text)' }}>
        <span style={{ color: 'var(--site-accent)' }}>@</span>animations
        <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--site-muted)', marginTop: 2 }}>
          {registry.length} components
        </div>
      </div>
      {CATEGORIES.map((cat) => (
        <div key={cat} style={{ marginBottom: 14 }}>
          <div
            style={{
              padding: '4px 20px',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--site-muted)',
            }}
          >
            {cat}
          </div>
          {registry
            .filter((e) => e.category === cat)
            .map((e) => (
              <button
                key={e.id}
                onClick={() => onSelect(e.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 20px 6px 28px',
                  fontSize: 13.5,
                  border: 'none',
                  borderLeft: `2px solid ${active === e.id ? 'var(--site-accent)' : 'transparent'}`,
                  background: active === e.id ? 'var(--site-accent-soft)' : 'transparent',
                  color: active === e.id ? 'var(--site-code)' : 'var(--site-text-dim)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {e.name}
              </button>
            ))}
        </div>
      ))}
    </nav>
  );
}
