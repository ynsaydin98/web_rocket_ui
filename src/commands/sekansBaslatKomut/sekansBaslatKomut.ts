export const SekansBaslatKomut = {
  SekansBaslat: "SekansBaslat",
} as const;

export type SekansBaslatKomut =
  (typeof SekansBaslatKomut)[keyof typeof SekansBaslatKomut];
