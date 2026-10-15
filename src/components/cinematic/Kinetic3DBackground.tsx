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

    // List of disposables for clean memory management
    const disposables: { geometry?: THREE.BufferGeometry; material?: THREE.Material }[] = [];
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(20, 35, 30);
    scene.add(keyLight);

    const warmFill = new THREE.DirectionalLight(0xfacc15, 2.8);
    warmFill.position.set(-30, 10, 20);
    scene.add(warmFill);

    // Common Materials
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
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.7,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfde047, // Stylized playful yellow/gold skin tone
      roughness: 0.5,
    });
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
    });

    // Helper: Build a Stylized Motion Character
    const createCharacter = (hoodieColor: number, hasHeadphones = false) => {
      const charGroup = new THREE.Group();

      // Head
      const head = registerMesh(
        new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), skinMat)
      );
      head.position.y = 4.2;
      charGroup.add(head);

      // Stylized Hair / Cap
      const hair = registerMesh(
        new THREE.Mesh(
          new THREE.SphereGeometry(1.08, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
          blackMat
        )
      );
      hair.position.y = 4.35;
      charGroup.add(hair);

      if (hasHeadphones) {
        // Studio Monitor Headphones
        const band = registerMesh(
          new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.1, 8, 16, Math.PI), yellowMat)
        );
        band.rotation.x = -Math.PI / 2;
        band.position.y = 4.3;
        charGroup.add(band);

        const cupGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 12);
        const leftCup = registerMesh(new THREE.Mesh(cupGeo, blackMat));
        leftCup.rotation.z = Math.PI / 2;
        leftCup.position.set(-1.1, 4.2, 0);
        charGroup.add(leftCup);

        const rightCup = registerMesh(new THREE.Mesh(cupGeo, blackMat));
        rightCup.rotation.z = Math.PI / 2;
        rightCup.position.set(1.1, 4.2, 0);
        charGroup.add(rightCup);
      }

      // Torso (Hoodie / Crewneck)
      const torsoMat = new THREE.MeshStandardMaterial({ color: hoodieColor, roughness: 0.5 });
      const torso = registerMesh(
        new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 2.6, 16), torsoMat)
      );
      torso.position.y = 2.2;
      charGroup.add(torso);

      return { charGroup, head, torso };
    };

    // =============================================================
    // 3. STATION 1: THE ARTIST / ILLUSTRATOR (واحد بيرسم)
    // =============================================================
    const station1 = new THREE.Group();
    station1.position.set(-15, -1, 6);

    // Easel (Wood tripod)
    const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 11, 8);
    const leftLeg = registerMesh(new THREE.Mesh(legGeo, woodMat));
    leftLeg.rotation.z = 0.18;
    leftLeg.position.set(-1.5, 2.5, 0);
    station1.add(leftLeg);

    const rightLeg = registerMesh(new THREE.Mesh(legGeo, woodMat));
    rightLeg.rotation.z = -0.18;
    rightLeg.position.set(1.5, 2.5, 0);
    station1.add(rightLeg);

    const backLeg = registerMesh(new THREE.Mesh(legGeo, woodMat));
    backLeg.rotation.x = -0.25;
    backLeg.position.set(0, 2.5, -1.8);
    station1.add(backLeg);

    // Canvas Board
    const canvasBoard = registerMesh(
      new THREE.Mesh(new THREE.BoxGeometry(5.5, 4.2, 0.2), whiteMat)
    );
    canvasBoard.position.set(0, 4.2, 0.2);
    canvasBoard.rotation.x = 0.08;
    station1.add(canvasBoard);

    // Dynamic Painted Artwork on Canvas (Live Glowing Brush Stroke)
    const sketchStroke = registerMesh(
      new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.18, 8, 24, Math.PI * 1.3), yellowMat)
    );
    sketchStroke.position.set(0, 4.3, 0.32);
    station1.add(sketchStroke);

    // The Artist Character (Standing & Painting)
    const artist = createCharacter(0xfacc15, false); // Wearing yellow hoodie
    artist.charGroup.position.set(3.2, -1.2, 1.2);
    artist.charGroup.rotation.y = -Math.PI / 4;
    station1.add(artist.charGroup);

    // Artist Palette in Left Hand
    const palette = registerMesh(
      new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.12, 16), woodMat)
    );
    palette.position.set(2.2, 1.2, 1.6);
    palette.rotation.x = Math.PI / 4;
    station1.add(palette);

    // Right Arm with Brush (Rigged to animate painting)
    const armGroup = new THREE.Group();
    armGroup.position.set(2.4, 1.8, 1.5);

    const armGeo = new THREE.CylinderGeometry(0.2, 0.24, 2.2, 8);
    const armMesh = registerMesh(new THREE.Mesh(armGeo, yellowMat));
    armMesh.rotation.z = Math.PI / 3;
    armGroup.add(armMesh);

    // Brush in Hand
    const brushInHand = registerMesh(
      new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8), blackMat)
    );
    brushInHand.position.set(-1.2, 0.8, 0.2);
    brushInHand.rotation.z = -Math.PI / 4;
    armGroup.add(brushInHand);

    const brushTip = registerMesh(
      new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 8), yellowMat)
    );
    brushTip.position.set(-1.8, 1.4, 0.2);
    brushTip.rotation.z = -Math.PI / 4;
    armGroup.add(brushTip);

    station1.add(armGroup);
    scene.add(station1);

    // =============================================================
    // 4. STATION 2: THE GRAPHIC & MOTION DESIGNER (واحد بيعمل ديزاين)
    // =============================================================
    const station2 = new THREE.Group();
    station2.position.set(16, 2, -2);

    // Designer Studio Desk
    const deskTop = registerMesh(
      new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.35, 4.5), blackMat)
    );
    deskTop.position.set(0, 1.2, 0);
    station2.add(deskTop);

    const deskLegGeo = new THREE.BoxGeometry(0.3, 4, 0.3);
    const dl1 = registerMesh(new THREE.Mesh(deskLegGeo, blackMat));
    dl1.position.set(-4.2, -0.8, 1.8);
    station2.add(dl1);
    const dl2 = registerMesh(new THREE.Mesh(deskLegGeo, blackMat));
    dl2.position.set(4.2, -0.8, 1.8);
    station2.add(dl2);
    const dl3 = registerMesh(new THREE.Mesh(deskLegGeo, blackMat));
    dl3.position.set(-4.2, -0.8, -1.8);
    station2.add(dl3);
    const dl4 = registerMesh(new THREE.Mesh(deskLegGeo, blackMat));
    dl4.position.set(4.2, -0.8, -1.8);
    station2.add(dl4);

    // Dual Designer Curved Monitors
    const monitorGeo = new THREE.BoxGeometry(4.2, 2.6, 0.15);
    const monitorMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
    });
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xfacc15,
      emissiveIntensity: 0.35,
    });

    // Main Design Monitor
    const mon1 = registerMesh(new THREE.Mesh(monitorGeo, monitorMat));
    mon1.position.set(-1.8, 3.2, -0.8);
    mon1.rotation.y = 0.15;
    station2.add(mon1);

    const screen1 = registerMesh(
      new THREE.Mesh(new THREE.PlaneGeometry(3.9, 2.3), screenMat)
    );
    screen1.position.set(-1.8, 3.2, -0.71);
    screen1.rotation.y = 0.15;
    station2.add(screen1);

    // Secondary UI Monitor
    const mon2 = registerMesh(new THREE.Mesh(monitorGeo, monitorMat));
    mon2.position.set(2.4, 3.2, -0.5);
    mon2.rotation.y = -0.3;
    station2.add(mon2);

    // Floating 3D Vector Pen Tool & Bezier Curve (Holographic Design Elements)
    const floatPen = registerMesh(
      new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.8, 4), yellowMat)
    );
    floatPen.position.set(0, 5.5, 0);
    floatPen.rotation.y = Math.PI / 4;
    station2.add(floatPen);

    const bezierRing = registerMesh(
      new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.08, 8, 32), yellowMat)
    );
    bezierRing.position.set(0, 5.5, 0);
    bezierRing.rotation.x = Math.PI / 3;
    station2.add(bezierRing);

    // The Designer Character (Seated in front of workstation)
    const designer = createCharacter(0x18181b, false); // Dark studio crewneck
    designer.charGroup.position.set(0, -0.6, 2.2);
    designer.charGroup.rotation.y = Math.PI;
    station2.add(designer.charGroup);

    scene.add(station2);

    // =============================================================
    // 5. STATION 3: THE VIDEO & MOTION EDITOR (واحد بيعمل مونتاج)
    // =============================================================
    const station3 = new THREE.Group();
    station3.position.set(0, -11, -4);

    // Video Editing Console Desk
    const editDesk = registerMesh(
      new THREE.Mesh(new THREE.BoxGeometry(11, 0.4, 4), blackMat)
    );
    editDesk.position.set(0, 1.2, 0);
    station3.add(editDesk);

    // Multi-Track Timeline Screen (Premiere / After Effects style)
    const timelineScreenGeo = new THREE.BoxGeometry(7.5, 3.2, 0.18);
    const timelineScreen = registerMesh(new THREE.Mesh(timelineScreenGeo, monitorMat));
    timelineScreen.position.set(0, 3.5, -0.8);
    station3.add(timelineScreen);

    // Colored Video & Audio Clip Blocks on Timeline
    const trackColors = [0xfacc15, 0x38bdf8, 0xf43f5e, 0xa855f7];
    const clipMeshes: THREE.Mesh[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const clipMat = new THREE.MeshStandardMaterial({
          color: trackColors[(row + col) % trackColors.length],
          emissive: trackColors[(row + col) % trackColors.length],
          emissiveIntensity: 0.3,
        });
        const clip = registerMesh(
          new THREE.Mesh(
            new THREE.BoxGeometry(1.2 + Math.random() * 0.6, 0.45, 0.05),
            clipMat
          )
        );
        clip.position.set(-2.4 + col * 1.6, 2.6 + row * 0.7, -0.68);
        station3.add(clip);
        clipMeshes.push(clip);
      }
    }

    // Glowing Scrubber Playhead (Moving Timeline Scrubber)
    const playhead = registerMesh(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      )
    );
    playhead.position.set(-2.5, 3.3, -0.66);
    station3.add(playhead);

    // The Video Editor Character (Wearing Studio Headphones)
    const editor = createCharacter(0x27272a, true); // Charcoal hoodie with headphones
    editor.charGroup.position.set(0, -0.6, 2.2);
    editor.charGroup.rotation.y = Math.PI;
    station3.add(editor.charGroup);

    // Floating 3D Video Cut / Filmstrip Frame
    const filmstripGeo = new THREE.BoxGeometry(2.4, 1.8, 0.1);
    const filmstrip = registerMesh(new THREE.Mesh(filmstripGeo, yellowMat));
    filmstrip.position.set(-4.5, 5.2, 0.5);
    filmstrip.rotation.set(0.2, 0.4, -0.1);
    station3.add(filmstrip);

    scene.add(station3);

    // -------------------------------------------------------------
    // 6. PERSPECTIVE STUDIO GROUND GRID
    // -------------------------------------------------------------
    const gridHelper = new THREE.GridHelper(90, 30, 0xfacc15, 0x111111);
    gridHelper.position.y = -15;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    scene.add(gridHelper);

    // -------------------------------------------------------------
    // 7. MOUSE PARALLAX & RESIZE
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
    // 8. ANIMATION LOOP (Scroll Travel & Character Activity)
    // -------------------------------------------------------------
    let animationFrameId: number;
    let currentProgress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth scroll interpolation
      const targetProgress = scrollRef.current;
      currentProgress += (targetProgress - currentProgress) * 0.08;
      const time = performance.now() * 0.001;

      // CAMERA FLIGHT THROUGH THE 3 CHARACTER STATIONS
      // 0.0 -> Station 1: The Artist Drawing
      // 0.5 -> Station 2: The Designer Crafting
      // 1.0 -> Station 3: The Video Editor Cutting
      let targetCamX = -6;
      let targetCamY = 2;
      let targetCamZ = 38;
      const lookTarget = new THREE.Vector3(0, 0, 0);

      if (currentProgress < 0.45) {
        // Flying around Station 1 (Artist)
        const t = currentProgress / 0.45;
        targetCamX = -12 + t * 8;
        targetCamY = 3 - t * 1;
        targetCamZ = 32 - t * 4;
        lookTarget.set(-15, 3, 6);
      } else if (currentProgress < 0.8) {
        // Orbiting Station 2 (Designer)
        const t = (currentProgress - 0.45) / 0.35;
        targetCamX = -4 + t * 18;
        targetCamY = 2 + t * 2;
        targetCamZ = 28 - t * 2;
        lookTarget.set(16, 3, -2);
      } else {
        // Focusing on Station 3 (Video Editor)
        const t = (currentProgress - 0.8) / 0.2;
        targetCamX = 14 - t * 14;
        targetCamY = 4 - t * 10;
        targetCamZ = 26 - t * 4;
        lookTarget.set(0, -9, -4);
      }

      camera.position.x += (targetCamX + mouseX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY + mouseY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.lookAt(lookTarget);

      // --- CHARACTER ANIMATIONS ---

      // 1. Artist Painting Arm Action (Sweeping brush on canvas)
      armGroup.rotation.z = Math.sin(time * 3.5) * 0.25;
      armGroup.position.x = 2.4 + Math.cos(time * 3.5) * 0.3;
      artist.head.rotation.y = Math.sin(time * 1.5) * 0.15;
      sketchStroke.scale.setScalar(0.95 + Math.sin(time * 3) * 0.08);

      // 2. Designer Action (Stylus movement & floating vector morph)
      designer.head.rotation.y = Math.sin(time * 1.8) * 0.2;
      floatPen.rotation.y += 0.02;
      floatPen.position.y = 5.5 + Math.sin(time * 2) * 0.25;
      bezierRing.rotation.z += 0.015;
      bezierRing.rotation.x = Math.PI / 3 + Math.sin(time * 1.2) * 0.2;

      // 3. Video Editor Action (Playhead scrubbing & head nodding)
      playhead.position.x = -2.8 + ((time * 1.8) % 5.6);
      editor.head.rotation.x = Math.sin(time * 4) * 0.08; // Nodding to audio track
      filmstrip.rotation.y = 0.4 + Math.sin(time * 1.5) * 0.2;

      // Ground grid shifts forward
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
      });
      yellowMat.dispose();
      blackMat.dispose();
      woodMat.dispose();
      skinMat.dispose();
      whiteMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35 select-none transition-opacity duration-300"
      aria-hidden="true"
    />
  );
};
