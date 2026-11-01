import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const TITLE = 'Animations for every state of your app';
const SUBTITLE = 'Loading · 404 · Text · Micro-interactions · Scroll · 3D';

/** Animated title card — word-by-word spring reveal over a drifting gradient. */
export function TitleCard() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgAngle = interpolate(frame, [0, 120], [0, 30]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + bgAngle}deg, #0a0a1a 0%, #1a1a3a 45%, #2a1140 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: 'white',
      }}
    >
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1400 }}>
        {TITLE.split(' ').map((word, i) => {
          const progress = spring({
            frame: frame - i * 5,
            fps,
            config: { damping: 14, stiffness: 120 },
          });
          return (
            <span
              key={i}
              style={{
                fontSize: 92,
                fontWeight: 800,
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 44,
          fontSize: 30,
          letterSpacing: 4,
          color: '#a5b4fc',
          opacity: interpolate(frame, [55, 75], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {SUBTITLE}
      </div>
    </AbsoluteFill>
  );
}
