"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface ChipSceneProps {
  progress: number; // 0 (closed) to 1 (fully exploded)
}

function ExplodedLayers({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Soft continuous rotation overlaid on scroll progress
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Base rotation driven by scroll + gentle idle float
    groupRef.current.rotation.y = 0.6 + progress * 1.8 + Math.sin(t * 0.5) * 0.05;
    groupRef.current.rotation.x = 0.35 + progress * 0.2 + Math.cos(t * 0.4) * 0.04;
  });

  const explodeDist = progress * 1.5;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* LAYER 5 (TOP): Diamond Heat Spreader */}
      <group position={[0, explodeDist * 1.4, 0]}>
        <RoundedBox args={[2.4, 0.08, 2.4]} radius={0.04} smoothness={4}>
          <meshStandardMaterial
            color="#14171F"
            metalness={0.92}
            roughness={0.18}
          />
        </RoundedBox>
        {/* Laser etched die logo on top */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* LAYER 4: Photonic Waveguide Interconnect */}
      <group position={[0, explodeDist * 0.7, 0]}>
        <RoundedBox args={[2.2, 0.05, 2.2]} radius={0.03} smoothness={4}>
          <meshStandardMaterial
            color="#0E121A"
            metalness={0.8}
            roughness={0.25}
            transparent
            opacity={0.9}
          />
        </RoundedBox>
        {/* Photonic light waveguide ring */}
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.65, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>

      {/* LAYER 3 (MIDDLE): Ultra-Low Leakage SRAM Mesh */}
      <group position={[0, 0, 0]}>
        <RoundedBox args={[2.1, 0.06, 2.1]} radius={0.03} smoothness={4}>
          <meshStandardMaterial
            color="#080A0E"
            metalness={0.95}
            roughness={0.12}
          />
        </RoundedBox>
        {/* Memory Grid Array */}
        {[-0.6, 0, 0.6].map((x, xi) =>
          [-0.6, 0, 0.6].map((z, zi) => (
            <mesh key={`${xi}-${zi}`} position={[x, 0.04, z]}>
              <boxGeometry args={[0.35, 0.02, 0.35]} />
              <meshStandardMaterial
                color="#E2E8F0"
                metalness={0.9}
                roughness={0.3}
              />
            </mesh>
          ))
        )}
      </group>

      {/* LAYER 2: Neuromorphic Spiking HGI Core Matrix */}
      <group position={[0, -explodeDist * 0.7, 0]}>
        <RoundedBox args={[2.2, 0.08, 2.2]} radius={0.03} smoothness={4}>
          <meshStandardMaterial
            color="#121620"
            metalness={0.85}
            roughness={0.2}
          />
        </RoundedBox>
        {/* Center Neural Compute Core */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.04, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* LAYER 1 (BOTTOM): Silicon Interposer & Micro-BGA Bumps */}
      <group position={[0, -explodeDist * 1.4, 0]}>
        <RoundedBox args={[2.6, 0.1, 2.6]} radius={0.06} smoothness={4}>
          <meshStandardMaterial
            color="#0C0F14"
            metalness={0.8}
            roughness={0.35}
          />
        </RoundedBox>
        {/* Micro-bump arrays on underside */}
        {[-0.9, -0.45, 0, 0.45, 0.9].map((bx, bxi) =>
          [-0.9, -0.45, 0, 0.45, 0.9].map((bz, bzi) => (
            <mesh key={`b-${bxi}-${bzi}`} position={[bx, -0.06, bz]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial
                color="#F59E0B"
                metalness={1.0}
                roughness={0.1}
              />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}

export default function ChipExploded3D({ progress }: ChipSceneProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0.5, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />
        {/* Crisp directional light with specular highlight */}
        <directionalLight position={[5, 6, 4]} intensity={2.4} color="#FFFFFF" />
        <directionalLight position={[-4, -3, -2]} intensity={0.8} color="#7DD3FC" />
        {/* Warm amber light for silicon traces */}
        <pointLight position={[2, 2, 3]} intensity={2.0} color="#F59E0B" />
        <ExplodedLayers progress={progress} />
      </Canvas>
    </div>
  );
}
