import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sphere } from "@react-three/drei";
import { useRef } from "react";
import Particles from "./Particles";

function FloatingCore() {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (!mesh.current) return;

    mesh.current.rotation.x += delta * 0.25;
    mesh.current.rotation.y += delta * 0.45;

    mesh.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
  });

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={1.5}
    >
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.7, 2]} />

        <meshStandardMaterial
          color="#00f5d4"
          wireframe
          transparent
          opacity={0.8}
          emissive="#00f5d4"
          emissiveIntensity={0.8}
        />
      </mesh>
    </Float>
  );
}

function InnerSphere() {
  return (
    <Sphere args={[0.8, 32, 32]}>
      <meshStandardMaterial
        color="#07151d"
        metalness={0.9}
        roughness={0.15}
        emissive="#003f43"
        emissiveIntensity={0.8}
      />
    </Sphere>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />

      <pointLight
        position={[3, 3, 4]}
        intensity={30}
        color="#00f5d4"
      />

      <pointLight
        position={[-4, -2, 2]}
        intensity={20}
        color="#00a8ff"
      />

      <Particles />

      <FloatingCore />

      <InnerSphere />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.7}
      />
    </>
  );
}

export default function Scene() {
  return (
    <div className="three-scene">
      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: 45,
        }}
        dpr={[1, 2]}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}