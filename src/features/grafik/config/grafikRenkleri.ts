/**
 * Grafik serileri için SABİT SIRALI kategori paleti. Slotlar seriye eklenme
 * sırasına göre atanır, asla döngüye sokulmaz; bu yüzden bir grafikte en
 * fazla GRAFIK_MAX_SERI alan seçilebilir.
 *
 * Palet, dataviz doğrulayıcısıyla (#0a1017 koyu panel yüzeyine karşı)
 * doğrulanmıştır: lightness bandı, chroma tabanı, renk körlüğü ayrımı ve
 * kontrast kontrollerinin tümü geçer.
 */
export const GRAFIK_SERI_RENKLERI = [
  "#3987e5", // mavi
  "#199e70", // deniz yeşili
  "#c98500", // sarı
  "#e66767", // kırmızı
  "#9085e9", // mor
  "#d95926", // turuncu
] as const;

export const GRAFIK_MAX_SERI = GRAFIK_SERI_RENKLERI.length;
