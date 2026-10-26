import { create } from "zustand";

export type SceneId = "hero" | "why-us" | "capabilities" | "contact";

interface SceneStep {
  id: SceneId;
  label: string;
  stepNumber: string;
}

export const SCENE_STEPS: SceneStep[] = [
  { id: "hero", label: "HOME", stepNumber: "01" },
  { id: "why-us", label: "WHY US", stepNumber: "02" },
  { id: "capabilities", label: "SERVICES", stepNumber: "03" },
  { id: "contact", label: "CONTACT", stepNumber: "04" },
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
