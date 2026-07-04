export const YoklamaKomut = {
  Yoklama: "Yoklama",
} as const;

export type YoklamaKomut = (typeof YoklamaKomut)[keyof typeof YoklamaKomut];
