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
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup for 3D Art Studio
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(20, 30, 25);
    scene.add(dirLight1);

    const yellowLight = new THREE.DirectionalLight(0xfacc15, 2.5);
    yellowLight.position.set(-25, -10, 15);
    scene.add(yellowLight);

    // -------------------------------------------------------------
    // 3. THE 3D ARTIST'S PAINT BRUSH (Stylized Hero Tool)
    // -------------------------------------------------------------
    const brushGroup = new THREE.Group();

    // Brush Handle (Long, elegant, dark wooden/charcoal studio handle)
    const handleGeo = new THREE.CylinderGeometry(0.18, 0.42, 13, 16);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.35,
      metalness: 0.1,
    });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.position.y = 6.5;
    brushGroup.add(handleMesh);

    // Brush Ferrule (Golden metallic collar)
    const ferruleGeo = new THREE.CylinderGeometry(0.44, 0.42, 2.6, 16);
    const ferruleMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.85,
      roughness: 0.25,
    });
    const ferruleMesh = new THREE.Mesh(ferruleGeo, ferruleMat);
    ferruleMesh.position.y = 0.2;
    brushGroup.add(ferruleMesh);

    // Brush Bristles (Tapered art brush hair with dark ink body)
    const bristleGeo = new THREE.ConeGeometry(0.46, 3.6, 16);
    const bristleMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.8,
    });
    const bristleMesh = new THREE.Mesh(bristleGeo, bristleMat);
    bristleMesh.position.y = -2.6;
    bristleMesh.rotation.z = Math.PI;
    brushGroup.add(bristleMesh);

    // Brush Tip Dipped in Golden Paint (Signature ART WORK Yellow)
    const tipGeo = new THREE.ConeGeometry(0.28, 1.4, 16);
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.2,
      emissive: 0xfacc15,
      emissiveIntensity: 0.25,
    });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.position.y = -3.7;
    tipMesh.rotation.z = Math.PI;
    brushGroup.add(tipMesh);

    brushGroup.position.set(14, 3, 4);
    brushGroup.rotation.set(0.4, -0.6, -0.7);
    scene.add(brushGroup);

    // -------------------------------------------------------------
    // 4. THE 3D KINETIC MOTION GRAPHICS PAINT RIBBON (Sweeping Spline)
    // -------------------------------------------------------------
    const ribbonPoints = [
      new THREE.Vector3(-25, -12, -8),
      new THREE.Vector3(-14, -4, 2),
      new THREE.Vector3(-2, 8, 6),
      new THREE.Vector3(8, -1, 3),
      new THREE.Vector3(14, 3, 4), // Near brush tip
      new THREE.Vector3(22, 10, -5),
    ];
    const ribbonCurve = new THREE.CatmullRomCurve3(ribbonPoints);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 80, 0.45, 12, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.3,
      metalness: 0.3,
      transparent: true,
      opacity: 0.75,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    scene.add(ribbonMesh);

    // Wireframe contour on the ribbon (Motion graphics grid feel)
    const ribbonWireMat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const ribbonWireMesh = new THREE.Mesh(ribbonGeo, ribbonWireMat);
    ribbonWireMesh.scale.set(1.02, 1.02, 1.02);
    scene.add(ribbonWireMesh);

    // -------------------------------------------------------------
    // 5. 3D DIGITAL VECTOR PEN TOOL & BEZIER NODE (Design Tool)
    // -------------------------------------------------------------
    const penGroup = new THREE.Group();

    // Pen Nib (Iconic Graphic Design Vector Pen)
    const penNibGeo = new THREE.ConeGeometry(0.8, 2.4, 4);
    const penNibMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.2,
    });
    const penNib = new THREE.Mesh(penNibGeo, penNibMat);
    penNib.rotation.y = Math.PI / 4;
    penGroup.add(penNib);

    // Pen Body (Sleek Drafting Stylus)
    const penBodyGeo = new THREE.CylinderGeometry(0.45, 0.65, 5, 8);
    const penBodyMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.4,
    });
    const penBody = new THREE.Mesh(penBodyGeo, penBodyMat);
    penBody.position.y = 3.5;
    penGroup.add(penBody);

    // Bezier Handlebar (Anchor line + 2 control tangent spheres)
    const bezierLineGeo = new THREE.CylinderGeometry(0.04, 0.04, 4, 8);
    const bezierLineMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const bezierLine = new THREE.Mesh(bezierLineGeo, bezierLineMat);
    bezierLine.rotation.z = Math.PI / 2;
    penGroup.add(bezierLine);

    const nodeGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xfacc15,
      emissiveIntensity: 0.3,
    });
    const leftNode = new THREE.Mesh(nodeGeo, nodeMat);
    leftNode.position.x = -2;
    penGroup.add(leftNode);

    const rightNode = new THREE.Mesh(nodeGeo, nodeMat);
    rightNode.position.x = 2;
    penGroup.add(rightNode);

    penGroup.position.set(-16, 6, -3);
    penGroup.rotation.set(-0.3, 0.4, 0.5);
    penGroup.scale.set(1.4, 1.4, 1.4);
    scene.add(penGroup);

    // -------------------------------------------------------------
    // 6. 3D ARTIST'S COLOR PALETTE (From Brand Logo!)
    // -------------------------------------------------------------
    const paletteShape = new THREE.Shape();
    // Rounded organic painter's palette outline matching the logo
    paletteShape.moveTo(-4, -2.5);
    paletteShape.bezierCurveTo(-6, -1, -6, 3, -3.5, 4.5);
    paletteShape.bezierCurveTo(-1, 5.5, 3, 5, 4.5, 3.5);
    paletteShape.bezierCurveTo(6, 2, 5.5, -2, 3, -3.5);
    paletteShape.bezierCurveTo(0.5, -5, -2, -4, -4, -2.5);

    // Thumb hole
    const thumbHole = new THREE.Path();
    thumbHole.absellipse(2.5, -1.2, 0.8, 1.2, 0, Math.PI * 2, true, 0);
    paletteShape.holes.push(thumbHole);

    const paletteGeo = new THREE.ExtrudeGeometry(paletteShape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    const paletteMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.45,
      metalness: 0.15,
    });
    const paletteMesh = new THREE.Mesh(paletteGeo, paletteMat);

    // Paint Dollops on Palette (Yellow, Black, White blobs)
    const blobGeo = new THREE.SphereGeometry(0.42, 12, 12);
    blobGeo.scale(1, 0.4, 1);

    const yellowBlobMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2 });
    const blackBlobMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });
    const whiteBlobMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

    const blob1 = new THREE.Mesh(blobGeo, blackBlobMat);
    blob1.position.set(-3.2, 1.5, 0.35);
    paletteMesh.add(blob1);

    const blob2 = new THREE.Mesh(blobGeo, yellowBlobMat);
    blob2.position.set(-1.8, 3.2, 0.35);
    paletteMesh.add(blob2);

    const blob3 = new THREE.Mesh(blobGeo, whiteBlobMat);
    blob3.position.set(1.2, 3.4, 0.35);
    paletteMesh.add(blob3);

    const blob4 = new THREE.Mesh(blobGeo, blackBlobMat);
    blob4.position.set(-3.8, -0.6, 0.35);
    paletteMesh.add(blob4);

    const paletteHolder = new THREE.Group();
    paletteHolder.add(paletteMesh);
    paletteHolder.position.set(-15, -8, 2);
    paletteHolder.rotation.set(0.4, 0.3, -0.2);
    paletteHolder.scale.set(1.1, 1.1, 1.1);
    scene.add(paletteHolder);

    // -------------------------------------------------------------
    // 7. FLOATING 3D MOTION GRAPHICS ARTBOARDS / CANVASES
    // -------------------------------------------------------------
    const artboardGeo = new THREE.BoxGeometry(10, 6, 0.08);
    const artboardEdges = new THREE.EdgesGeometry(artboardGeo);
    const artboardMat = new THREE.LineBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.45,
    });
    const artboard1 = new THREE.LineSegments(artboardEdges, artboardMat);
    artboard1.position.set(18, -8, -6);
    artboard1.rotation.set(-0.2, -0.4, 0.1);
    scene.add(artboard1);

    const artboard2 = new THREE.LineSegments(artboardEdges, artboardMat);
    artboard2.position.set(-6, 12, -10);
    artboard2.rotation.set(0.3, 0.2, -0.15);
    scene.add(artboard2);

    // -------------------------------------------------------------
    // 8. 3D FLOATING INK & PAINT DROPLETS (Art Splatters)
    // -------------------------------------------------------------
    const dropCount = 35;
    const dropGroup = new THREE.Group();
    const dropletGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const yellowDropMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.2,
    });
    const blackDropMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
    });

    const dropMeshes: { mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number }[] = [];
    for (let i = 0; i < dropCount; i++) {
      const mat = Math.random() > 0.45 ? yellowDropMat : blackDropMat;
      const drop = new THREE.Mesh(dropletGeo, mat);
      const scale = 0.4 + Math.random() * 0.9;
      drop.scale.set(scale, scale, scale);

      const basePos = new THREE.Vector3(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 30
      );
      drop.position.copy(basePos);
      dropGroup.add(drop);
      dropMeshes.push({ mesh: drop, basePos, speed: 0.5 + Math.random() });
    }
    scene.add(dropGroup);

    // -------------------------------------------------------------
    // 9. FLOOR PERSPECTIVE DRAFTING GRID (Subtle Ground)
    // -------------------------------------------------------------
    const gridHelper = new THREE.GridHelper(100, 30, 0xfacc15, 0x111111);
    gridHelper.position.y = -16;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.3;
    scene.add(gridHelper);

    // -------------------------------------------------------------
    // 10. MOUSE PARALLAX & RESIZE
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // 11. KINETIC ANIMATION LOOP (Scroll Physics & Hand Drawing Motion)
    // -------------------------------------------------------------
    let animationFrameId: number;
    let currentProgress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth scroll interpolation
      const targetProgress = scrollRef.current;
      currentProgress += (targetProgress - currentProgress) * 0.08;
      const time = performance.now() * 0.001;

      // Camera flies through the studio with scroll
      const targetZ = 36 - currentProgress * 20;
      camera.position.z += (targetZ - camera.position.z) * 0.1;
      camera.position.x += (mouseX + Math.sin(currentProgress * Math.PI * 2) * 4 - camera.position.x) * 0.05;
      camera.position.y += (mouseY + Math.cos(currentProgress * Math.PI) * 2.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // A) The Brush moves like an active artist painting across the screen!
      const brushX = 14 + Math.sin(time * 1.2 + currentProgress * Math.PI * 3) * 3;
      const brushY = 3 + Math.cos(time * 1.5 + currentProgress * Math.PI * 4) * 2.5;
      brushGroup.position.set(brushX, brushY, 4 + Math.sin(time) * 1.5);
      brushGroup.rotation.z = -0.7 + Math.sin(time * 1.5) * 0.25;
      brushGroup.rotation.x = 0.4 + Math.cos(time * 1.2) * 0.2;

      // B) Paint Ribbon dynamically twists and responds to scroll
      ribbonMesh.rotation.y = currentProgress * Math.PI * 1.5 + Math.sin(time * 0.5) * 0.15;
      ribbonMesh.rotation.x = Math.sin(time * 0.4 + currentProgress * 2) * 0.2;
      ribbonWireMesh.rotation.copy(ribbonMesh.rotation);

      // C) Pen Tool drifts with subtle vector manipulation rotation
      penGroup.rotation.y = time * 0.4 + currentProgress * Math.PI * 2;
      penGroup.rotation.z = 0.5 + Math.sin(time * 0.8) * 0.2;
      penGroup.position.y = 6 + Math.cos(time * 0.9) * 1.2;

      // D) Painter's Palette rotates and floats smoothly
      paletteHolder.rotation.y = 0.3 + currentProgress * Math.PI * 1.2 + Math.sin(time * 0.5) * 0.2;
      paletteHolder.rotation.x = 0.4 + Math.cos(time * 0.6) * 0.15;
      paletteHolder.position.y = -8 + Math.sin(time * 0.7) * 1.2;

      // E) Artboards rotate subtly
      artboard1.rotation.y = -0.4 + time * 0.2;
      artboard2.rotation.x = 0.3 + Math.sin(time * 0.3) * 0.2;

      // F) Ink droplets drift
      dropMeshes.forEach(({ mesh, basePos, speed }) => {
        mesh.position.y = basePos.y + Math.sin(time * speed + basePos.x) * 1.5;
        mesh.position.x = basePos.x + Math.cos(time * 0.5 * speed) * 0.8;
      });

      // Ground grid travels smoothly with scroll
      gridHelper.position.z = ((currentProgress * 40) % 6) - 3;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      handleGeo.dispose();
      handleMat.dispose();
      ferruleGeo.dispose();
      ferruleMat.dispose();
      bristleGeo.dispose();
      bristleMat.dispose();
      tipGeo.dispose();
      tipMat.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
      ribbonWireMat.dispose();
      penNibGeo.dispose();
      penNibMat.dispose();
      penBodyGeo.dispose();
      penBodyMat.dispose();
      bezierLineGeo.dispose();
      bezierLineMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      paletteGeo.dispose();
      paletteMat.dispose();
      blobGeo.dispose();
      yellowBlobMat.dispose();
      blackBlobMat.dispose();
      whiteBlobMat.dispose();
      artboardGeo.dispose();
      artboardEdges.dispose();
      artboardMat.dispose();
      dropletGeo.dispose();
      yellowDropMat.dispose();
      blackDropMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none transition-opacity duration-300"
      aria-hidden="true"
    />
  );
};
