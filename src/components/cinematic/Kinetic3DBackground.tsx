"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Kinetic3DBackgroundProps {
  scrollProgress: number; // 0 to 1
}

export const Kinetic3DBackground: React.FC<Kinetic3DBackgroundProps> = ({
  scrollProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 35);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. 3D Infinite Drafting Grid (Flooring plane)
    const gridHelper = new THREE.GridHelper(120, 40, 0xfacc15, 0x111111);
    gridHelper.position.y = -14;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.45;
    scene.add(gridHelper);

    // 3. Central Kinetic 3D Wireframe Icosahedron (Creative core)
    const icoGeo = new THREE.IcosahedronGeometry(7, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(16, 2, 5);
    scene.add(icoMesh);

    // Canary Yellow inner core points
    const innerGeo = new THREE.IcosahedronGeometry(4.5, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    icoMesh.add(innerMesh);

    // 4. Secondary Floating 3D Torus Ring (Ink orbit)
    const torusGeo = new THREE.TorusGeometry(8, 0.4, 8, 32);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(-18, -4, -10);
    torusMesh.rotation.x = Math.PI / 3;
    scene.add(torusMesh);

    // 5. Floating 3D Drafting Cubes
    const cubeGeo = new THREE.BoxGeometry(4, 4, 4);
    const cubeMat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    cubeMesh.position.set(-14, 10, 8);
    scene.add(cubeMesh);

    // 6. 3D Particle Cloud (Ink dust & sparkles)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const yellowColor = new THREE.Color(0xfacc15);
    const blackColor = new THREE.Color(0x111111);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70;

      const c = Math.random() > 0.4 ? yellowColor : blackColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Mouse Parallax Target
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 4;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 4;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 8. Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 9. Animation Loop with Real Scroll Physics
    let animationFrameId: number;
    let currentZ = 35;
    let currentProgress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth interpolation toward target scroll progress
      const targetProgress = scrollRef.current;
      currentProgress += (targetProgress - currentProgress) * 0.08;

      // Camera Z-Travel & Orbit responding directly to scroll!
      // As user scrolls, camera flies dynamically through the 3D studio scene
      currentZ = 35 - currentProgress * 25;
      camera.position.z += (currentZ - camera.position.z) * 0.1;
      camera.position.x += (mouseX + Math.sin(currentProgress * Math.PI * 2) * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY + Math.cos(currentProgress * Math.PI) * 3 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Rotate 3D Geometric Objects based on continuous scroll + idle spin
      icoMesh.rotation.x = currentProgress * Math.PI * 3 + performance.now() * 0.0003;
      icoMesh.rotation.y = currentProgress * Math.PI * 4 + performance.now() * 0.0005;

      torusMesh.rotation.x = currentProgress * Math.PI * 2 + Math.PI / 3;
      torusMesh.rotation.y = currentProgress * Math.PI * 3 + performance.now() * 0.0004;

      cubeMesh.rotation.x = -currentProgress * Math.PI * 2.5;
      cubeMesh.rotation.y = currentProgress * Math.PI * 3.5;

      // Particle drifting and responsive rotation
      particles.rotation.y = currentProgress * Math.PI * 2 + performance.now() * 0.0001;
      particles.rotation.x = currentProgress * Math.PI * 1.2;

      // Floor grid shifts forward with scroll
      gridHelper.position.z = ((currentProgress * 50) % 6) - 3;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      cubeGeo.dispose();
      cubeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25 select-none transition-opacity duration-300"
      aria-hidden="true"
    />
  );
};
