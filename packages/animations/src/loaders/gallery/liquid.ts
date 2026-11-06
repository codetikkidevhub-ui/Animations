import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

export const InkDrop = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const ph = (t * 0.55) % 1;
  const y = w * 0.15 + ph * w * 0.45;
  ctx.fillStyle = c1;
  ctx.beginPath();
  ctx.ellipse(cx, y, w * 0.045 * (1 - ph * 0.2), w * 0.06 * (1 + ph * 0.4), 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 1; i <= 3; i++) {
    const rp = (ph + i * 0.22) % 1;
    ctx.globalAlpha = (1 - rp) * 0.7;
    ctx.strokeStyle = mixColors(c1, c2, rp);
    ctx.lineWidth = 2.5 * (1 - rp);
    ctx.beginPath();
    ctx.ellipse(cx, cy + w * 0.18, w * 0.38 * rp + w * 0.03, w * 0.14 * rp + w * 0.01, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#22d3ee', '#6366f1'] });

export const LavaBlob = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  ctx.fillStyle = withAlpha(c2, 0.15);
  ctx.beginPath(); ctx.arc(cx, w / 2, w * 0.44, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 5; i++) {
    const ph = (t * 0.3 + i * 0.2) % 1;
    const x = cx + Math.sin(i * 2.4 + t * 0.3) * w * 0.16;
    const y = w * 0.85 - ph * w * 0.7;
    const r = w * (0.05 + 0.04 * Math.abs(Math.sin(i * 5)));
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
    g.addColorStop(0, c1); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.globalAlpha = Math.min(1, (1 - ph) * 1.6);
    ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1; ctx.fillStyle = c1;
  ctx.beginPath(); ctx.ellipse(cx, w * 0.82, w * 0.28, w * 0.08 + Math.sin(t * 2) * w * 0.01, 0, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#f97316', '#dc2626'] });

export const RippleTank = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  ctx.strokeStyle = withAlpha(c2, 0.5);
  ctx.strokeRect(w * 0.08, w * 0.08, w * 0.84, w * 0.84);
  for (let i = 0; i < 6; i++) {
    const p = (t * 0.6 + i / 6) % 1;
    ctx.globalAlpha = (1 - p) * 0.8;
    ctx.strokeStyle = mixColors(c1, c2, p);
    ctx.lineWidth = 2 * (1 - p) + 0.5;
    ctx.beginPath(); ctx.arc(cx, cy, p * w * 0.42, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#38bdf8', '#818cf8'] });

export const WaveOcean = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let row = 0; row < 3; row++) {
    const yBase = w * (0.5 + row * 0.13), amp = w * (0.05 + row * 0.02);
    ctx.beginPath(); ctx.moveTo(0, w);
    for (let x = 0; x <= w; x += 3) {
      const y = yBase + Math.sin(x * 0.07 + t * (1.4 - row * 0.35) + row * 2) * amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, w); ctx.closePath();
    ctx.fillStyle = withAlpha(mixColors(c1, c2, row / 2), 0.75);
    ctx.fill();
  }
}, { colors: ['#0ea5e9', '#6366f1'] });

export const BubbleRise = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 14; i++) {
    const x0 = rand(), rr = rand() * 0.05 + 0.02, ph = (t * (0.15 + rand() * 0.2) + rand()) % 1;
    const x = w * (0.15 + x0 * 0.7) + Math.sin(t * 2 + i) * w * 0.02;
    const y = w * 0.95 - ph * w * 0.9;
    const r = w * rr;
    ctx.globalAlpha = 0.25 + (1 - ph) * 0.55;
    ctx.strokeStyle = mixColors(c1, c2, rand());
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.22, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#67e8f9', '#a78bfa'] });

export const LiquidFill = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.36;
  ctx.clearRect(0, 0, w, w);
  ctx.strokeStyle = c2; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  const lvl = 0.5 + 0.35 * Math.sin(t * 0.7);
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R - 2, 0, Math.PI * 2); ctx.clip();
  ctx.beginPath();
  for (let x = 0; x <= w; x += 3) {
    const y = cy + R * (1 - lvl * 2) + Math.sin(x * 0.1 + t * 3) * w * 0.03;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.lineTo(w, w); ctx.lineTo(0, w); ctx.closePath();
  const g = ctx.createLinearGradient(0, cy - R, 0, cy + R);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fill();
  ctx.restore();
}, { colors: ['#22d3ee', '#0ea5e9'] });

export const SplashCrown = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w * 0.62;
  ctx.clearRect(0, 0, w, w);
  const ph = (t * 0.8) % 1;
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i - 4.5) * 0.32;
    const d = w * 0.05 + ph * w * 0.28;
    const x = cx + Math.cos(a) * d * 1.3, y = cy + Math.sin(a) * d * 0.9 + ph * ph * w * 0.15;
    ctx.fillStyle = mixColors(c1, c2, i / 10);
    ctx.globalAlpha = Math.max(0, 1 - ph * 1.1);
    ctx.beginPath(); ctx.arc(x, y, w * 0.025 * (1 - ph * 0.4), 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 0.9; ctx.fillStyle = c1;
  ctx.beginPath(); ctx.ellipse(cx, cy + w * 0.02, w * (0.14 + ph * 0.1), w * 0.04, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}, { colors: ['#38bdf8', '#818cf8'] });

export const VortexDrain = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 60; i++) {
    const p = i / 60, a = t * 2.2 + p * Math.PI * 8;
    const r = w * 0.42 * (1 - p) * (0.85 + 0.15 * Math.sin(t + p * 20));
    ctx.fillStyle = mixColors(c1, c2, p);
    ctx.globalAlpha = 0.3 + p * 0.6;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.2 - p * 1.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1; ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.04, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#a78bfa', '#ec4899'] });

export const OilSlick = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 5; i++) {
    const p = i / 5, a = t * 0.4 + i * 1.26;
    const rr = w * (0.12 + p * 0.28) * (1 + 0.08 * Math.sin(t * 1.5 + i));
    const x = cx + Math.cos(a) * w * 0.06, y = cy + Math.sin(a) * w * 0.06;
    const g = ctx.createRadialGradient(x, y, rr * 0.3, x, y, rr);
    g.addColorStop(0, 'transparent');
    g.addColorStop(0.75, withAlpha(mixColors(c1, c2, p), 0.5));
    g.addColorStop(1, withAlpha(mixColors(c2, c1, p), 0.25));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(x, y, rr, rr * 0.75, a, 0, Math.PI * 2); ctx.fill();
  }
}, { colors: ['#a78bfa', '#34d399'] });

export const RainStreak = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  ctx.strokeStyle = withAlpha(c2, 0.4); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(w * 0.1, w * 0.8); ctx.lineTo(w * 0.9, w * 0.8); ctx.stroke();
  for (let i = 0; i < 18; i++) {
    const x = w * (0.08 + rand() * 0.84), ph = (t * (0.5 + rand() * 0.5) + rand()) % 1;
    const y = ph * w * 0.72, len = w * 0.07;
    ctx.strokeStyle = mixColors(c1, c2, rand());
    ctx.lineWidth = 1.4; ctx.globalAlpha = 0.3 + (1 - ph) * 0.6;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len * 0.15, y + len); ctx.stroke();
    if (ph > 0.92) {
      ctx.globalAlpha = (ph - 0.92) * 6;
      ctx.beginPath(); ctx.ellipse(x, w * 0.8, w * 0.03, w * 0.01, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}, { colors: ['#38bdf8', '#0ea5e9'] });

export const DropletChain = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.32;
  ctx.clearRect(0, 0, w, w);
  const n = 8;
  for (let i = 0; i < n; i++) {
    const p = (t * 0.4 + i / n) % 1;
    const a = (i / n) * Math.PI * 2;
    const r = R * (0.75 + 0.25 * Math.sin(p * Math.PI * 2));
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    const s = w * (0.02 + 0.03 * Math.sin(p * Math.PI));
    ctx.fillStyle = mixColors(c1, c2, p);
    ctx.beginPath();
    ctx.moveTo(x, y - s * 1.6);
    ctx.quadraticCurveTo(x + s, y - s * 0.3, x + s * 0.9, y + s * 0.5);
    ctx.arc(x, y + s * 0.5, s * 0.9, -0.3, Math.PI + 0.3);
    ctx.quadraticCurveTo(x - s, y - s * 0.3, x, y - s * 1.6);
    ctx.fill();
  }
}, { colors: ['#22d3ee', '#38bdf8'] });

export const TidalPulse = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let ring = 0; ring < 4; ring++) {
    const p = ring / 4;
    const r = w * (0.12 + p * 0.34) * (1 + 0.06 * Math.sin(t * 2 - ring));
    ctx.strokeStyle = mixColors(c1, c2, p);
    ctx.lineWidth = w * 0.02; ctx.globalAlpha = 0.3 + (1 - p) * 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, t * (ring % 2 ? -0.5 : 0.5), t * (ring % 2 ? -0.5 : 0.5) + Math.PI * 1.5);
    ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.05 * (1 + 0.2 * Math.sin(t * 3)), 0, Math.PI * 2); ctx.fill();
}, { colors: ['#0ea5e9', '#6366f1'] });
