import { create } from "zustand";

/**
 * Grafik veri geçmişine yeni örnek eklendiğinde artan versiyon sayacı.
 * Grafik sayfası bu tek sayaca subscribe olur; geçmiş tamponlarının kendisi
 * render dışı tutulur (bkz. services/grafikVeriGecmisi.ts).
 */
type GrafikVeriStore = {
  versiyon: number;
  bump: () => void;
};

export const useGrafikVeriStore = create<GrafikVeriStore>((set) => ({
  versiyon: 0,
  bump: () => set((s) => ({ versiyon: s.versiyon + 1 })),
}));
