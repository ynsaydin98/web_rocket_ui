import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GostergeLimit = {
  min?: number;
  max?: number;
};

type GostergeLimitStore = {
  /** Kart id -> kullanıcı girişli limit. Kaydı olmayan kart limitsizdir. */
  limitler: Record<string, GostergeLimit>;
  setLimit: (id: string, limit: GostergeLimit) => void;
  clearLimit: (id: string) => void;
};

export const useGostergeLimitStore = create<GostergeLimitStore>()(
  persist(
    (set) => ({
      limitler: {},

      setLimit: (id, limit) =>
        set((s) => ({ limitler: { ...s.limitler, [id]: limit } })),

      clearLimit: (id) =>
        set((s) => {
          const sonraki = { ...s.limitler };
          delete sonraki[id];
          return { limitler: sonraki };
        }),
    }),
    { name: "gosterge-limitleri" },
  ),
);
