import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const DIGITS = ['4', '0', '4'];
const COLORS = ['#6366f1', '#ec4899', '#f59e0b'];

/** 404 clip — digits bounce in with springs, then bob in place. */
export function NotFoundClip() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const captionOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: 'white',
      }}
    >
      <div style={{ display: 'flex', gap: 24 }}>
        {DIGITS.map((d, i) => {
          const enter = spring({
            frame: frame - i * 8,
            fps,
            config: { damping: 11, stiffness: 160 },
          });
          const bob = Math.sin((frame - i * 8) / 14) * 14;
          return (
            <span
              key={i}
              style={{
                fontSize: 380,
                fontWeight: 800,
                lineHeight: 1,
                color: COLORS[i],
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [200, 0]) + bob * enter}px) scale(${enter})`,
                display: 'inline-block',
              }}
            >
              {d}
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 32, fontSize: 42, opacity: captionOpacity, color: '#94a3b8' }}>
        page not found
      </div>
    </AbsoluteFill>
  );
}
