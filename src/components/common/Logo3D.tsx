"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Preload the GLTF logo asset at the module level to ensure instant rendering
useGLTF.preload("/logos/ieee.glb");

function Model() {
  const { scene } = useGLTF("/logos/ieee.glb", true);
  const ref = useRef<THREE.Group>(null);

  // Clone the cached scene to prevent sharing the same node between distinct canvas scene-graphs
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Instantiate material locally to compile specifically for this WebGL context
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#F5A623"),
    roughness: 0.35,
    metalness: 0.4,
  }), []);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.rotation.x = Math.PI / 2;

    ref.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = material;
      }
    });
  }, [clonedScene, material]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.5;
  });

  return <primitive ref={ref} object={clonedScene} scale={0.6} />;
}

export default function Logo3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 48 }}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}
