import { useMemo } from "react";
import * as THREE from "three";

export default function Particles({ count = 1800 }) {
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      array[i] = (Math.random() - 0.5) * 18;
    }

    return array;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#00f5d4"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}