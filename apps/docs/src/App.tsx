import { useEffect, useMemo, useState } from 'react';
import { AnimationProvider, PRESETS, type PresetName } from '@codetikki/animations';
import { CodeBlock } from './components/CodeBlock';
import { HomePage } from './components/HomePage';
import { ReelDemo } from './components/ReelDemo';
import { Sidebar } from './components/Sidebar';
import { registry, EXPLAINERS } from './registry';

type Mode = 'light' | 'dark' | 'auto';
type SiteTheme = 'light' | 'dark';

const selectStyle: React.CSSProperties = {
  background: 'var(--site-surface3)',
  color: 'var(--site-text-dim)',
  border: '1px solid var(--site-border-strong)',
  borderRadius: 8,
  padding: '6px 10px',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
};

function PropsTable({ entry }: { entry: (typeof registry)[number] }) {
  if (!entry.props?.length) return null;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ textAlign: 'left', color: 'var(--site-muted)' }}>
          <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--site-border)' }}>Prop</th>
          <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--site-border)' }}>Type</th>
          <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--site-border)' }}>Default</th>
          <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--site-border)' }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {entry.props.map((p) => (
          <tr key={p.name}>
            <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--site-card)', fontFamily: 'monospace', color: 'var(--site-code)' }}>
              {p.name}
            </td>
            <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--site-card)', fontFamily: 'monospace', color: 'var(--site-text-dim)' }}>
              {p.type}
            </td>
            <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--site-card)', fontFamily: 'monospace', color: 'var(--site-muted)' }}>
              {p.default ?? '—'}
            </td>
            <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--site-card)', color: 'var(--site-text-dim)' }}>
              {p.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function App() {
  const [activeId, setActiveId] = useState('home');
  const [theme, setTheme] = useState<PresetName>('midnight');
  const [mode, setMode] = useState<Mode>('dark');
  const [siteTheme, setSiteTheme] = useState<SiteTheme>(
    () => (localStorage.getItem('site-theme') as SiteTheme) || 'dark',
  );
  const entry = useMemo(() => registry.find((e) => e.id === activeId), [activeId]);

  useEffect(() => {
    document.documentElement.dataset.siteTheme = siteTheme;
    localStorage.setItem('site-theme', siteTheme);
  }, [siteTheme]);

  const usageCode = useMemo(() => {
    if (!entry) return '';
    const isThree = entry.name.includes('3D');
    const pkg = isThree ? '@codetikki/animations/three' : '@codetikki/animations';
    const names = entry.name
      .replace(/\(.*?\)/g, '')
      .split('/')
      .map((s) => s.trim())
      .filter(Boolean)
      .join(', ');
    return `# 1. add the library to your project
npm i @codetikki/animations motion react react-dom

# 2. import the component — no CSS import or setup needed
import { ${names} } from '${pkg}';

${entry.usage}`;
  }, [entry]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        active={activeId}
        onSelect={(id) => {
          setActiveId(id);
          window.scrollTo({ top: 0 });
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 48px',
            borderBottom: '1px solid var(--site-border)',
            background: 'color-mix(in srgb, var(--site-bg) 70%, transparent)',
            backdropFilter: 'blur(16px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
          }}
        >
          <span style={{ fontSize: 12.5, color: 'var(--site-muted)', marginRight: 10 }}>
            {entry ? `${entry.category} / ` : 'catalog / '}
            <b style={{ color: 'var(--site-text)', fontWeight: 700 }}>{entry ? entry.name : 'Home'}</b>
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--site-muted)', marginLeft: 'auto' }}>Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as PresetName)}
            style={selectStyle}
          >
            {(Object.keys(PRESETS) as PresetName[]).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['auto', 'light', 'dark'] as Mode[]).map((mo) => (
              <button
                key={mo}
                onClick={() => setMode(mo)}
                style={{
                  ...selectStyle,
                  padding: '6px 12px',
                  border: `1px solid ${mode === mo ? 'var(--site-accent)' : 'var(--site-border-strong)'}`,
                  color: mode === mo ? 'var(--site-code)' : 'var(--site-muted)',
                  background: mode === mo ? 'var(--site-accent-soft)' : 'var(--site-surface3)',
                }}
              >
                {mo}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'var(--site-faint)' }}>
            {'<AnimationProvider>'}
          </span>
          <button
            onClick={() => setSiteTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            title="Toggle site theme"
            style={{
              ...selectStyle,
              marginLeft: 'auto',
              padding: '6px 12px',
              fontSize: 15,
              lineHeight: 1,
            }}
          >
            {siteTheme === 'dark' ? '🌅' : '🌌'}
          </button>
        </header>
        <main style={{ flex: 1, padding: '32px 48px', maxWidth: 900, boxSizing: 'border-box', width: '100%' }}>
        {entry ? (
          <>
        <div style={{ fontSize: 12, color: 'var(--site-muted)', marginBottom: 6 }}>{entry.category}</div>
        <h1 style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 800, color: 'var(--site-text)' }}>{entry.name}</h1>

        <AnimationProvider theme={theme} mode={mode}>
          <div
            style={{
              position: 'relative',
              border: '1px dashed var(--site-border-strong)',
              borderRadius: 14,
              minHeight: entry.tall ? 260 : 140,
              display: 'grid',
              placeItems: 'center',
              padding: 24,
              marginBottom: 28,
              background: 'var(--site-surface)',
              overflow: 'hidden',
            }}
          >
            <entry.Demo />
            <div style={{ position: 'absolute', right: 14, bottom: 12, zIndex: 2 }}>
              <ReelDemo
                caption={entry.name}
                code={usageCode}
                explainer={
                  EXPLAINERS[entry.id] ?? {
                    en: `${entry.name} — a ${entry.category.toLowerCase()} animation from codetikki.`,
                  }
                }
              >
                <entry.Demo />
              </ReelDemo>
            </div>
          </div>
        </AnimationProvider>

        {entry.props?.length ? (
          <>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px', color: 'var(--site-text)' }}>Props</h2>
            <div style={{ marginBottom: 28 }}>
              <PropsTable entry={entry} />
            </div>
          </>
        ) : null}

        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px', color: 'var(--site-text)' }}>
          Usage — add to your project
        </h2>
        <div style={{ marginBottom: 28 }}>
          <CodeBlock code={usageCode} label="how to use" />
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px', color: 'var(--site-text)' }}>
          Source — copy into your project
        </h2>
        <CodeBlock code={entry.code} label={`${entry.name}.tsx`} />
          </>
        ) : (
          <HomePage onBrowse={setActiveId} />
        )}
        <footer
          style={{
            marginTop: 56,
            paddingTop: 14,
            borderTop: '1px solid var(--site-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 11,
            color: 'var(--site-faint)',
          }}
        >
          <span style={{ marginRight: 'auto' }}>© codetikki · apache-2.0</span>
          {[
            ['yashvilab.in', 'https://yashvilab.in'],
            ['codetikki.co.in', 'https://codetikki.co.in'],
            ['karyatikki.in', 'https://karyatikki.in'],
          ].map(([label, url]) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noreferrer"
              title={label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: 'var(--site-muted)',
                textDecoration: 'none',
                fontSize: 11,
                opacity: 0.75,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--site-accent)',
                  opacity: 0.6,
                }}
              />
              {label}
            </a>
          ))}
        </footer>
        </main>
      </div>
    </div>
  );
}
