// Batarya renk eşikleri ve durum hesabı. Bileşenden ayrı tutulur ki eşikler
// tek yerden değiştirilebilsin ve görsel bileşen salt render sorumluluğunda
// kalsın.

import { isSayisal } from "./sayisalDogrulama";

export type BataryaLimit = {
  /** Bu değer ve üzeri yeşil. */
  iyi: number;
  /** Bu değer ile `iyi` arası turuncu; altı kırmızı. */
  uyari: number;
};

export type BataryaDurum = "iyi" | "uyari" | "kritik" | "veri-yok";

/**
 * Varsayılan renk eşikleri (yüzde):
 * - yeşil:   >= 80
 * - turuncu: 50 - 79
 * - kırmızı: < 50
 */
export const BATARYA_LIMITLERI: BataryaLimit = {
  iyi: 80,
  uyari: 50,
};

/** Yüzdeyi renk durumuna eşler; okunamayan değer "veri-yok" (nötr gri) olur. */
export function hesaplaBataryaDurum(
  yuzde: number | undefined,
  limit: BataryaLimit = BATARYA_LIMITLERI,
): BataryaDurum {
  if (!isSayisal(yuzde)) return "veri-yok";
  if (yuzde >= limit.iyi) return "iyi";
  if (yuzde >= limit.uyari) return "uyari";
  return "kritik";
}
