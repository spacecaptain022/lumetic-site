"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import type { Group, Points as ThreePoints } from "three";
import { AdditiveBlending } from "three";
import { useReducedMotion } from "framer-motion";

function pseudo(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function DustLayer({
  count,
  size,
  opacity,
  color,
  spread,
  rotSpeed,
  drift,
}: {
  count: number;
  size: number;
  opacity: number;
  color: string;
  spread: [number, number, number];
  rotSpeed: [number, number, number];
  drift: number;
}) {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const idx = i / 3;
      arr[i] = (pseudo(idx * 1.7) - 0.5) * spread[0];
      arr[i + 1] = (pseudo(idx * 2.3 + 11) - 0.5) * spread[1];
      arr[i + 2] = (pseudo(idx * 3.1 + 23) - 0.5) * spread[2];
    }
    return arr;
  }, [count, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * rotSpeed[0] + drift;
    ref.current.rotation.x = Math.sin(t * rotSpeed[1]) * 0.12 + t * rotSpeed[2] * 0.08;
    ref.current.rotation.z = Math.cos(t * 0.07) * 0.04;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </Points>
  );
}

/** Soft, blurry mesh blob — faint atmospheric shape behind type (Lusion-style) */
function SoftBlob() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.04;
    ref.current.rotation.x = Math.sin(t * 0.15) * 0.08;
  });
  return (
    <group ref={ref}>
      <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh scale={2.8}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#0a0a0a"
            emissive="#ffffff"
            emissiveIntensity={0.08}
            roughness={0.9}
            metalness={0.2}
            distort={0.25}
            speed={1.5}
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>
    </group>
  );
}

function DustScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 6]} intensity={1.2} color="#ffffff" distance={20} />
      <SoftBlob />
      <DustLayer
        count={6000}
        size={0.009}
        opacity={0.07}
        color="#a8a8b8"
        spread={[26, 16, 24]}
        rotSpeed={[0.008, 0.035, 0.004]}
        drift={0}
      />
      <DustLayer
        count={4000}
        size={0.014}
        opacity={0.1}
        color="#c4c8d4"
        spread={[20, 12, 18]}
        rotSpeed={[-0.012, 0.045, 0.008]}
        drift={0.9}
      />
      <DustLayer
        count={2200}
        size={0.018}
        opacity={0.12}
        color="#e0e4f0"
        spread={[15, 10, 14]}
        rotSpeed={[0.015, 0.025, 0.006]}
        drift={1.8}
      />
    </>
  );
}

export default function AboutHeroBackground() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduceMotion) {
    return (
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_42%,rgba(255,255,255,0.05)_0%,#000000_65%)]"
        aria-hidden
      />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 bg-black" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.15, 7.5], fov: 46 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        className="h-full w-full"
      >
        <color attach="background" args={["transparent"]} />
        <DustScene />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_48%,transparent_0%,#000000_62%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
    </div>
  );
}
