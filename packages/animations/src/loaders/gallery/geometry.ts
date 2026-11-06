import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

const poly = (cx: number, cy: number, r: number, n: number, rot: number) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
};

export const MorphPolygon = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.36;
  ctx.clearRect(0, 0, w, w);
  const ph = (t * 0.35) % 1;
  const n1 = 3 + Math.floor(ph * 4), n2 = n1 + 1;
  const f = (ph * 4) % 1;
  const p1 = poly(cx, cy, R, n1, t * 0.3), p2 = poly(cx, cy, R, n2, t * 0.3);
  ctx.beginPath();
  for (let i = 0; i < n2; i++) {
    const a = p1[i % n1], b = p2[i];
    const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = mixColors(c1, c2, ph); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = withAlpha(mixColors(c1, c2, ph), 0.15); ctx.fill();
}, { colors: ['#22d3ee', '#ec4899'] });

export const SpiroRose = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  ctx.beginPath();
  for (let i = 0; i <= 500; i++) {
    const th = (i / 500) * Math.PI * 4 + t * 0.5;
    const r = w * 0.38 * Math.cos(3 * th + t);
    const x = cx + Math.cos(th) * r, y = cy + Math.sin(th) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  const g = ctx.createLinearGradient(0, 0, w, w);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.strokeStyle = g; ctx.lineWidth = 1.8; ctx.stroke();
}, { colors: ['#f472b6', '#a78bfa'] });

export const KaleidoSpin = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let s = 0; s < 8; s++) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(s * Math.PI / 4 + t * 0.4);
    ctx.strokeStyle = mixColors(c1, c2, s / 8); ctx.lineWidth = 1.8; ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.moveTo(0, -w * 0.06);
    ctx.quadraticCurveTo(w * 0.1, -w * 0.2, 0, -w * 0.4);
    ctx.quadraticCurveTo(w * 0.04 * Math.sin(t * 3 + s), -w * 0.22, 0, -w * 0.06);
    ctx.stroke(); ctx.restore();
  }
  ctx.globalAlpha = 1;
}, { colors: ['#f59e0b', '#ec4899'] });

export const CubeWire = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, s = w * 0.2;
  ctx.clearRect(0, 0, w, w);
  const v = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z] as const)));
  const rot = (p: readonly number[]) => {
    const [x, y, z] = p;
    const cy_ = Math.cos(t), sy_ = Math.sin(t), cx_ = Math.cos(t * 0.7), sx_ = Math.sin(t * 0.7);
    const x1 = x * cy_ - z * sy_, z1 = x * sy_ + z * cy_;
    const y1 = y * cx_ - z1 * sx_, z2 = y * sx_ + z1 * cx_;
    const k = 2.6 / (2.6 - z2);
    return [cx + x1 * s * k, cy + y1 * s * k] as [number, number];
  };
  const P = v.map(rot);
  const edges = v.flatMap((a, i) => v.map((b, j) => (j > i && a.filter((v2, k) => v2 !== b[k]).length === 1 ? [i, j] : null)).filter(Boolean));
  edges.forEach((e) => {
    const [i, j] = e as [number, number];
    const d = (P[i][0] - cx) * (P[j][0] - cx);
    ctx.strokeStyle = mixColors(c1, c2, Math.abs(d) / (w * w) * 8);
    ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(P[i][0], P[i][1]); ctx.lineTo(P[j][0], P[j][1]); ctx.stroke();
  });
  P.forEach(([x, y]) => { ctx.fillStyle = c1; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill(); });
}, { colors: ['#22d3ee', '#a78bfa'] });

export const PyraStack = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 4; i > 0; i--) {
    const y = w * 0.85 - i * w * 0.14, s = i * w * 0.09;
    const lift = Math.max(0, Math.sin(t * 2 - i * 0.6)) * w * 0.05;
    ctx.fillStyle = withAlpha(mixColors(c1, c2, i / 4), 0.85);
    ctx.beginPath();
    ctx.moveTo(cx, y - s - lift); ctx.lineTo(cx + s, y - lift); ctx.lineTo(cx - s, y - lift);
    ctx.closePath(); ctx.fill();
  }
}, { colors: ['#facc15', '#f97316'] });

export const HexMosaic = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const s = w * 0.09;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const x = w * 0.1 + col * s * 1.75 + (row % 2 ? s * 0.87 : 0);
      const y = w * 0.1 + row * s * 1.5;
      const ph = Math.hypot(col - 2.5, row - 2.5);
      const on = 0.5 + 0.5 * Math.sin(t * 2.5 - ph * 1.1);
      ctx.fillStyle = withAlpha(mixColors(c1, c2, on), 0.15 + on * 0.7);
      const pts = poly(x, y, s * 0.9, 6, Math.PI / 6);
      ctx.beginPath(); pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
      ctx.fill();
    }
  }
}, { colors: ['#34d399', '#22d3ee'] });

export const RingSegments = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let ring = 0; ring < 4; ring++) {
    const r = w * (0.1 + ring * 0.09), segs = 4 + ring * 2;
    for (let i = 0; i < segs; i++) {
      const a0 = t * (ring % 2 ? -0.8 : 0.8) + (i / segs) * Math.PI * 2 + ring;
      ctx.strokeStyle = mixColors(c1, c2, ring / 3);
      ctx.lineWidth = w * 0.028; ctx.lineCap = 'round';
      ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + i + ring));
      ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + Math.PI * 2 / segs - 0.25); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}, { colors: ['#818cf8', '#ec4899'] });

export const Triangulate = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + t * 0.4;
    const r = w * 0.36 * (0.7 + 0.3 * Math.sin(t * 1.8 + i * 2));
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    ctx.strokeStyle = withAlpha(c2, 0.4); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
    const s = w * 0.05;
    ctx.fillStyle = withAlpha(mixColors(c1, c2, i / n), 0.8);
    ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.87, y + s * 0.5); ctx.lineTo(x - s * 0.87, y + s * 0.5);
    ctx.closePath(); ctx.fill();
  }
}, { colors: ['#f472b6', '#facc15'] });

export const PixelMorph = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const n = 8, s = w * 0.8 / n, pad = w * 0.1;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const d = Math.hypot(x - (n - 1) / 2, y - (n - 1) / 2) / (n / 2);
      const on = 0.5 + 0.5 * Math.sin(t * 2.4 - d * 4);
      const px = pad + x * s, py = pad + y * s;
      ctx.fillStyle = withAlpha(mixColors(c1, c2, d), on);
      const sz = s * 0.75 * (0.4 + on * 0.6);
      ctx.fillRect(px + (s - sz) / 2, py + (s - sz) / 2, sz, sz);
    }
  }
}, { colors: ['#22d3ee', '#a78bfa'] });

export const OrigamiFold = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const ph = (Math.sin(t * 1.6) + 1) / 2;
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + Math.PI / 4;
    const fold = w * (0.15 + 0.2 * ph);
    const x1 = cx + Math.cos(a) * w * 0.36, y1 = cy + Math.sin(a) * w * 0.36;
    const x2 = cx + Math.cos(a) * fold, y2 = cy + Math.sin(a) * fold;
    const nx = cx + Math.cos(a + Math.PI / 2) * fold * 0.7, ny = cy + Math.sin(a + Math.PI / 2) * fold * 0.7;
    ctx.fillStyle = withAlpha(mixColors(c1, c2, i / 4), 0.85);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(nx, ny); ctx.lineTo(x2, y2);
    ctx.lineTo(cx, cy); ctx.closePath(); ctx.fill();
  }
}, { colors: ['#ec4899', '#facc15'] });

export const CrystalGrow = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w * 0.75;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.35;
    const len = w * (0.18 + Math.abs(Math.sin(i * 3.7)) * 0.35) * (0.75 + 0.25 * Math.sin(t * 1.4 - i));
    const wid = w * 0.045;
    const tipX = cx + Math.cos(a) * len, tipY = cy + Math.sin(a) * len;
    const pxv = Math.cos(a + Math.PI / 2) * wid, pyv = Math.sin(a + Math.PI / 2) * wid;
    ctx.fillStyle = withAlpha(mixColors(c1, c2, i / 7), 0.8);
    ctx.beginPath();
    ctx.moveTo(cx - pxv, cy - pyv); ctx.lineTo(tipX - pxv * 0.3, tipY - pyv * 0.3);
    ctx.lineTo(tipX, tipY); ctx.lineTo(tipX + pxv * 0.3, tipY + pyv * 0.3);
    ctx.lineTo(cx + pxv, cy + pyv); ctx.closePath(); ctx.fill();
  }
}, { colors: ['#67e8f9', '#818cf8'] });

export const DodecaOrbit = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let ring = 0; ring < 3; ring++) {
    const pts = poly(cx, cy, w * (0.12 + ring * 0.12), 5 + ring, t * (ring % 2 ? -0.7 : 0.7) + ring);
    ctx.strokeStyle = mixColors(c1, c2, ring / 2); ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.4 + ring * 0.25;
    ctx.beginPath(); pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.04, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#a78bfa', '#22d3ee'] });
