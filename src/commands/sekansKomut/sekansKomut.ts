export const SekansKomut = {
  SekansGonder: "SekansGonder",
  SekansAl: "SekansAl",
  SekansEepromYaz: "SekansEepromYaz",
  SekansEepromOku: "SekansEepromOku",
} as const;

export type SekansKomut = (typeof SekansKomut)[keyof typeof SekansKomut];
