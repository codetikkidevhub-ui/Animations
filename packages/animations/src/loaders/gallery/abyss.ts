import { createLoader } from './createLoader';
import { mixColors, withAlpha } from '../../utils/color';

// Live Lorenz strange attractor — the butterfly shape tracing itself forever
export const ChaosAttractor = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const cx = w / 2, cy = w / 2;
  let x = 0.12 + Math.sin(t * 0.21) * 0.08, y = 0, z = 0;
  const sig = 10, rho = 28, beta = 8 / 3, dt = 0.0075;
  const rot = t * 0.35;
  const pts: [number, number, number][] = [];
  for (let i = 0; i < 1600; i++) {
    x += sig * (y - x) * dt;
    y += (x * (rho - z) - y) * dt;
    z += (x * y - beta * z) * dt;
    const rx = x * Math.cos(rot) - (z - 26) * Math.sin(rot) * 0.6;
    const py = cy - (z - 26) * w * 0.0105;
    pts.push([cx + rx * w * 0.011, py, i / 1600]);
  }
  // trail with color + alpha gradient from tail to head
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i][2];
    ctx.strokeStyle = mixColors(c1, c2, p);
    ctx.globalAlpha = 0.12 + p * 0.85;
    ctx.lineWidth = 0.8 + p * 2.2;
    ctx.beginPath();
    ctx.moveTo(pts[i - 1][0], pts[i - 1][1]);
    ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }
  // glowing head
  const [hx, hy] = pts[pts.length - 1];
  const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, w * 0.05);
  g.addColorStop(0, '#fff'); g.addColorStop(0.3, c1); g.addColorStop(1, 'transparent');
  ctx.globalAlpha = 1; ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(hx, hy, w * 0.05, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#22d3ee', '#ec4899'] });

// Procedural human eye — blinks, dilates, stares. Deeply unsettling.
export const VoidEye = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.34;
  ctx.clearRect(0, 0, w, w);
  // sclera with vignette
  const sg = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.15);
  sg.addColorStop(0, '#f8fafc'); sg.addColorStop(0.8, '#cbd5e1'); sg.addColorStop(1, '#64748b');
  ctx.fillStyle = sg;
  ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.15, R * 0.72, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.15, R * 0.72, 0, 0, Math.PI * 2); ctx.clip();
  // iris — slow tracking drift
  const lookX = Math.sin(t * 0.7) * w * 0.05, lookY = Math.cos(t * 0.5) * w * 0.03;
  const ix = cx + lookX, iy = cy + lookY, ir = R * 0.52;
  // iris fibers
  for (let i = 0; i < 140; i++) {
    const a = (i / 140) * Math.PI * 2 + rand() * 0.04;
    const len = ir * (0.55 + rand() * 0.45);
    ctx.strokeStyle = withAlpha(mixColors(c1, c2, rand()), 0.55 + rand() * 0.4);
    ctx.lineWidth = 1 + rand() * 1.2;
    ctx.beginPath();
    ctx.moveTo(ix + Math.cos(a) * ir * 0.28, iy + Math.sin(a) * ir * 0.28);
    ctx.lineTo(ix + Math.cos(a + rand() * 0.1) * len, iy + Math.sin(a + rand() * 0.1) * len);
    ctx.stroke();
  }
  // limbal ring
  ctx.strokeStyle = 'rgba(15,23,42,0.85)'; ctx.lineWidth = w * 0.02;
  ctx.beginPath(); ctx.arc(ix, iy, ir, 0, Math.PI * 2); ctx.stroke();
  // pupil — dilates
  const pupil = ir * (0.32 + 0.16 * Math.sin(t * 0.9) + 0.05 * Math.sin(t * 3.7));
  ctx.fillStyle = '#020617';
  ctx.beginPath(); ctx.arc(ix, iy, pupil, 0, Math.PI * 2); ctx.fill();
  // specular highlights
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.ellipse(ix - ir * 0.3, iy - ir * 0.35, ir * 0.14, ir * 0.09, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath(); ctx.arc(ix + ir * 0.25, iy + ir * 0.3, ir * 0.07, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // veins in sclera corners
  ctx.strokeStyle = 'rgba(220,38,38,0.4)'; ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const side = i % 2 ? 1 : -1, y0 = cy + (rand() - 0.5) * R;
    ctx.beginPath(); ctx.moveTo(cx + side * R * 1.1, y0);
    ctx.bezierCurveTo(cx + side * R * 0.85, y0 + rand() * 12, cx + side * R * 0.7, y0 - rand() * 10, cx + side * R * 0.6, y0);
    ctx.stroke();
  }
  // eyelid blink — periodic
  const blinkPh = (t * 0.45) % 1;
  const lid = blinkPh > 0.94 ? Math.sin((blinkPh - 0.94) / 0.06 * Math.PI) : 0;
  if (lid > 0.01) {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(cx - R * 1.3, cy - R);
    ctx.quadraticCurveTo(cx, cy + R * (lid * 2 - 0.3), cx + R * 1.3, cy - R);
    ctx.lineTo(cx + R * 1.3, cy - R * 1.4); ctx.lineTo(cx - R * 1.3, cy - R * 1.4);
    ctx.closePath(); ctx.fill();
  }
  // outline
  ctx.strokeStyle = '#0f172a'; ctx.lineWidth = w * 0.015;
  ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.15, R * 0.72, 0, 0, Math.PI * 2); ctx.stroke();
}, { colors: ['#92400e', '#1e293b'] });

// Real-time Julia set — fractal burning and morphing forever
export const FractalMelt = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const N = 56, cell = w / N;
  const ca = -0.7 + Math.cos(t * 0.4) * 0.25;
  const cb = 0.27 + Math.sin(t * 0.4) * 0.18;
  for (let gy = 0; gy < N; gy++) {
    for (let gx = 0; gx < N; gx++) {
      let zx = (gx - N / 2) / (N / 3.2), zy = (gy - N / 2) / (N / 3.2);
      let iter = 0;
      while (zx * zx + zy * zy < 4 && iter < 22) {
        const xt = zx * zx - zy * zy + ca;
        zy = 2 * zx * zy + cb; zx = xt; iter++;
      }
      if (iter > 3) {
        const p = iter / 22;
        ctx.fillStyle = mixColors(c1, c2, p);
        ctx.globalAlpha = 0.3 + p * 0.7;
        ctx.fillRect(gx * cell, gy * cell, cell + 0.5, cell + 0.5);
      }
    }
  }
  ctx.globalAlpha = 1;
}, { colors: ['#facc15', '#7c3aed'] });

// Recursive branching lightning inside a sphere
export const NeuralStorm = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2, R = w * 0.36;
  ctx.clearRect(0, 0, w, w);
  const bolt = (x: number, y: number, a: number, len: number, depth: number) => {
    if (depth > 5 || len < 3) return;
    let px = x, py = y;
    ctx.beginPath(); ctx.moveTo(px, py);
    const segs = 3 + depth;
    for (let i = 0; i < segs; i++) {
      const na = a + (Math.random() - 0.5) * 1.1;
      px += Math.cos(na) * (len / segs);
      py += Math.sin(na) * (len / segs);
      ctx.lineTo(px, py);
      if (Math.random() < 0.3 && depth < 3) bolt(px, py, na + (Math.random() - 0.5) * 1.6, len * 0.45, depth + 1);
    }
    ctx.strokeStyle = depth === 0 ? '#fff' : mixColors(c1, c2, depth / 5);
    ctx.lineWidth = 2.4 - depth * 0.45;
    ctx.stroke();
  };
  // clip to sphere
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
  const seedShift = Math.floor(t * 1.4); // re-branch ~every 0.7s
  ctx.strokeStyle = c1; ctx.shadowColor = c1; ctx.shadowBlur = 8;
  const srand = (n: number) => Math.abs(Math.sin(seedShift * 127.1 + n * 311.7) * 43758.5) % 1;
  for (let b = 0; b < 4; b++) {
    const a0 = srand(b) * Math.PI * 2;
    bolt(cx + Math.cos(a0) * R * 0.1, cy + Math.sin(a0) * R * 0.1, a0, R * (0.7 + srand(b + 9) * 0.6), 0);
  }
  ctx.shadowBlur = 0; ctx.restore();
  // core + rim
  ctx.strokeStyle = withAlpha(c2, 0.8); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.shadowColor = c1; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.03 * (1 + 0.3 * Math.sin(t * 9)), 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
}, { colors: ['#a78bfa', '#22d3ee'] });

// Real metaballs — iso-surface merging goo with specular pop
export const MetaballGoo = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const balls: [number, number, number][] = [];
  for (let i = 0; i < 5; i++) {
    balls.push([
      w / 2 + Math.sin(t * (0.6 + i * 0.23) + i * 2.1) * w * 0.26,
      w / 2 + Math.cos(t * (0.5 + i * 0.19) + i * 1.3) * w * 0.24,
      w * (0.055 + 0.03 * Math.sin(t + i * 3)),
    ]);
  }
  const N = 60, cell = w / N;
  for (let gy = 0; gy < N; gy++) {
    for (let gx = 0; gx < N; gx++) {
      const x = gx * cell, y = gy * cell;
      let f = 0;
      for (const [bx, by, br] of balls) {
        const d2 = (x - bx) ** 2 + (y - by) ** 2;
        f += (br * br) / Math.max(d2, 1);
      }
      if (f > 1) {
        const p = Math.min(1, (f - 1) * 1.4);
        ctx.fillStyle = mixColors(c1, c2, p);
        ctx.globalAlpha = 0.75 + p * 0.25;
        ctx.fillRect(x, y, cell + 0.6, cell + 0.6);
        // specular hint near ball centers
        if (f > 2.6) {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillRect(x + cell * 0.3, y + cell * 0.3, cell * 0.4, cell * 0.4);
        }
      }
    }
  }
  ctx.globalAlpha = 1;
}, { colors: ['#34d399', '#22d3ee'] });

// Infinite descending tunnel + chromatic split + glitch bursts
export const WarpTunnel = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const glitch = Math.sin(t * 7.3) > 0.93 ? Math.random() * w * 0.02 : 0;
  const rings = 14;
  for (let pass = 0; pass < 3; pass++) {
    const off = pass === 1 ? -glitch : pass === 2 ? glitch : 0;
    for (let i = rings; i > 0; i--) {
      const z = ((i / rings + t * 0.35) % 1);
      const r = w * 0.5 * (1 - z) + w * 0.03;
      const a = t * 0.8 + i * 0.5;
      ctx.strokeStyle = pass === 0 ? mixColors(c1, c2, z) : pass === 1 ? 'rgba(255,0,80,0.5)' : 'rgba(0,255,200,0.5)';
      ctx.lineWidth = 2.5 - z * 1.8;
      ctx.globalAlpha = pass === 0 ? 0.25 + (1 - z) * 0.7 : 0.35;
      const sides = 6;
      ctx.beginPath();
      for (let s = 0; s <= sides; s++) {
        const sa = a + (s / sides) * Math.PI * 2;
        const wob = 1 + Math.sin(s * 3 + i + t * 2) * 0.08;
        const x = cx + off + Math.cos(sa) * r * wob;
        const y = cy + Math.sin(sa) * r * wob;
        s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.1);
  g.addColorStop(0, '#fff'); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.1, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#ec4899', '#22d3ee'] });

// Penrose impossible triangle — rotating in mind-breaking layers
export const ImpossibleTri = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const R = w * 0.34, bw = w * 0.09;
  const v = [0, 1, 2].map((i) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 3 + t * 0.3;
    return [cx + Math.cos(a) * R, cy + Math.sin(a) * R] as [number, number];
  });
  for (let i = 0; i < 3; i++) {
    const [x1, y1] = v[i], [x2, y2] = v[(i + 1) % 3];
    const a = Math.atan2(y2 - y1, x2 - x1);
    const nx = Math.cos(a + Math.PI / 2) * bw, ny = Math.sin(a + Math.PI / 2) * bw;
    const col = i === 0 ? c1 : i === 1 ? c2 : mixColors(c1, c2, 0.5);
    // outer face
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.lineTo(x2 + nx, y2 + ny); ctx.lineTo(x1 + nx, y1 + ny);
    ctx.closePath(); ctx.fill();
    // inner face — darker, creates impossible depth
    ctx.fillStyle = mixColors(col, '#000', 0.45);
    ctx.beginPath();
    ctx.moveTo(x1 + nx, y1 + ny); ctx.lineTo(x2 + nx, y2 + ny);
    ctx.lineTo(x2 + nx * 0.5, y2 + ny * 0.5); ctx.lineTo(x1 + nx * 0.5, y1 + ny * 0.5);
    ctx.closePath(); ctx.fill();
    // cap highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
}, { colors: ['#a78bfa', '#22d3ee'] });

// Writhing tentacle mass — pure organic horror
export const TendrilMass = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  for (let i = 0; i < 9; i++) {
    const a0 = (i / 9) * Math.PI * 2 + Math.sin(t * 0.4 + i) * 0.4;
    ctx.beginPath();
    let px = cx, py = cy;
    ctx.moveTo(px, py);
    const segs = 14;
    for (let s = 1; s <= segs; s++) {
      const p = s / segs;
      const wig = Math.sin(t * 2.4 + i * 1.7 + p * 4) * w * 0.06 * p;
      const r = w * 0.42 * p;
      px = cx + Math.cos(a0) * r - Math.sin(a0) * wig;
      py = cy + Math.sin(a0) * r + Math.cos(a0) * wig;
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = mixColors(c1, c2, i / 9);
    ctx.lineWidth = w * 0.035;
    ctx.lineCap = 'round';
    ctx.stroke();
    // taper tip
    ctx.fillStyle = c1;
    ctx.beginPath(); ctx.arc(px, py, w * 0.018, 0, Math.PI * 2); ctx.fill();
  }
  // pulsing core mass
  const beat = 0.85 + 0.15 * Math.sin(t * 3.2);
  ctx.fillStyle = mixColors(c2, '#000', 0.2);
  ctx.beginPath(); ctx.arc(cx, cy, w * 0.11 * beat, 0, Math.PI * 2); ctx.fill();
}, { colors: ['#a21caf', '#f472b6'] });

// Screen corruption sweep — scan tears, displacement, rgb split
export const CorruptionWave = createLoader(({ ctx, t, w, rand }, { c1, c2 }) => {
  ctx.clearRect(0, 0, w, w);
  const cy = w / 2;
  // base ring that gets corrupted
  ctx.strokeStyle = c1; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(w / 2, cy, w * 0.3, t, t + Math.PI * 1.9); ctx.stroke();
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(w / 2, cy, w * 0.05, 0, Math.PI * 2); ctx.fill();
  // corruption bands sweeping down
  const sweep = (t * 0.5) % 1.4;
  for (let i = 0; i < 5; i++) {
    const bandY = ((sweep + i * 0.14) % 1.4) * w;
    const h = 2 + rand() * 6;
    const shift = (rand() - 0.5) * w * 0.15;
    ctx.fillStyle = withAlpha(mixColors(c1, c2, rand()), 0.6);
    ctx.fillRect(shift, bandY, w, h);
    // rgb split ghosts of the ring in band
    ctx.strokeStyle = 'rgba(255,0,80,0.4)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(w / 2 - 3, cy + bandY * 0.02, w * 0.3, t, t + 1.2); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,255,200,0.4)';
    ctx.beginPath(); ctx.arc(w / 2 + 3, cy - bandY * 0.02, w * 0.3, t + 2, t + 3.1); ctx.stroke();
  }
  // noise specks
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = withAlpha(c2, rand() * 0.8);
    ctx.fillRect(rand() * w, rand() * w, 2, 2);
  }
}, { colors: ['#22d3ee', '#ec4899'] });

// Dimensional rift tearing open and snapping shut
export const RiftPortal = createLoader(({ ctx, t, w }, { c1, c2 }) => {
  const cx = w / 2, cy = w / 2;
  ctx.clearRect(0, 0, w, w);
  const open = 0.5 + 0.5 * Math.sin(t * 0.9);
  const jag = (y: number, side: number) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - w * 0.36);
    for (let i = 1; i <= 12; i++) {
      const p = i / 12;
      const yy = cy - w * 0.36 + p * w * 0.72;
      const wob = Math.sin(i * 2.7 + t * 5) * w * 0.02;
      const gap = w * 0.14 * open * Math.sin(p * Math.PI);
      ctx.lineTo(cx + side * (gap + wob), yy);
    }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.stroke();
  };
  jag(0, -1); jag(0, 1);
  // void inside the rift
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.2);
  g.addColorStop(0, '#fff'); g.addColorStop(0.4, c1); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy, w * 0.14 * open, w * 0.36 * open, 0, 0, Math.PI * 2);
  ctx.fill();
  // crack tendrils spreading
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.sin(t * 0.6 + i);
    const len = w * (0.16 + open * 0.18);
    ctx.strokeStyle = withAlpha(c2, 0.7); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * w * 0.1 * open, cy + Math.sin(a) * w * 0.28 * open);
    ctx.lineTo(cx + Math.cos(a) * len * 2, cy + Math.sin(a) * len * 2);
    ctx.stroke();
  }
}, { colors: ['#22d3ee', '#a78bfa'] });
