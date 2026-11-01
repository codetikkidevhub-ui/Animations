import { useMemo, useState } from 'react';
import { CodeBlock } from './components/CodeBlock';
import { Sidebar } from './components/Sidebar';
import { registry } from './registry';

function PropsTable({ entry }: { entry: (typeof registry)[number] }) {
  if (!entry.props?.length) return null;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ textAlign: 'left', color: '#64748b' }}>
          <th style={{ padding: '6px 10px', borderBottom: '1px solid #1e293b' }}>Prop</th>
          <th style={{ padding: '6px 10px', borderBottom: '1px solid #1e293b' }}>Type</th>
          <th style={{ padding: '6px 10px', borderBottom: '1px solid #1e293b' }}>Default</th>
          <th style={{ padding: '6px 10px', borderBottom: '1px solid #1e293b' }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {entry.props.map((p) => (
          <tr key={p.name}>
            <td style={{ padding: '6px 10px', borderBottom: '1px solid #141422', fontFamily: 'monospace', color: '#c7d2fe' }}>
              {p.name}
            </td>
            <td style={{ padding: '6px 10px', borderBottom: '1px solid #141422', fontFamily: 'monospace', color: '#94a3b8' }}>
              {p.type}
            </td>
            <td style={{ padding: '6px 10px', borderBottom: '1px solid #141422', fontFamily: 'monospace', color: '#64748b' }}>
              {p.default ?? '—'}
            </td>
            <td style={{ padding: '6px 10px', borderBottom: '1px solid #141422', color: '#94a3b8' }}>
              {p.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function App() {
  const [activeId, setActiveId] = useState(registry[0].id);
  const entry = useMemo(() => registry.find((e) => e.id === activeId)!, [activeId]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        active={activeId}
        onSelect={(id) => {
          setActiveId(id);
          window.scrollTo({ top: 0 });
        }}
      />
      <main style={{ flex: 1, padding: '40px 48px', maxWidth: 900, boxSizing: 'border-box' }}>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{entry.category}</div>
        <h1 style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 800 }}>{entry.name}</h1>

        <div
          style={{
            border: '1px dashed #334155',
            borderRadius: 14,
            minHeight: entry.tall ? 260 : 140,
            display: 'grid',
            placeItems: 'center',
            padding: 24,
            marginBottom: 28,
            background: '#0d0d17',
            overflow: 'hidden',
          }}
        >
          <entry.Demo />
        </div>

        {entry.props?.length ? (
          <>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px', color: '#cbd5e1' }}>Props</h2>
            <div style={{ marginBottom: 28 }}>
              <PropsTable entry={entry} />
            </div>
          </>
        ) : null}

        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px', color: '#cbd5e1' }}>Usage</h2>
        <div style={{ marginBottom: 28 }}>
          <CodeBlock code={entry.usage} label="usage" />
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px', color: '#cbd5e1' }}>
          Source — copy into your project
        </h2>
        <CodeBlock code={entry.code} label={`${entry.name}.tsx`} />
      </main>
    </div>
  );
}
