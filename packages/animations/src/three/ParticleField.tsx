import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Points } from 'three';
import type { CSSProperties } from 'react';

export interface ParticleFieldProps {
  /** Number of particles. */
  count?: number;
  /** Radius of the sphere the particles fill. */
  radius?: number;
  color?: string;
  /** Point size in px. */
  size?: number;
  /** Rotation speed (radians per second-ish scale). */
  speed?: number;
  /** Camera distance — increase for a sparser look. */
  cameraZ?: number;
  className?: string;
  style?: CSSProperties;
}

function Particles({ count, radius, color, size, speed }: Required<Omit<ParticleFieldProps, 'cameraZ' | 'className' | 'style'>>) {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // uniform-ish distribution in a sphere
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (!ref.current) return;
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
  color = '#818cf8',
  size = 0.03,
  speed = 0.05,
  cameraZ = 7,
  className,
  style,
}: ParticleFieldProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 60 }} dpr={[1, 2]}>
        <Particles count={count} radius={radius} color={color} size={size} speed={speed} />
      </Canvas>
    </div>
  );
}
