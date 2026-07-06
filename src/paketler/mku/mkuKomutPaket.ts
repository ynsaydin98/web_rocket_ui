/** Manuel vana / ateşleyici aç-kapat komutlarının hedef kodları. */
export const MKUKomutHedefleri = {
  ItkiVanasi: 1,
  Atesleyici1: 2,
  Atesleyici2: 3,
} as const;

export type MKUKomutHedef =
  (typeof MKUKomutHedefleri)[keyof typeof MKUKomutHedefleri];

/** Aç / kapat komut kodları. */
export const MKUKomutTipleri = {
  Kapat: 0,
  Ac: 1,
} as const;

export type MKUKomutTipi =
  (typeof MKUKomutTipleri)[keyof typeof MKUKomutTipleri];

/** Manuel komut paneli aç-kapat komut paketi (İtki vanası, Ateşleyici-1/2). */
export type MKUKomutPaket = {
  hedef: MKUKomutHedef;
  komut: MKUKomutTipi;
};
