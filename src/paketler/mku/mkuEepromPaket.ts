export type MKUEepromPaket = {
  varsayilan_deger1: number;
  varsayilan_deger2: number;
  varsayilan_deger3: number;
  varsayilan_deger4: number;
  varsayilan_deger5: number;
  varsayilan_deger6: number;
  varsayilan_deger7: number;

  deger1: number;
  deger2: number;
  deger3: number;
  deger4: number;
  deger5: number;
  deger6: number;
  deger7: number;
};

export type MKUEepromGonderPaket = Pick<
  MKUEepromPaket,
  "deger1" | "deger2" | "deger3" | "deger4" | "deger5" | "deger6" | "deger7"
>;
