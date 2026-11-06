import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Points } from 'three';
import type { CSSProperties } from 'react';
import { useMotionPrefs } from '../runtime/useMotionPrefs';
import { mulberry32 } from '../utils/seed';

export interface ParticleFieldProps {
  /** Number of particles. */
  count?: number;
  /** Radius of the sphere the particles fill. */
  radius?: number;
  /** Particle color. Defaults to theme accent when themed. */
  color?: string;
  /** Point size in px. */
  size?: number;
  /** Rotation speed (radians per second-ish scale). */
  speed?: number;
  /** Camera distance — increase for a sparser look. */
  cameraZ?: number;
  /** Seed for reproducible distribution. */
  seed?: number;
  className?: string;
  style?: CSSProperties;
}

interface ParticlesProps {
  count: number;
  radius: number;
  color: string;
  size: number;
  speed: number;
  seed: number;
  still: boolean;
}

function Particles({ count, radius, color, size, speed, seed, still }: ParticlesProps) {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const rand = mulberry32(seed);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // uniform-ish distribution in a sphere
      const r = radius * Math.cbrt(rand());
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius, seed]);

  useFrame((_, delta) => {
    if (!ref.current || still) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

/**
 * Rotating 3D particle sphere — hero/background element.
 * Import from `@codetikki/animations/three` (needs three + @react-three/fiber).
 */
export function ParticleField({
  count = 1200,
  radius = 4,
  color,
  size = 0.03,
  speed = 0.05,
  cameraZ = 7,
  seed = 1,
  className,
  style,
}: ParticleFieldProps) {
  const m = useMotionPrefs();
  const accent = color ?? (m.themed ? m.tokens.colors.accent : '#818cf8');
  const n = m.tier === 'lite' ? Math.max(200, Math.floor(count / 2)) : count;
  const still = m.reduce || m.tier === 'static';

  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 60 }} dpr={[1, 2]} frameloop={still ? 'demand' : 'always'}>
        <Particles count={n} radius={radius} color={accent} size={size} speed={speed * m.durationScale} seed={seed} still={still} />
      </Canvas>
    </div>
  );
}
