import type { OpMod } from "../config/missionControlConfig";

/**
 * MKUItkiDiagnostikPaket.itkiOpDurumlari kodunu 4 değerli görev fazına eşler.
 * PLACEHOLDER eşleme (0/1/2/3) — gerçek MKU protokol belgesi netleşince
 * yalnızca bu fonksiyonun güncellenmesi yeterli.
 * Alan okunamadıysa (undefined) faz "BEKLEMEDE" kabul edilir.
 */
export function mapItkiOpDurumlariToOpMod(
  itkiOpDurumlari: number | undefined,
): OpMod {
  switch (itkiOpDurumlari) {
    case 0:
      return "BEKLEMEDE";
    case 1:
      return "GERİ SAYIM";
    case 2:
      return "ATEŞLEME";
    case 3:
      return "TAMAMLANDI";
    default:
      return "BEKLEMEDE";
  }
}

/** Saniye cinsinden geri sayımı mm:ss metnine çevirir (negatifler 00:00'a sabitlenir). */
export function formatGeriSayim(geriSayimSn: number): string {
  const toplamSn = Number.isFinite(geriSayimSn) ? Math.max(0, geriSayimSn) : 0;
  const dk = Math.floor(toplamSn / 60);
  const sn = Math.floor(toplamSn % 60);
  return `${String(dk).padStart(2, "0")}:${String(sn).padStart(2, "0")}`;
}
