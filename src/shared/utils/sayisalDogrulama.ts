// Sayısal telemetri alanları için ortak doğrulama yardımcıları.
//
// Servis tarafı, sözleşmede sayısal olan bir alanı sensör okunamadığında ya da
// hesap tanımsız kaldığında `null` veya `NaN` olarak gönderebiliyor. Bu durum
// paketin tamamını geçersiz kılmamalı: yalnızca ilgili alan "veri yok" sayılır,
// paketin geri kalanı UI'a akmaya devam eder.
//
// Alanın hiç gelmemesi (undefined) ayrı bir durumdur; sözleşme uyuşmazlığı
// sayılır ve paket geçersiz kabul edilir.

/** WebSocket'ten gelen sayısal alan: değer okunamadığında null veya NaN olabilir. */
export type SayisalAlan = number | null;

/**
 * Alan sayısal sözleşmeye uyuyor mu?
 * `null` ve `NaN` kabul edilir (veri yok), eksik alan kabul edilmez.
 */
export function isSayisalAlan(deger: unknown): deger is SayisalAlan {
  return deger === null || typeof deger === "number";
}

/**
 * Opsiyonel sayısal alan doğrulaması: `null`/`NaN`'a ek olarak alanın hiç
 * gelmemesi de kabul edilir. Servis tarafına yeni eklenen ve henüz her paketle
 * gönderilmeyen alanlar için kullanılır; alan yayına girene kadar paketlerin
 * düşmesini engeller.
 */
export function isOpsiyonelSayisalAlan(
  deger: unknown,
): deger is SayisalAlan | undefined {
  return deger === undefined || isSayisalAlan(deger);
}

/** Sabit uzunluklu sayısal dizi alanı; elemanlar null/NaN olabilir. */
export function isSayisalAlanDizisi(deger: unknown, uzunluk: number): boolean {
  return (
    Array.isArray(deger) &&
    deger.length === uzunluk &&
    deger.every((eleman) => isSayisalAlan(eleman))
  );
}

/** Kullanılabilir sayısal değer mi? null, undefined, NaN ve Infinity false döner. */
export function isSayisal(deger: unknown): deger is number {
  return typeof deger === "number" && Number.isFinite(deger);
}

/** Sayısal alanı UI değerine çevirir; okunabilir değer yoksa undefined döner. */
export function sayisalDeger(
  deger: SayisalAlan | undefined,
): number | undefined {
  return isSayisal(deger) ? deger : undefined;
}

/** Sayısal alan dizisini UI değerlerine çevirir; okunamayan elemanlar undefined olur. */
export function sayisalDegerDizisi(
  degerler: readonly (SayisalAlan | undefined)[],
): (number | undefined)[] {
  return degerler.map((deger) => sayisalDeger(deger));
}
