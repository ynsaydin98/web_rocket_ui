// Göstergeler sayfasının kart tanımları. Her kart bir parametreyi büyük
// puntoyla gösterir. Canlı değer, grafik sayfasıyla ortak paket kaynak
// kayıtları (features/grafik/config/grafikKaynaklari.ts) üzerinden okunur:
// kaynakId + alanKey dolu olan kartlar o paketin son örneğinden beslenir,
// boş olanlar ilgili paket protokole eklenene kadar "--" gösterir.

import { MessageTypes } from "../../../contracts/messageTypes";
import { getGrafikKaynak } from "../../grafik/config/grafikKaynaklari";
import { SENSORS } from "../../missionControl/config/missionControlConfig";

export type GostergeGrup = "PT/TC Sensörleri" | "İMU" | "GNSS";

/** Kartın min/max ihlal sınırları. Config'de gömülüdür, kullanıcı değiştiremez. */
export type GostergeLimit = {
  min?: number;
  max?: number;
};

export type GostergeTanim = {
  id: string;
  baslik: string;
  birim: string;
  grup: GostergeGrup;
  /** Ondalık hane sayısı (varsayılan 1). */
  digit?: number;
  /** Beslendiği paket kaynağı; PT/TC-İMU-GNSS paketleri tanımlanınca doldurulacak. */
  kaynakId?: string;
  alanKey?: string;
  /** Gömülü ihlal limitleri; tanımsız kart limitsiz çalışır. */
  limit?: GostergeLimit;
};

const MKU_PAKET = MessageTypes.MKUItkiDiagnostikPaket;

export const GOSTERGE_TANIMLARI: GostergeTanim[] = [
  // PT/TC — MKUItkiDiagnostikPaket'in PT1..PT5 / TC1..TC2 alanlarından beslenir.
  // Limitler P&ID sensör konfigürasyonundaki alarm eşikleriyle gömülüdür.
  { id: "PT-01", baslik: SENSORS["PT-01"].desc, birim: "bar", grup: "PT/TC Sensörleri", kaynakId: MKU_PAKET, alanKey: "PT1", limit: { max: SENSORS["PT-01"].alarmHi } },
  { id: "PT-02", baslik: SENSORS["PT-02"].desc, birim: "bar", grup: "PT/TC Sensörleri", kaynakId: MKU_PAKET, alanKey: "PT2", limit: { max: SENSORS["PT-02"].alarmHi } },
  { id: "PT-03", baslik: SENSORS["PT-03"].desc, birim: "bar", grup: "PT/TC Sensörleri", kaynakId: MKU_PAKET, alanKey: "PT3", limit: { max: SENSORS["PT-03"].alarmHi } },
  { id: "PT-04", baslik: SENSORS["PT-04"].desc, birim: "bar", grup: "PT/TC Sensörleri", kaynakId: MKU_PAKET, alanKey: "PT4", limit: { max: SENSORS["PT-04"].alarmHi } },
  { id: "PT-05", baslik: SENSORS["PT-05"].desc, birim: "bar", grup: "PT/TC Sensörleri", kaynakId: MKU_PAKET, alanKey: "PT5", limit: { max: SENSORS["PT-05"].alarmHi } },
  { id: "TC-01", baslik: SENSORS["TC-01"].desc, birim: "°C", grup: "PT/TC Sensörleri", digit: 0, kaynakId: MKU_PAKET, alanKey: "TC1", limit: { min: SENSORS["TC-01"].warnLo, max: SENSORS["TC-01"].alarmHi } },
  { id: "TC-02", baslik: SENSORS["TC-02"].desc, birim: "°C", grup: "PT/TC Sensörleri", digit: 0, kaynakId: MKU_PAKET, alanKey: "TC2", limit: { max: SENSORS["TC-02"].alarmHi } },

  // İMU — ivme alanları paket tanımlanınca bağlanacak. Roll/pitch/yaw
  // kartları kaldırıldı; yönelim sayfa altındaki duruş kadranlarında gösterilir.
  { id: "imu-ivme-x", baslik: "İvme X", birim: "m/s²", grup: "İMU" },
  { id: "imu-ivme-y", baslik: "İvme Y", birim: "m/s²", grup: "İMU" },
  { id: "imu-ivme-z", baslik: "İvme Z", birim: "m/s²", grup: "İMU" },

  // GNSS — paket tanımlanınca bağlanacak.
  { id: "gnss-enlem", baslik: "Enlem", birim: "°", grup: "GNSS", digit: 6 },
  { id: "gnss-boylam", baslik: "Boylam", birim: "°", grup: "GNSS", digit: 6 },
  { id: "gnss-irtifa", baslik: "İrtifa", birim: "m", grup: "GNSS" },
  { id: "gnss-uydu", baslik: "Uydu Sayısı", birim: "", grup: "GNSS", digit: 0 },
];

export const GOSTERGE_GRUPLARI: GostergeGrup[] = [
  "PT/TC Sensörleri",
  "İMU",
  "GNSS",
];

/** Kartın canlı değerini paket kaynak kaydından okur; kaynak bağlı değilse undefined. */
export function getGostergeDeger(tanim: GostergeTanim): number | undefined {
  if (!tanim.kaynakId || !tanim.alanKey) return undefined;
  const snapshot = getGrafikKaynak(tanim.kaynakId)?.getSnapshot();
  const deger = snapshot?.[tanim.alanKey];
  return typeof deger === "number" && Number.isFinite(deger) ? deger : undefined;
}
