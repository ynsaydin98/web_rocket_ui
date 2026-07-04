export const VersiyonKomut = {
  Versiyon: "Versiyon",
} as const;

export type VersiyonKomut = (typeof VersiyonKomut)[keyof typeof VersiyonKomut];
