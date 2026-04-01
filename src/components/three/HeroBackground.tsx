"use client";

import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Points as ThreePoints } from "three";
import { useFrame } from "@react-three/fiber";

function FloatingPoints() {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const count = 1200;
    const array = new Float32Array(count * 3);
    const pseudo = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < count * 3; i += 3) {
      const idx = i / 3;
      const r = 1.6 + pseudo(idx + 1) * 1.4;
      const angle = pseudo(idx + 2) * Math.PI * 2;
      const y = (pseudo(idx + 3) - 0.5) * 1.6;
      array[i] = Math.cos(angle) * r;
      array[i + 1] = y;
      array[i + 2] = Math.sin(angle) * r;
    }
    return array;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.04;
    ref.current.rotation.x = Math.sin(t * 0.25) * 0.08;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#f5f5f5"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 3]} intensity={0.9} />
        <FloatingPoints />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

