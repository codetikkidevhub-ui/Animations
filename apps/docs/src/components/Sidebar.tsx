import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, registry } from '../registry';

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState('');

  const activeCat = useMemo(
    () => registry.find((e) => e.id === active)?.category,
    [active],
  );

  // Keep the active item's category expanded
  useEffect(() => {
    if (activeCat) setOpen((s) => (s.has(activeCat) ? s : new Set([...s, activeCat])));
  }, [activeCat]);

  const toggle = (cat: string) =>
    setOpen((s) => {
      const next = new Set(s);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  const q = query.trim().toLowerCase();
  const items = (cat: string) =>
    registry.filter((e) => e.category === cat && (!q || e.name.toLowerCase().includes(q)));

  if (collapsed) {
    return (
      <nav
        style={{
          width: 40,
          flexShrink: 0,
          borderRight: '1px solid var(--site-border)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          padding: '12px 0',
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: 'var(--site-text-dim)',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          ☰
        </button>
      </nav>
    );
  }

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
        padding: '16px 0 20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          padding: '0 16px 12px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--site-text)' }}>
          <span style={{ color: 'var(--site-accent)' }}>@</span>animations
          <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--site-muted)', marginTop: 2 }}>
            {registry.length} components
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--site-muted)',
            fontSize: 14,
            cursor: 'pointer',
            padding: 2,
          }}
        >
          ◀
        </button>
      </div>

      <div style={{ padding: '0 16px 12px' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components…"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '7px 10px',
            fontSize: 13,
            fontFamily: 'inherit',
            color: 'var(--site-text)',
            background: 'var(--site-panel)',
            border: '1px solid var(--site-border)',
            borderRadius: 8,
            outline: 'none',
          }}
        />
      </div>

      {CATEGORIES.map((cat) => {
        const list = items(cat);
        if (q && list.length === 0) return null;
        const expanded = q ? true : open.has(cat);
        return (
          <div key={cat} style={{ marginBottom: 6 }}>
            <button
              onClick={() => toggle(cat)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                textAlign: 'left',
                padding: '6px 16px',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--site-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ width: 14, display: 'inline-block' }}>{expanded ? '▾' : '▸'}</span>
              <span style={{ flex: 1 }}>{cat}</span>
              <span style={{ fontWeight: 400, opacity: 0.7 }}>{list.length}</span>
            </button>
            {expanded &&
              list.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onSelect(e.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '5px 16px 5px 30px',
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
        );
      })}
    </nav>
  );
}
