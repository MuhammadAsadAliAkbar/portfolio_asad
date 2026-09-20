import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";

function Particles() {
  const ref = useRef();

  const positions = useMemo(() => {
    const values = new Float32Array(1800 * 3);

    for (let i = 0; i < values.length; i++) {
      values[i] = (Math.random() - 0.5) * 18;
    }

    return values;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.y = state.clock.elapsedTime * 0.025;
    ref.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#19e6c1"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

function ThreeBackground() {
  return (
    <div className="three-background">
      <Canvas camera={{ position: [0, 0, 8], fov: 70 }}>
        <Particles />
      </Canvas>
    </div>
  );
}

export default ThreeBackground;