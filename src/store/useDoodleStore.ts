import { create } from "zustand";

interface DoodleStore {
  isDoodleActive: boolean;
  toggleDoodle: () => boolean;
  setDoodleActive: (active: boolean) => void;
}

export const useDoodleStore = create<DoodleStore>((set, get) => ({
  isDoodleActive: false,
  toggleDoodle: () => {
    const next = !get().isDoodleActive;
    set({ isDoodleActive: next });
    return next;
  },
  setDoodleActive: (active: boolean) => set({ isDoodleActive: active }),
}));
