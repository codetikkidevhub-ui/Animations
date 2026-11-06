import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

export const Fireflies = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 10; i++) {
    const a = rand() * Math.PI * 2, d = rand(), sp = 0.3 + rand() * 0.5;
    const x = w / 2 + Math.cos(a + t * sp) * w * 0.4 * d;
    const y = w / 2 + Math.sin(a * 1.4 + t * sp * 0.7) * w * 0.4 * d;
    const glow = Math.abs(Math.sin(t * 2 + i * 2.2));
    ctx.fillStyle = c1; ctx.shadowColor = c1; ctx.shadowBlur = 8 * glow;
    ctx.globalAlpha = 0.2 + glow * 0.8;
    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.shadowBlur = 0; ctx.globalAlpha = 1; void c2;
}, { colors: ['#facc15', '#65a30d'] });

export const LeafFall = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 8; i++) {
    const off = rand() * 2, x0 = w * (0.15 + rand() * 0.7);
    const p = (t * (0.15 + rand() * 0.2) + off) % 1;
    const x = x0 + Math.sin(p * 8 + i) * w * 0.1;
    const y = p * w * 1.1 - w * 0.05;
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(p * 6 + i) * 0.8);
    ctx.fillStyle = mixColors(c1, c2, rand());
    ctx.globalAlpha = Math.min(1, (1 - p) * 1.8);
    ctx.beginPath(); ctx.ellipse(0, 0, w * 0.035, w * 0.02, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#84cc16', '#f97316'] });

export const SnowDrift = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 24; i++) {
    const x0 = rand(), sp = 0.1 + rand() * 0.2, r = rand() * 0.02 + 0.008;
    const p = (t * sp + rand() * 3) % 1;
    const x = w * x0 + Math.sin(p * 5 + i) * w * 0.06;
    const y = p * w * 1.05;
    ctx.fillStyle = mixColors(c1, c2, rand() * 0.4);
    ctx.globalAlpha = 0.4 + rand() * 0.6;
    ctx.beginPath(); ctx.arc(x, y, w * r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#e0f2fe', '#7dd3fc'] });

export const FlameDance = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, base = w * 0.75;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 3; i++) {
    const sc = 1 - i * 0.28;
    ctx.beginPath();
    ctx.moveTo(cx, base);
    const h = w * 0.5 * sc * (0.9 + 0.15 * Math.sin(t * 7 + i * 2));
    const sway = Math.sin(t * 5 + i) * w * 0.05;
    ctx.bezierCurveTo(cx - w * 0.16 * sc + sway, base - h * 0.4, cx + w * 0.16 * sc + sway, base - h * 0.7, cx + sway, base - h);
    ctx.bezierCurveTo(cx + w * 0.1 * sc, base - h * 0.6, cx - w * 0.1 * sc, base - h * 0.4, cx, base);
    ctx.fillStyle = withAlpha(mixColors(c1, c2, i / 3), 0.85 - i * 0.2);
    ctx.fill();
  }
}, { colors: ['#facc15', '#ef4444'] });

export const WaveGrass = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const n = 12;
  for (let i = 0; i < n; i++) {
    const x = w * 0.1 + (i / (n - 1)) * w * 0.8;
    const bend = Math.sin(t * 1.8 - i * 0.45) * w * 0.1;
    const h = w * (0.3 + 0.15 * Math.sin(i * 1.7));
    ctx.strokeStyle = mixColors(c1, c2, i / n);
    ctx.lineWidth = w * 0.02; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, w * 0.9);
    ctx.quadraticCurveTo(x + bend * 0.3, w * 0.9 - h * 0.6, x + bend, w * 0.9 - h);
    ctx.stroke();
  }
}, { colors: ['#4ade80', '#22d3ee'] });

export const PetalSwirl = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 12; i++) {
    const p = i / 12, a = t * 1.5 + i * 0.52;
    const r = w * 0.38 * (0.3 + p * 0.7);
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.9;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2);
    ctx.fillStyle = withAlpha(mixColors(c1, c2, p), 0.85);
    ctx.beginPath(); ctx.ellipse(0, 0, w * 0.05, w * 0.022, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}, { colors: ['#f472b6', '#a78bfa'] });

export const BirdFlock = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 7; i++) {
    const p = (t * 0.25 + i * 0.13) % 1;
    const x = -w * 0.1 + p * w * 1.2;
    const y = w * (0.25 + (i % 4) * 0.12) + Math.sin(t * 3 + i) * w * 0.04;
    const flap = Math.sin(t * 6 + i * 1.3) * w * 0.03;
    const s = w * 0.05;
    ctx.strokeStyle = mixColors(c1, c2, i / 7);
    ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.globalAlpha = Math.min(1, Math.min(p, 1 - p) * 5);
    ctx.beginPath();
    ctx.moveTo(x - s, y - flap); ctx.quadraticCurveTo(x, y + flap * 0.5, x, y);
    ctx.quadraticCurveTo(x, y + flap * 0.5, x + s, y - flap);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#94a3b8', '#38bdf8'] });

export const CloudDrift = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 4; i++) {
    const p = (t * (0.08 + i * 0.03) + i * 0.31) % 1.3;
    const x = -w * 0.25 + p * w * 1.4;
    const y = w * (0.2 + i * 0.18);
    const s = w * (0.1 + (i % 2) * 0.05);
    ctx.fillStyle = withAlpha(mixColors(c1, c2, i / 4), 0.7);
    for (const [dx, dy, r] of [[0, 0, 1], [-0.8, 0.25, 0.7], [0.8, 0.25, 0.75], [0, -0.4, 0.7]] as const) {
      ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); ctx.fill();
    }
  }
}, { colors: ['#e0f2fe', '#94a3b8'] });

export const StormFlash = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const ph = (t * 0.6) % 1;
  if (ph < 0.15) {
    ctx.fillStyle = withAlpha(c1, (0.15 - ph) * 4);
    ctx.fillRect(0, 0, w, w);
  }
  const cx = w / 2;
  ctx.strokeStyle = c1; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  ctx.shadowColor = c1; ctx.shadowBlur = 10;
  ctx.globalAlpha = ph < 0.5 ? 1 : Math.max(0, 1 - (ph - 0.5) * 3);
  ctx.beginPath();
  ctx.moveTo(cx + w * 0.05, w * 0.12);
  ctx.lineTo(cx - w * 0.08, w * 0.45);
  ctx.lineTo(cx + w * 0.02, w * 0.48);
  ctx.lineTo(cx - w * 0.06, w * 0.75);
  ctx.stroke();
  ctx.shadowBlur = 0; ctx.globalAlpha = 1; void c2;
}, { colors: ['#facc15', '#f97316'] });

export const VineCurl = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  ctx.beginPath();
  const turns = 3 + Math.sin(t * 0.8) * 0.8;
  for (let i = 0; i <= 200; i++) {
    const p = i / 200, a = p * Math.PI * 2 * turns + t * 0.4;
    const r = w * 0.4 * p;
    const x = w / 2 + Math.cos(a) * r, y = w / 2 + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const p = i / 8, a = p * Math.PI * 2 * turns + t * 0.4;
    const r = w * 0.4 * p;
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.ellipse(w / 2 + Math.cos(a) * r, w / 2 + Math.sin(a) * r, w * 0.025, w * 0.012, a, 0, Math.PI * 2);
    ctx.fill();
  }
}, { colors: ['#4ade80', '#15803d'] });

export const EmberRise = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 15; i++) {
    const x0 = rand(), sp = 0.2 + rand() * 0.3, p = (t * sp + rand() * 3) % 1;
    const x = w * (0.25 + x0 * 0.5) + Math.sin(p * 6 + i) * w * 0.08;
    const y = w * 0.9 - p * w * 0.85;
    const r = w * (0.008 + rand() * 0.02) * (1 - p * 0.5);
    ctx.fillStyle = mixColors(c1, c2, rand());
    ctx.globalAlpha = 1 - p;
    ctx.shadowColor = c1; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.shadowBlur = 0; ctx.globalAlpha = 1;
}, { colors: ['#fb923c', '#ef4444'] });

export const TidalMoon = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  const moonY = w * 0.28 + Math.sin(t * 0.5) * w * 0.04;
  ctx.fillStyle = c2;
  ctx.beginPath(); ctx.arc(cx, moonY, w * 0.1, 0, Math.PI * 2); ctx.fill();
  const tide = 0.5 + 0.3 * Math.sin(t * 0.7 - 0.8);
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const y = w * (0.75 - tide * 0.15) + Math.sin(x * 0.08 + t * 1.5) * w * 0.025;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.lineTo(w, w); ctx.lineTo(0, w); ctx.closePath();
  ctx.fillStyle = withAlpha(c1, 0.8); ctx.fill();
}, { colors: ['#38bdf8', '#e0f2fe'] });
