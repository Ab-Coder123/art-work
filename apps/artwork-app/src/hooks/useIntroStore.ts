import { create } from "zustand";

interface IntroState {
  hasPlayedIntro: boolean;
  isIntroActive: boolean;
  completeIntro: () => void;
  resetIntro: () => void;
}

export const useIntroStore = create<IntroState>((set) => ({
  hasPlayedIntro: false,
  isIntroActive: true,
  completeIntro: () =>
    set({
      hasPlayedIntro: true,
      isIntroActive: false,
    }),
  resetIntro: () =>
    set({
      hasPlayedIntro: false,
      isIntroActive: true,
    }),
}));
