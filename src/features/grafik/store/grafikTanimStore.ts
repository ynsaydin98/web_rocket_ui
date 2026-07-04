import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MessageTypes } from "../../../contracts/messageTypes";

export type GrafikTanim = {
  id: string;
  baslik: string;
  /** GRAFIK_KAYNAKLARI içindeki kaynak kimliği (MessageTypes değeri). */
  kaynakId: string;
  /** Kaynağın çizilecek alan key'leri; sıra seri rengi sırasını belirler. */
  alanlar: string[];
};

/** İlk açılışta gösterilen 4 grafik (2x2 grid). Kullanıcı düzenledikçe localStorage'da saklanır. */
const VARSAYILAN_GRAFIKLER: GrafikTanim[] = [
  {
    id: "varsayilan-geri-sayim",
    baslik: "İtki Başlatma Geri Sayımı",
    kaynakId: MessageTypes.MKUItkiDiagnostikPaket,
    alanlar: ["itkiBaslatmaGeriSayim_sn"],
  },
  {
    id: "varsayilan-itki-sureleri",
    baslik: "İtki Süreleri",
    kaynakId: MessageTypes.MKUItkiDiagnostikPaket,
    alanlar: ["itkiGecenSure_ms", "kalanItkiSuresi_ms"],
  },
  {
    id: "varsayilan-operasyon-suresi",
    baslik: "Operasyon Geçen Süre",
    kaynakId: MessageTypes.MKUItkiDiagnostikPaket,
    alanlar: ["opGecenSure_ms"],
  },
  {
    id: "varsayilan-valf-durumlari",
    baslik: "Valf Durumları",
    kaynakId: MessageTypes.MKUItkiDiagnostikPaket,
    alanlar: [
      "valfDurum_OksitleyiciValf",
      "valfDurum_OksitleyiciYedekValf",
      "valfDurum_Igniter1",
      "valfDurum_Igniter2",
    ],
  },
];

type GrafikTanimStore = {
  grafikler: GrafikTanim[];
  addGrafik: (tanim: Omit<GrafikTanim, "id">) => void;
  removeGrafik: (id: string) => void;
};

export const useGrafikTanimStore = create<GrafikTanimStore>()(
  persist(
    (set) => ({
      grafikler: VARSAYILAN_GRAFIKLER,

      addGrafik: (tanim) =>
        set((s) => ({
          grafikler: [
            ...s.grafikler,
            { ...tanim, id: `grafik-${Date.now()}` },
          ],
        })),

      removeGrafik: (id) =>
        set((s) => ({
          grafikler: s.grafikler.filter((grafik) => grafik.id !== id),
        })),
    }),
    { name: "grafik-tanimlari" },
  ),
);
