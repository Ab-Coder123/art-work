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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Disposables tracker
    const disposables: { geometry?: THREE.BufferGeometry; material?: THREE.Material; texture?: THREE.Texture }[] = [];
    const registerMesh = <T extends THREE.Mesh | THREE.LineSegments>(mesh: T): T => {
      if (mesh.geometry) disposables.push({ geometry: mesh.geometry });
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => disposables.push({ material: m }));
      } else if (mesh.material) {
        disposables.push({ material: mesh.material });
      }
      return mesh;
    };

    // 2. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(20, 30, 25);
    scene.add(keyLight);

    const warmFill = new THREE.DirectionalLight(0xfacc15, 2.5);
    warmFill.position.set(-25, 10, 15);
    scene.add(warmFill);

    // Shared Materials
    const yellowMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.3,
      metalness: 0.2,
    });
    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
      metalness: 0.1,
    });

    // Texture Loader for Character Illustrations
    const textureLoader = new THREE.TextureLoader();

    const loadCharPlane = (
      texturePath: string,
      width: number,
      height: number
    ): THREE.Mesh => {
      const texture = textureLoader.load(texturePath);
      texture.colorSpace = THREE.SRGBColorSpace;
      disposables.push({ texture });

      const planeGeo = new THREE.PlaneGeometry(width, height);
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      return registerMesh(new THREE.Mesh(planeGeo, planeMat));
    };

    // =============================================================
    // 3. STATION 1: THE GRAPHIC DESIGNER (واحد بيرسم وبيعمل ديزاين)
    // =============================================================
    const station1 = new THREE.Group();
    station1.position.set(-15, 2, 6);

    // Real Character Illustration Plane (Girl with drawing tablet, pen, & layers)
    const charDesigner = loadCharPlane(
      "/assets/images/char_graphic_designer.png",
      13.5,
      16.2
    );
    station1.add(charDesigner);

    // Floating 3D Vector Pen Tool Nib hovering near her tablet
    const penNibGeo = new THREE.ConeGeometry(0.5, 1.8, 4);
    const penNib = registerMesh(new THREE.Mesh(penNibGeo, yellowMat));
    penNib.position.set(5.5, -2, 1.8);
    penNib.rotation.set(-0.3, 0.4, 0.7);
    station1.add(penNib);

    // Floating 3D Ideation Lightbulb (Glowing)
    const bulbGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xfacc15,
      emissiveIntensity: 0.5,
    });
    const bulb1 = registerMesh(new THREE.Mesh(bulbGeo, bulbMat));
    bulb1.position.set(4.5, 7.5, 1.2);
    station1.add(bulb1);

    scene.add(station1);

    // =============================================================
    // 4. STATION 2: THE MOTION DESIGNER (واحد بيعمل مونتاج وموشن)
    // =============================================================
    const station2 = new THREE.Group();
    station2.position.set(16, -2, -2);

    // Real Character Illustration Plane (Guy with headphones, laptop, & timeline)
    const charMotion = loadCharPlane(
      "/assets/images/char_motion_designer.png",
      14.0,
      16.0
    );
    station2.add(charMotion);

    // 3D Video Timeline Playhead scrubber bar
    const playheadGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8);
    const playheadMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const playhead = registerMesh(new THREE.Mesh(playheadGeo, playheadMat));
    playhead.position.set(3.5, 2.8, 1.2);
    station2.add(playhead);

    // Floating 3D Video Play Button Frame
    const playBoxGeo = new THREE.BoxGeometry(1.8, 1.4, 0.2);
    const playBox = registerMesh(new THREE.Mesh(playBoxGeo, blackMat));
    playBox.position.set(5.5, 6.5, 1.5);
    station2.add(playBox);

    const playArrowGeo = new THREE.ConeGeometry(0.35, 0.6, 3);
    const playArrow = registerMesh(new THREE.Mesh(playArrowGeo, yellowMat));
    playArrow.rotation.z = -Math.PI / 2;
    playArrow.position.set(5.5, 6.5, 1.65);
    station2.add(playArrow);

    scene.add(station2);

    // =============================================================
    // 5. STATION 3: THE ART DIRECTOR & CREATIVE LEAD (أرت دايركتور وأفكار)
    // =============================================================
    const station3 = new THREE.Group();
    station3.position.set(-8, -13, -6);

    // Real Character Illustration Plane (Art Director with moodboards & frames)
    const charArtDirector = loadCharPlane(
      "/assets/images/char_art_director.png",
      13.5,
      16.8
    );
    station3.add(charArtDirector);

    // Floating 3D Wireframe Moodboard Frames
    const frameGeo = new THREE.BoxGeometry(4.5, 3.2, 0.1);
    const frameEdges = new THREE.EdgesGeometry(frameGeo);
    const frameMat = new THREE.LineBasicMaterial({ color: 0xfacc15 });
    const moodFrame = registerMesh(new THREE.LineSegments(frameEdges, frameMat));
    moodFrame.position.set(5.8, 5.0, 1.2);
    moodFrame.rotation.set(0.1, 0.3, -0.15);
    station3.add(moodFrame);

    scene.add(station3);

    // =============================================================
    // 6. STATION 4: THE CONTENT CREATOR (صانعة محتوى وتصوير)
    // =============================================================
    const station4 = new THREE.Group();
    station4.position.set(16, -14, -8);

    // Real Character Illustration Plane (Content Creator with camera & notebook)
    const charContent = loadCharPlane(
      "/assets/images/char_content_creator.png",
      13.5,
      15.8
    );
    station4.add(charContent);
    scene.add(station4);

    // =============================================================
    // 7. 3D KINETIC MOTION GRAPHICS RIBBON (Connecting All Stations)
    // =============================================================
    const ribbonPoints = [
      new THREE.Vector3(-18, 5, 4),
      new THREE.Vector3(-12, -2, 6),
      new THREE.Vector3(2, 4, 2),
      new THREE.Vector3(14, -2, -2),
      new THREE.Vector3(6, -8, -4),
      new THREE.Vector3(-6, -12, -6),
      new THREE.Vector3(14, -14, -8),
    ];
    const ribbonCurve = new THREE.CatmullRomCurve3(ribbonPoints);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 100, 0.32, 10, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.65,
    });
    const ribbonMesh = registerMesh(new THREE.Mesh(ribbonGeo, ribbonMat));
    scene.add(ribbonMesh);

    // -------------------------------------------------------------
    // 8. PERSPECTIVE STUDIO GROUND GRID
    // -------------------------------------------------------------
    const gridHelper = new THREE.GridHelper(90, 30, 0xfacc15, 0x111111);
    gridHelper.position.y = -17;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    scene.add(gridHelper);

    // -------------------------------------------------------------
    // 9. MOUSE PARALLAX & RESIZE
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
    // 10. ANIMATION LOOP (Scroll Navigation & Character Dynamics)
    // -------------------------------------------------------------
    let animationFrameId: number;
    let currentProgress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth scroll interpolation
      const targetProgress = scrollRef.current;
      currentProgress += (targetProgress - currentProgress) * 0.08;
      const time = performance.now() * 0.001;

      // CAMERA TRAJECTORY: Flies through the 4 Character Workstations!
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

      // --- KINETIC CHARACTER INTERACTIONS ---

      // 1. Graphic Designer: gentle hover + pen tool rotation + pulsing lightbulb
      station1.position.y = 2 + Math.sin(time * 1.5) * 0.4;
      penNib.rotation.y += 0.03;
      penNib.position.y = -2 + Math.sin(time * 2.5) * 0.3;
      bulb1.scale.setScalar(0.95 + Math.sin(time * 3) * 0.08);

      // 2. Motion Designer: scrubbing timeline playhead + rotating play button
      station2.position.y = -2 + Math.cos(time * 1.4) * 0.35;
      playhead.position.x = 1.2 + ((time * 2.2) % 4.8);
      playBox.rotation.y = time * 0.8;
      playArrow.rotation.y = time * 0.8;

      // 3. Art Director: moodboard tilt
      station3.position.y = -13 + Math.sin(time * 1.3) * 0.3;
      moodFrame.rotation.y = 0.3 + Math.sin(time * 0.8) * 0.15;

      // 4. Content Creator: gentle floating
      station4.position.y = -14 + Math.cos(time * 1.6) * 0.35;

      // Ribbon kinetic wave
      ribbonMesh.rotation.y = currentProgress * Math.PI * 0.8 + Math.sin(time * 0.4) * 0.1;

      // Floor grid movement
      gridHelper.position.z = ((currentProgress * 50) % 6) - 3;

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
      disposables.forEach((item) => {
        if (item.geometry) item.geometry.dispose();
        if (item.material) item.material.dispose();
        if (item.texture) item.texture.dispose();
      });
      yellowMat.dispose();
      blackMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-45 select-none transition-opacity duration-300"
      aria-hidden="true"
    />
  );
};
