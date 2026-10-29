"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Kinetic3DBackgroundProps {
  scrollProgress?: number; // 0 to 1 (optional, auto-computed from window.scrollY if omitted)
}

export const Kinetic3DBackground: React.FC<Kinetic3DBackgroundProps> = ({
  scrollProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number | undefined>(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, High-Precision Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(-6, 2, 38);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Disposables tracker for clean memory disposal
    const disposables: {
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material;
      texture?: THREE.Texture;
    }[] = [];

    const registerMesh = <T extends THREE.Mesh | THREE.LineSegments>(mesh: T): T => {
      if (mesh.geometry) disposables.push({ geometry: mesh.geometry });
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => disposables.push({ material: m }));
      } else if (mesh.material) {
        disposables.push({ material: mesh.material });
      }
      return mesh;
    };

    // 2. Clean Neutral Studio Lighting (No artificial yellow tinting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(20, 30, 25);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-25, 10, 15);
    scene.add(fillLight);

    // 3. High-Fidelity Character Plane Loader with Anisotropic Filtering
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const loadCharPlane = (
      texturePath: string,
      width: number,
      height: number
    ): THREE.Mesh => {
      const texture = textureLoader.load(texturePath);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = maxAnisotropy;
      disposables.push({ texture });

      const planeGeo = new THREE.PlaneGeometry(width, height);
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.02,
        opacity: 0.85,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      return registerMesh(new THREE.Mesh(planeGeo, planeMat));
    };

    // =============================================================
    // 4. STATIONS 1 to 8: THE 8 ART WORK STUDIO DOODLE CHARACTERS
    // =============================================================
    const station1 = new THREE.Group();
    station1.position.set(-15, 2, 6);
    station1.add(loadCharPlane("/assets/images/character-01.svg", 9.66, 10.5));
    scene.add(station1);

    const station2 = new THREE.Group();
    station2.position.set(16, -2, -2);
    station2.add(loadCharPlane("/assets/images/character-02.svg", 9.66, 10.5));
    scene.add(station2);

    const station3 = new THREE.Group();
    station3.position.set(-8, -13, -6);
    station3.add(loadCharPlane("/assets/images/character-03.svg", 9.66, 10.5));
    scene.add(station3);

    const station4 = new THREE.Group();
    station4.position.set(16, -14, -8);
    station4.add(loadCharPlane("/assets/images/character-04.svg", 9.66, 10.5));
    scene.add(station4);

    const station5 = new THREE.Group();
    station5.position.set(-22, -4, 1);
    station5.add(loadCharPlane("/assets/images/character-05.svg", 9.66, 10.5));
    scene.add(station5);

    const station6 = new THREE.Group();
    station6.position.set(9, 4, -9);
    station6.add(loadCharPlane("/assets/images/character-06.svg", 9.66, 10.5));
    scene.add(station6);

    const station7 = new THREE.Group();
    station7.position.set(-17, -15, -11);
    station7.add(loadCharPlane("/assets/images/character-07.svg", 9.66, 10.5));
    scene.add(station7);

    const station8 = new THREE.Group();
    station8.position.set(7, -17, -13);
    station8.add(loadCharPlane("/assets/images/character-08.svg", 9.66, 10.5));
    scene.add(station8);

    // =============================================================
    // 8. MINIMAL CLEAN PERSPECTIVE FLOOR GRID (Subtle Neutral Gray)
    // =============================================================
    const gridHelper = new THREE.GridHelper(100, 30, 0xd1d5db, 0xe5e7eb);
    gridHelper.position.y = -17;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.12;
    scene.add(gridHelper);

    // =============================================================
    // 9. MOUSE PARALLAX & RESIZE HANDLERS
    // =============================================================
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 4;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 4;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // =============================================================
    // 10. ANIMATION LOOP (Scroll Travel & Subtle Floating Breathing)
    // =============================================================
    let animationFrameId: number;
    let currentProgress = 0;
    let isVisible = !document.hidden;

    const animate = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      // Direct high-performance scroll calculation without React state triggers:
      let targetProgress = 0;
      if (typeof scrollRef.current === "number" && !isNaN(scrollRef.current)) {
        targetProgress = scrollRef.current;
      } else {
        const track = document.getElementById("pinned-stage-track");
        const total = track
          ? Math.max(1, track.scrollHeight - window.innerHeight)
          : Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        targetProgress = Math.min(1, Math.max(0, window.scrollY / total));
      }

      currentProgress += (targetProgress - currentProgress) * 0.08;
      const time = performance.now() * 0.001;

      // CAMERA TRAJECTORY: Smooth glide through the stations
      let targetCamX = -6;
      let targetCamY = 2;
      let targetCamZ = 38;
      const lookTarget = new THREE.Vector3(0, 0, 0);

      if (currentProgress < 0.4) {
        // Station 1: Focus on Graphic Designer
        const t = currentProgress / 0.4;
        targetCamX = -10 + t * 6;
        targetCamY = 3 - t * 2;
        targetCamZ = 34 - t * 4;
        lookTarget.set(-15, 2, 6);
      } else if (currentProgress < 0.75) {
        // Station 2: Glide over to Motion Designer
        const t = (currentProgress - 0.4) / 0.35;
        targetCamX = -4 + t * 16;
        targetCamY = 1 - t * 2;
        targetCamZ = 30 - t * 2;
        lookTarget.set(16, -2, -2);
      } else {
        // Station 3 & 4: Descend to Art Director & Content Creator
        const t = (currentProgress - 0.75) / 0.25;
        targetCamX = 12 - t * 14;
        targetCamY = -1 - t * 9;
        targetCamZ = 28 - t * 4;
        lookTarget.set(0, -13, -7);
      }

      camera.position.x += (targetCamX + mouseX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY + mouseY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.lookAt(lookTarget);

      // Subtle breathing float for characters
      station1.position.y = 2 + Math.sin(time * 1.4) * 0.35;
      station2.position.y = -2 + Math.cos(time * 1.3) * 0.35;
      station3.position.y = -13 + Math.sin(time * 1.2) * 0.3;
      station4.position.y = -14 + Math.cos(time * 1.5) * 0.35;
      station5.position.y = -4 + Math.sin(time * 1.1) * 0.35;
      station6.position.y = 4 + Math.cos(time * 1.4) * 0.35;
      station7.position.y = -15 + Math.sin(time * 1.3) * 0.3;
      station8.position.y = -17 + Math.cos(time * 1.2) * 0.35;

      // Subtle tilt responding to mouse
      station1.rotation.y = Math.sin(time * 0.8) * 0.05 + mouseX * 0.02;
      station2.rotation.y = Math.cos(time * 0.7) * 0.05 + mouseX * 0.02;
      station3.rotation.y = Math.sin(time * 0.6) * 0.05;
      station4.rotation.y = Math.cos(time * 0.8) * 0.05;
      station5.rotation.y = Math.sin(time * 0.7) * 0.05 + mouseX * 0.015;
      station6.rotation.y = Math.cos(time * 0.9) * 0.05 + mouseX * 0.015;
      station7.rotation.y = Math.sin(time * 0.5) * 0.05;
      station8.rotation.y = Math.cos(time * 0.7) * 0.05;

      // Floor grid movement with scroll
      gridHelper.position.z = ((currentProgress * 50) % 6) - 3;

      renderer.render(scene, camera);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        animate();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      disposables.forEach((item) => {
        if (item.geometry) item.geometry.dispose();
        if (item.material) item.material.dispose();
        if (item.texture) item.texture.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-22 select-none transition-opacity duration-300"
      aria-hidden="true"
    />
  );
};
