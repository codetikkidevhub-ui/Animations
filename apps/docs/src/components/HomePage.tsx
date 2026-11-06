import {
  ChaosAttractor,
  DiscoBall,
  DiyaFlame,
  FractalMelt,
  ImpossibleTri,
  MetaballGoo,
  NeuralStorm,
  PeacockFan,
  Tesseract,
  TubeMan,
  VoidEye,
  WarpTunnel,
} from '@codetikki/animations';
import { registry } from '../registry';
import { CopyButton } from './CopyButton';

const WALL = [
  ['Tesseract', Tesseract],
  ['VoidEye', VoidEye],
  ['ChaosAttractor', ChaosAttractor],
  ['DiscoBall', DiscoBall],
  ['TubeMan', TubeMan],
  ['MetaballGoo', MetaballGoo],
  ['FractalMelt', FractalMelt],
  ['NeuralStorm', NeuralStorm],
  ['ImpossibleTri', ImpossibleTri],
  ['WarpTunnel', WarpTunnel],
  ['PeacockFan', PeacockFan],
  ['DiyaFlame', DiyaFlame],
] as const;

export function HomePage({ onBrowse }: { onBrowse: (id: string) => void }) {
  const title = 'ANIMATION, AMPLIFIED';
  return (
    <div>
      <style>{`
        @keyframes homeLetter {
          from { opacity: 0; transform: translateY(28px) rotate(4deg); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0) rotate(0); filter: blur(0); }
        }
        @keyframes homeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .home-tile { transition: transform 0.25s ease, border-color 0.25s ease; }
        .home-tile:hover { transform: translateY(-4px) scale(1.03); border-color: var(--site-accent) !important; }
      `}</style>

      {/* eyebrow */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 999,
          border: '1px solid var(--site-border-strong)',
          background: 'var(--site-accent-soft)',
          color: 'var(--site-accent)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          marginBottom: 26,
        }}
      >
        ✦ {registry.length} COMPONENTS · ZERO CSS · FREE FOREVER
      </div>

      {/* staggered headline */}
      <h1 style={{ margin: '0 0 10px', lineHeight: 0.95, fontSize: 'clamp(44px, 8vw, 84px)', fontWeight: 900 }}>
        {title.split('').map((ch, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: ch === ' ' ? 'pre' : undefined,
              background: i < 9 ? 'linear-gradient(120deg, var(--site-accent), #ec4899)' : 'none',
              WebkitBackgroundClip: i < 9 ? 'text' : undefined,
              color: i < 9 ? 'transparent' : 'var(--site-text)',
              animation: `homeLetter 0.7s ${i * 0.03}s cubic-bezier(0.2, 0.9, 0.3, 1.2) both`,
            }}
          >
            {ch}
          </span>
        ))}
      </h1>
      <p style={{ margin: '0 0 30px', fontSize: 17, color: 'var(--site-text-dim)', maxWidth: 560 }}>
        The animation library that doesn't do boring. One import, no CSS file,
        10 themes, and loaders that look like they escaped a sci-fi movie.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 44 }}>
        <button
          onClick={() => onBrowse('chaos-attractor')}
          style={{
            padding: '12px 22px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(120deg, var(--site-accent), #ec4899)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 8px 28px rgba(124,58,237,0.35)',
          }}
        >
          Browse the catalog →
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid var(--site-border)',
            background: 'var(--site-surface)',
            fontFamily: 'ui-monospace, monospace',
            fontSize: 13,
            color: 'var(--site-code)',
          }}
        >
          npm i @codetikki/animations
          <CopyButton text="npm i @codetikki/animations" />
        </div>
      </div>

      {/* live loader wall */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 40,
        }}
      >
        {WALL.map(([name, Comp], i) => (
          <button
            key={name}
            onClick={() => onBrowse(name.replace(/[A-Z]/g, (m, j) => (j ? '-' : '') + m.toLowerCase()))}
            className="home-tile"
            style={{
              padding: 12,
              borderRadius: 14,
              border: '1px solid var(--site-border)',
              background: 'var(--site-card)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              animation: `homeFloat 5s ${i * 0.35}s ease-in-out infinite`,
            }}
          >
            <Comp size={110} />
            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: 'var(--site-text-dim)' }}>{name}</div>
          </button>
        ))}
      </div>

      {/* stats strip */}
      <div
        style={{
          display: 'flex',
          gap: 28,
          flexWrap: 'wrap',
          padding: '18px 22px',
          borderRadius: 14,
          border: '1px solid var(--site-border)',
          background: 'var(--site-surface)',
        }}
      >
        {[
          [String(registry.length), 'components'],
          ['10', 'themes × light/dark'],
          ['0', 'CSS imports needed'],
          ['60fps', 'canvas engine'],
          ['∞', 'generative seeds'],
        ].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--site-accent)' }}>{n}</div>
            <div style={{ fontSize: 11, color: 'var(--site-muted)', letterSpacing: '0.05em' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
