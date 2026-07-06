/** Sekans tablosundaki valf seçimi kodları. 0 = seçim yok. */
export const SekansValfSecimleri = {
  SecimYok: 0,
  ItkiVanasi: 1,
  YedekVana: 2,
  Atesleyici1: 3,
  Atesleyici2: 4,
} as const;

export type SekansValfSecimi =
  (typeof SekansValfSecimleri)[keyof typeof SekansValfSecimleri];

/** Sekans tablosundaki komut seçimi kodları. 0 = seçim yok. */
export const SekansKomutSecimleri = {
  SecimYok: 0,
  Ac: 1,
  Kapat: 2,
} as const;

export type SekansKomutSecimi =
  (typeof SekansKomutSecimleri)[keyof typeof SekansKomutSecimleri];

/** Sekans tablosunun tek satırı: işlem no + valf + komut + süre. */
export type MKUSekansAdim = {
  islemNo: number;
  valfSecimi: SekansValfSecimi;
  komutSecimi: SekansKomutSecimi;
  sure_ms: number;
};

/** Sekans tablosunu üniteye (RAM) gönderen paket. */
export type MKUSekansGonderPaket = {
  adimlar: MKUSekansAdim[];
};
