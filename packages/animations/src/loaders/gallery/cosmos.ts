import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

export const GalaxySpiral = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.46;
  ctx.clearRect(0, 0, w, w);
  for (let arm = 0; arm < 3; arm++) {
    for (let i = 0; i < 46; i++) {
      const p = i / 46, a = t * 0.6 + arm * (Math.PI * 2 / 3) + p * 4.5;
      const r = p * R;
      ctx.fillStyle = mixColors(c1, c2, p);
      ctx.globalAlpha = 0.25 + (1 - p) * 0.75;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.2 - p * 1.4, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1; ctx.fillStyle = c1;
  ctx.shadowColor = c1; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.05, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
}, { colors: ['#a78bfa', '#22d3ee'] });

export const SupernovaBurst = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const cycle = (t * 0.5) % 1;
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2 + (i % 5) * 0.03;
    const len = w * 0.48 * (0.4 + cycle * 0.6) * (0.6 + (i % 4) * 0.13);
    ctx.strokeStyle = mixColors(c1, c2, i / 40);
    ctx.globalAlpha = (1 - cycle) * 0.9;
    ctx.lineWidth = 2 - cycle * 1.4;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.04 * (1 - cycle * 0.5), 0, Math.PI * 2); ctx.fill();
}, { colors: ['#fbbf24', '#ef4444'] });

export const Starfall = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const r = rand;
  for (let i = 0; i < 14; i++) {
    const p = r(), sp = 0.4 + r() * 0.5;
    const y = ((p + t * sp * 0.25) % 1.2 - 0.1) * w;
    const x = r() * w;
    const len = w * (0.08 + r() * 0.12);
    const g = ctx.createLinearGradient(x, y, x + len * 0.4, y - len);
    g.addColorStop(0, mixColors(c1, c2, r()));
    g.addColorStop(1, 'transparent');
    ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len * 0.4, y - len); ctx.stroke();
  }
}, { colors: ['#e2e8f0', '#818cf8'] });

export const NebulaDrift = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 6; i++) {
    const p = i / 6, a = t * (0.15 + i * 0.04) + i * 2.4;
    const x = cx + Math.cos(a) * w * 0.18, y = cy + Math.sin(a * 1.3) * w * 0.15;
    const rr = w * (0.16 + 0.05 * Math.sin(t + i));
    const g = ctx.createRadialGradient(x, y, 0, x, y, rr);
    g.addColorStop(0, withAlpha(mixColors(c1, c2, p), 0.5));
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
  }
  for (let s = 0; s < 20; s++) {
    const a = rand() * Math.PI * 2, d = rand() * w * 0.45;
    ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 2 + s));
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 0.9, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#ec4899', '#6366f1'] });

export const PlanetRise = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  const horiz = w * 0.62, pr = w * 0.16;
  const y = horiz - Math.abs(Math.sin(t * 0.8)) * w * 0.28;
  ctx.fillStyle = c2; ctx.globalAlpha = 0.9;
  ctx.fillRect(0, horiz, w, w - horiz);
  ctx.globalAlpha = 1;
  const g = ctx.createRadialGradient(cx - pr * 0.4, y - pr * 0.4, pr * 0.1, cx, y, pr);
  g.addColorStop(0, c1); g.addColorStop(1, mixColors(c1, c2, 0.7));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, y, pr, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, y, pr * 1.7, pr * 0.35, -0.3, 0, Math.PI * 2);
  ctx.strokeStyle = withAlpha(c2, 0.8); ctx.lineWidth = w * 0.015; ctx.stroke(); ctx.restore();
}, { colors: ['#fb923c', '#7c3aed'] });

export const MeteorShower = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 8; i++) {
    const off = (t * 0.5 + i * 0.37) % 1.4;
    const x = w * 1.1 - off * w * 1.4, y = w * 0.15 + off * w * 0.9 + (i % 3) * w * 0.08;
    const trail = w * 0.3;
    const g = ctx.createLinearGradient(x, y, x + trail * 0.7, y - trail * 0.7);
    g.addColorStop(0, i % 2 ? c1 : c2); g.addColorStop(1, 'transparent');
    ctx.strokeStyle = g; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    ctx.globalAlpha = Math.min(1, (1.4 - off) * 3) * Math.min(1, off * 6);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + trail * 0.7, y - trail * 0.7); ctx.stroke();
  }
  ctx.globalAlpha = 1; void rand;
}, { colors: ['#facc15', '#f472b6'] });

export const BlackHole = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.4;
  ctx.clearRect(0, 0, w, w);
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.13, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = c1; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.13, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 30; i++) {
    const p = i / 30, a = t * 2.2 + p * Math.PI * 6;
    const r = R * (0.35 + p * 0.65) * (1 - 0.4 * Math.abs(Math.sin(t * 0.5 + p * 9)));
    ctx.fillStyle = mixColors(c1, c2, p);
    ctx.globalAlpha = 0.9 - p * 0.6;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.5, 1.8 - p, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#f59e0b', '#7c3aed'] });

export const Constellation = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const pts: [number, number][] = [];
  for (let i = 0; i < 9; i++) pts.push([w * (0.15 + rand() * 0.7), w * (0.15 + rand() * 0.7)]);
  ctx.strokeStyle = withAlpha(c2, 0.5); ctx.lineWidth = 1;
  for (let i = 0; i < pts.length - 1; i++) {
    ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke();
  }
  const pulse = (t * 0.6) % pts.length;
  pts.forEach(([x, y], i) => {
    const near = Math.max(0, 1 - Math.abs(pulse - i));
    ctx.fillStyle = mixColors(c2, c1, near);
    ctx.shadowColor = c1; ctx.shadowBlur = near * 12;
    ctx.beginPath(); ctx.arc(x, y, 2 + near * 2.5, 0, Math.PI * 2); ctx.fill();
  });
  ctx.shadowBlur = 0;
}, { colors: ['#facc15', '#818cf8'] });

export const MoonPhases = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, r = w * 0.22;
  ctx.clearRect(0, 0, w, w);
  ctx.strokeStyle = withAlpha(c2, 0.4); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2); ctx.stroke();
  const phase = (t * 0.25) % 1;
  const sq = Math.cos(phase * Math.PI * 2);
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = mixColors(c2, '#000', 0.75);
  ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(sq) * r, r, 0, sq > 0 ? 0 : Math.PI, sq > 0 ? Math.PI : Math.PI * 2); ctx.fill();
  ctx.strokeStyle = withAlpha(c1, 0.8);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
}, { colors: ['#fef3c7', '#334155'] });


export const SolarFlare = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.16;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const flick = 0.5 + 0.5 * Math.sin(t * 6 + i * 2.4);
    const len = R * (1.3 + flick * 0.9);
    ctx.strokeStyle = mixColors(c1, c2, flick);
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.globalAlpha = 0.5 + flick * 0.5;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); ctx.stroke();
  }
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.1);
  g.addColorStop(0, '#fff7ed'); g.addColorStop(0.6, c1); g.addColorStop(1, mixColors(c1, c2, 0.6));
  ctx.globalAlpha = 1; ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#facc15', '#ef4444'] });

export const AuroraCrown = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let band = 0; band < 3; band++) {
    ctx.beginPath();
    const yBase = w * (0.35 + band * 0.14);
    for (let x = 0; x <= w; x += 4) {
      const y = yBase + Math.sin(x * 0.05 + t * (1 + band * 0.3) + band * 2) * w * 0.08;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = withAlpha(mixColors(c1, c2, band / 2), 0.6);
    ctx.lineWidth = w * 0.05; ctx.lineCap = 'round'; ctx.stroke();
  }
}, { colors: ['#34d399', '#818cf8'] });

export const VoidPortal = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 8; i > 0; i--) {
    const p = i / 8, a = t * (1 - p * 0.5) + i;
    const r = w * 0.42 * p * (0.9 + 0.1 * Math.sin(t * 2 + i));
    ctx.strokeStyle = mixColors(c1, c2, 1 - p);
    ctx.lineWidth = 2.5 - p * 1.5; ctx.globalAlpha = 0.3 + (1 - p) * 0.6;
    for (let s = 0; s < 6; s++) {
      const a0 = a + s * (Math.PI * 2 / 6);
      ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + Math.PI / 9); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}, { colors: ['#22d3ee', '#a78bfa'] });
