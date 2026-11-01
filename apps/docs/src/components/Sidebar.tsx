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
        borderRight: '1px solid #1e293b',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        padding: '20px 0',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '0 20px 16px', fontWeight: 800, fontSize: 17 }}>
        <span style={{ color: '#818cf8' }}>@</span>animations
        <div style={{ fontSize: 11, fontWeight: 400, color: '#64748b', marginTop: 2 }}>
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
              color: '#64748b',
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
                  borderLeft: `2px solid ${active === e.id ? '#818cf8' : 'transparent'}`,
                  background: active === e.id ? 'rgba(129,140,248,0.1)' : 'transparent',
                  color: active === e.id ? '#c7d2fe' : '#94a3b8',
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
