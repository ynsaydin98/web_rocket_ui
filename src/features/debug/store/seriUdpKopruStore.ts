import { create } from "zustand";
import type { SeriUdpKopruDurumu } from "../models/seriUdpKopruDurumu";

type SeriUdpKopruStore = {
  kopruyeUlasildi: boolean;
  durum?: SeriUdpKopruDurumu;
  hataMesaji?: string;
  setDurum: (durum: SeriUdpKopruDurumu) => void;
  setHata: (hataMesaji: string) => void;
};

export const useSeriUdpKopruStore = create<SeriUdpKopruStore>((set) => ({
  kopruyeUlasildi: false,

  setDurum: (durum) =>
    set({ durum: durum, kopruyeUlasildi: true, hataMesaji: undefined }),

  setHata: (hataMesaji) =>
    set({ kopruyeUlasildi: false, hataMesaji: hataMesaji }),
}));
