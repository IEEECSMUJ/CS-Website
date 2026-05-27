"use client";

import React, { useRef, useEffect, useState, Suspense, useLayoutEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const sharedMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#F5A623"),
  roughness: 0.35,
  metalness: 0.4,
});

function Model({ url, scale = 0.35, position = [0, 0, 0] }: { url: string; scale?: number; position?: [number, number, number] }) {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef<THREE.Group>(null);
  
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).material = sharedMaterial;
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Continuous spin around its vertical axis
      modelRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive 
        ref={modelRef}
        object={scene} 
        scale={scale} 
        position={position} 
        rotation={[Math.PI / 2, 0, Math.PI / 2]} 
      />
    </Float>
  );
}

useGLTF.preload("/logos/ieee.glb");

export default function HeroImageSequence({ scrollContainerRef }: { scrollContainerRef?: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  // Cache dimensions in a ref to avoid reading window.innerWidth/innerHeight on every scroll frame
  // (reading those properties forces a layout/reflow)
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      dimensionsRef.current = { width: w, height: h, dpr };
      setWindowSize({ width: w, height: h });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const totalFrames = 36;

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(4, '0');
        img.src = `/Heroimg/${frameIndex}.avif`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalFrames) {
                setImages(loadedImages);
            }
        };
        loadedImages[i - 1] = img;
    }
  }, []);

  // Track last rendered frame to skip redundant draws
  const lastFrameRef = useRef(-1);

  const renderFrame = useCallback((index: number) => {
    // Skip if we already rendered this exact frame
    if (index === lastFrameRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !images[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    lastFrameRef.current = index;
    const img = images[index];
    
    // Use cached dimensions instead of reading window.innerWidth (avoids layout thrashing)
    const { width, height, dpr } = dimensionsRef.current;
    
    // Set size in memory only if it has changed, preventing layout thrashing on scroll
    const targetWidth = width * dpr;
    const targetHeight = height * dpr;
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        // Canvas is wider than image (relatively)
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        // Canvas is taller than image (relatively)
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  useGSAP(() => {
    if (!scrollContainerRef?.current || !sequenceRef.current || !modelRef.current) return;

    // Initial setup
    gsap.set(sequenceRef.current, { opacity: 1, display: "flex" });
    gsap.set(modelRef.current, { opacity: 0, display: "none" });

    const tl = gsap.timeline({
      scrollTrigger: {
        id: "hero-sequence-trigger",
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const latest = self.progress;
          if (images.length === totalFrames && latest < 0.98) {
            const frameIndex = Math.min(
              totalFrames - 1,
              Math.floor(latest * totalFrames)
            );
            renderFrame(frameIndex);
          }
        }
      }
    });

    // Sequence Opacity/Display
    tl.to(sequenceRef.current, {
      opacity: 1,
      duration: 0.94,
      ease: "none",
    }, 0);

    tl.to(sequenceRef.current, {
      opacity: 0,
      duration: 0.04,
      ease: "none",
    }, 0.94);

    tl.set(sequenceRef.current, { display: "none" }, 0.98);

    // Model Opacity/Display
    tl.set(modelRef.current, { display: "block" }, 0.1);
    tl.to(modelRef.current, {
      opacity: 1,
      duration: 0.04,
      ease: "none",
    }, 0.94);

    // Ensure the initial render frame is called once the timeline/scrolltrigger is built
    const trigger = ScrollTrigger.getById("hero-sequence-trigger");
    if (trigger && images.length === totalFrames) {
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(trigger.progress * totalFrames)
      );
      renderFrame(frameIndex);
    }

  }, { dependencies: [scrollContainerRef, images], scope: sequenceRef });

  useEffect(() => {
    if (images.length === totalFrames && windowSize.width > 0) {
        // Reset lastFrameRef to force a redraw after resize
        lastFrameRef.current = -1;
        const trigger = ScrollTrigger.getById("hero-sequence-trigger");
        const currentProgress = trigger ? trigger.progress : 0;
        const currentFrame = Math.min(
            totalFrames - 1,
            Math.floor(currentProgress * totalFrames)
        );
        renderFrame(currentFrame);
    }
  }, [images, windowSize, renderFrame]);

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-transparent">
      {/* 2D Image Sequence Canvas */}
      <div 
        ref={sequenceRef}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </div>

      {/* 3D Model Canvas */}
      <div 
        ref={modelRef}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent", pointerEvents: "none" }}
        >
          <ambientLight intensity={1} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Suspense fallback={null}>
            <Model 
              url="/logos/ieee.glb" 
              scale={windowSize.width < 768 ? 0.22 : 0.35} 
              position={windowSize.width < 768 ? [0, 0, 0] : [0, 0, 0]} 
            />
            <Environment files="/potsdamer_platz_1k.hdr" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
