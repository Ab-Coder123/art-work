import { create } from "zustand";

export type SceneId = "hero" | "why-us" | "capabilities" | "contact";

interface SceneStep {
  id: SceneId;
  label: string;
  stepNumber: string;
}

export const SCENE_STEPS: SceneStep[] = [
  { id: "hero", label: "01 MANIFESTO", stepNumber: "01" },
  { id: "why-us", label: "02 WHY US", stepNumber: "02" },
  { id: "capabilities", label: "03 SERVICES", stepNumber: "03" },
  { id: "contact", label: "04 CONTACT", stepNumber: "04" },
];

interface ScrollytellingState {
  currentScene: SceneId;
  scrollProgress: number; // 0.0 to 1.0
  setCurrentScene: (scene: SceneId) => void;
  setScrollProgress: (progress: number) => void;
}

export const useScrollytellingStore = create<ScrollytellingState>((set) => ({
  currentScene: "hero",
  scrollProgress: 0,
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));
