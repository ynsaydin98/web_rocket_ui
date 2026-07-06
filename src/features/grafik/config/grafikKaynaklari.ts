// Grafik sayfasının paket kaynak kayıtları. Yeni bir paket için grafik
// desteği eklemek: paketin store'u üzerinden getSnapshot/subscribe bağlayan
// bir kayıt eklemek yeterli — grafik oluşturucu arayüzü ve veri geçmişi
// servisi bu listeyi otomatik kullanır.

import { MessageTypes } from "../../../contracts/messageTypes";
import { useMKUItkiDiagnostikPaketStore } from "../../../store/mku/mkuItkiDiagnostikPaketStore";

export type GrafikAlanTanim = {
  key: string;
  label: string;
};

export type GrafikKaynakTanim = {
  /** MessageTypes değeriyle aynı kimlik. */
  id: string;
  label: string;
  /** Grafiğe seçilebilir sayısal alanlar. */
  alanlar: GrafikAlanTanim[];
  /** Kaynağın son örneğini okur (henüz veri yoksa undefined). */
  getSnapshot: () => Record<string, number> | undefined;
  /** Yeni örnek geldiğinde çağrılacak dinleyiciyi bağlar; unsubscribe döner. */
  subscribe: (onSample: () => void) => () => void;
};

export const GRAFIK_KAYNAKLARI: GrafikKaynakTanim[] = [
  {
    id: MessageTypes.MKUItkiDiagnostikPaket,
    label: "MKU İtki Diagnostik Paketi",
    alanlar: [
      { key: "itkiOpDurumlari", label: "İtki Operasyon Durumu" },
      { key: "opGecenSure_ms", label: "Operasyon Geçen Süre (ms)" },
      { key: "itkiBaslatmaGeriSayim_sn", label: "İtki Geri Sayımı (sn)" },
      { key: "acilDurdurDurum", label: "Acil Durdur Durumu" },
      { key: "acilDurdurBasla", label: "Acil Durdur Başlatma" },
      { key: "komutItkiSuresi_ms", label: "Komut İtki Süresi (ms)" },
      { key: "tahliyeGecenSure", label: "Tahliye Geçen Süre" },
      { key: "itkiGecenSure_ms", label: "İtki Geçen Süre (ms)" },
      { key: "kalanItkiSuresi_ms", label: "Kalan İtki Süresi (ms)" },
      { key: "kalanTahliyeSuresi_ms", label: "Kalan Tahliye Süresi (ms)" },
      { key: "kalanAcilDurdurSuresi_ms", label: "Kalan Acil Durdur Süresi (ms)" },
      { key: "acilDurdurGecenSure_ms", label: "Acil Durdur Geçen Süre (ms)" },
      { key: "sistemSaati_ms", label: "Sistem Saati (ms)" },
      { key: "sonIslemSuresi_ms", label: "Son İşlem Süresi (ms)" },
      { key: "islemDurumlari", label: "İşlem Durumları" },
      { key: "valfDurum_Igniter1", label: "Valf: Ateşleyici 1" },
      { key: "valfDurum_Igniter2", label: "Valf: Ateşleyici 2" },
      { key: "valfDurum_OksitleyiciValf", label: "Valf: Oksitleyici" },
      { key: "valfDurum_OksitleyiciYedekValf", label: "Valf: Oksitleyici Yedek" },
      { key: "itkiSistemDurum", label: "İtki Sistem Durumu" },
      { key: "itkiOperasyonCevrim", label: "İtki Operasyon Çevrimi" },
      { key: "itkiHazirlikCevrim", label: "İtki Hazırlık Çevrimi" },
      { key: "itkiTahliyeDurum", label: "İtki Tahliye Durumu" },
      { key: "aphisDurum", label: "APHİS Durumu" },
      { key: "rksDurum", label: "RKS Durumu" },
      { key: "valfKomutMod", label: "Valf Komut Modu" },
      { key: "seciliAtesleyici", label: "Seçili Ateşleyici" },
      { key: "imu_pitch", label: "İMU Pitch (°)" },
      { key: "imu_roll", label: "İMU Roll (°)" },
      { key: "imu_yaw", label: "İMU Yaw (°)" },
      { key: "PT1", label: "PT1 Basınç (bar)" },
      { key: "PT2", label: "PT2 Basınç (bar)" },
      { key: "PT3", label: "PT3 Basınç (bar)" },
      { key: "PT4", label: "PT4 Basınç (bar)" },
      { key: "PT5", label: "PT5 Basınç (bar)" },
      { key: "TC1", label: "TC1 Sıcaklık (°C)" },
      { key: "TC2", label: "TC2 Sıcaklık (°C)" },
    ],
    getSnapshot: () => {
      const ozet = useMKUItkiDiagnostikPaketStore.getState().ozet;
      return ozet ? { ...ozet } : undefined;
    },
    subscribe: (onSample) =>
      useMKUItkiDiagnostikPaketStore.subscribe((state, prevState) => {
        if (state.lastUpdateId !== prevState.lastUpdateId) onSample();
      }),
  },
];

export function getGrafikKaynak(id: string): GrafikKaynakTanim | undefined {
  return GRAFIK_KAYNAKLARI.find((kaynak) => kaynak.id === id);
}

export function getGrafikAlanLabel(kaynakId: string, alanKey: string): string {
  const kaynak = getGrafikKaynak(kaynakId);
  return kaynak?.alanlar.find((alan) => alan.key === alanKey)?.label ?? alanKey;
}
