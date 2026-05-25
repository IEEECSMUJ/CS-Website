"use client";

import React, { useRef, useEffect, useState, Suspense, useLayoutEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Preload the GLTF logo asset at the module level
useGLTF.preload("/logos/ieee.glb");

function Model({ url, scale = 0.35, position = [0, 0, 0] }: { url: string; scale?: number; position?: [number, number, number] }) {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef<THREE.Group>(null);

  // Clone the cached scene to prevent sharing the same node between distinct canvas scene-graphs
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Instantiate material locally to compile specifically for this WebGL context
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#F5A623"),
    roughness: 0.35,
    metalness: 0.4,
  }), []);

  useLayoutEffect(() => {
    clonedScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).material = material;
      }
    });
  }, [clonedScene, material]);

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
        object={clonedScene}
        scale={scale}
        position={position}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
    </Float>
  );
}

export default function HeroImageSequence({ scrollContainerRef }: { scrollContainerRef?: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const modelOuterContainerRef = useRef<HTMLDivElement>(null);
  const modelContainerRef = useRef<HTMLDivElement>(null);

  const totalFrames = 36;
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef<number>(-1);
  const playheadRef = useRef({ frame: 0 });
  const dimensionsRef = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    dpr: typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1
  });
  // Use ref instead of state for window size to avoid re-renders on resize
  const windowSizeRef = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });
  // Mount Three.js Canvas immediately to compile shaders and generate PMREM reflections early
  const show3DModel = true;

  // Aspect-ratio aware drawing to canvas
  const renderFrame = useCallback((index: number) => {
    if (index === lastFrameRef.current) return;

    // Find closest loaded image if the target frame isn't loaded yet (flicker protection)
    let img = imagesRef.current[index];
    if (!img) {
      let closestIdx = -1;
      let minDistance = Infinity;
      for (let i = 0; i < totalFrames; i++) {
        if (imagesRef.current[i]) {
          const dist = Math.abs(i - index);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = i;
          }
        }
      }
      if (closestIdx !== -1) {
        img = imagesRef.current[closestIdx];
      }
    }

    if (!img) return; // No frames loaded yet

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    lastFrameRef.current = index;

    const { width, height, dpr } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    const targetWidth = width * dpr;
    const targetHeight = height * dpr;

    // Resize backing store only if changed to avoid layout reflows on scroll ticks
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
      // Canvas is wider than image (relatively) - cover style
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // Canvas is taller than image (relatively) - cover style
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Progressive image preloading
  useEffect(() => {
    // Load frame 1 immediately for instant paint
    const img1 = new Image();
    const frameIndex1 = "1".padStart(4, '0');
    img1.src = `/Heroimg/${frameIndex1}.avif`;
    img1.onload = () => {
      imagesRef.current[0] = img1;
      if (playheadRef.current.frame === 0) {
        renderFrame(0);
      }

      // Load remaining frames progressively in batches to protect initial bandwidth
      const loadBatch = (start: number, end: number) => {
        for (let i = start; i <= end; i++) {
          const img = new Image();
          const frameIndex = i.toString().padStart(4, '0');
          img.src = `/Heroimg/${frameIndex}.avif`;
          img.onload = () => {
            imagesRef.current[i - 1] = img;
            const currentFrame = Math.round(playheadRef.current.frame);
            if (currentFrame === i - 1) {
              renderFrame(currentFrame);
            }
          };
        }
      };

      // Batch 1 (Frames 2-12): Load immediately for initial scroll readiness
      loadBatch(2, 12);

      // Batch 2 (Frames 13-24): Load on network idle or after 800ms delay
      const scheduleBatch2 = () => {
        if (typeof requestIdleCallback === "function") {
          requestIdleCallback(() => loadBatch(13, 24));
        } else {
          setTimeout(() => loadBatch(13, 24), 800);
        }
      };

      // Batch 3 (Frames 25-36): Load after 1.8s delay
      const scheduleBatch3 = () => {
        if (typeof requestIdleCallback === "function") {
          requestIdleCallback(() => loadBatch(25, totalFrames));
        } else {
          setTimeout(() => loadBatch(25, totalFrames), 1800);
        }
      };

      scheduleBatch2();
      scheduleBatch3();
    };
  }, [renderFrame]);

  // Debounced resize handler
  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const rawDpr = window.devicePixelRatio || 1;

      // Capped DPR on mobile (up to 1.25x) to save memory/prevent thermal throttling; cap at 2.0 on desktop
      const dpr = w < 768 ? Math.min(1.25, rawDpr) : Math.min(2.0, rawDpr);

      dimensionsRef.current = { width: w, height: h, dpr };
      windowSizeRef.current = { width: w, height: h };

      // Force redraw on resize
      lastFrameRef.current = -1;
      renderFrame(Math.round(playheadRef.current.frame));
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 100);
    };

    updateDimensions();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [renderFrame]);

  // GSAP scroll scrubbing and timeline coordination
  useGSAP(() => {
    if (!canvasRef.current) return;

    // Initialize playhead
    playheadRef.current.frame = 0;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-scroll-track",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      }
    });

    // Scrub image sequence frames
    tl.to(playheadRef.current, {
      frame: totalFrames - 1,
      ease: "none",
      duration: 1,
      onUpdate: () => {
        const frameIndex = Math.min(totalFrames - 1, Math.max(0, Math.round(playheadRef.current.frame)));
        renderFrame(frameIndex);
      }
    }, 0);

    // Fade out sequence canvas container (0.94 -> 0.98)
    tl.to(canvasContainerRef.current, {
      opacity: 0,
      ease: "none",
      duration: 0.04,
    }, 0.94);

    // Hide sequence canvas container completely at 0.98
    tl.set(canvasContainerRef.current, {
      display: "none"
    }, 0.98);

    // Fade in 3D model container (0.94 -> 0.98)
    tl.fromTo(modelContainerRef.current, {
      opacity: 0,
      visibility: "hidden"
    }, {
      opacity: 1,
      visibility: "visible",
      ease: "none",
      duration: 0.04,
    }, 0.94);

    // Secondary ScrollTrigger for offscreen GPU rendering cleanup (acts on outer container)
    ScrollTrigger.create({
      trigger: "#hero-scroll-track",
      start: "top top",
      end: "bottom top", // fires when the bottom of the 200vh track leaves the top of the viewport
      onLeave: () => {
        if (modelOuterContainerRef.current) {
          modelOuterContainerRef.current.style.visibility = "hidden";
        }
        if (canvasContainerRef.current) {
          canvasContainerRef.current.style.display = "none";
        }
      },
      onEnterBack: () => {
        if (modelOuterContainerRef.current) {
          modelOuterContainerRef.current.style.visibility = "visible";
        }
        if (canvasContainerRef.current) {
          canvasContainerRef.current.style.display = "flex";
        }
        // Force update timeline triggers to sync correctly
        tl.scrollTrigger?.update();
      },
      onEnter: () => {
        if (modelOuterContainerRef.current) {
          modelOuterContainerRef.current.style.visibility = "visible";
        }
        if (canvasContainerRef.current) {
          canvasContainerRef.current.style.display = "flex";
        }
        tl.scrollTrigger?.update();
      },
      onLeaveBack: () => {
        if (modelOuterContainerRef.current) {
          modelOuterContainerRef.current.style.visibility = "hidden";
        }
      }
    });

  }, []);

  return (
    <div className="w-full h-dvh relative overflow-hidden flex items-center justify-center bg-transparent">
      {/* 2D Image Sequence Canvas */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        style={{
          willChange: "opacity, transform",
          transform: "translate3d(0,0,0)",
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </div>

      {/* 3D Model Canvas — mounted immediately to ensure early GPU compilation */}
      <div
        ref={modelOuterContainerRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          visibility: "visible",
        }}
      >
        <div
          ref={modelContainerRef}
          className="w-full h-full pointer-events-none"
          style={{
            visibility: "hidden",
            opacity: 0,
            willChange: "opacity",
          }}
        >
          {show3DModel && (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
              style={{ background: "transparent", pointerEvents: "none" }}
            >
              <ambientLight intensity={1} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <Suspense fallback={null}>
                <Model
                  url="/logos/ieee.glb"
                  scale={windowSizeRef.current.width < 768 ? 0.22 : 0.35}
                  position={[0, 0, 0]}
                />
                <Environment files="/potsdamer_platz_1k.hdr" />
              </Suspense>
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}
