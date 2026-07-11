export const MKUEepromKomut = {
  Al: "Al",
  Gonder: "Gonder",
} as const;

export type MKUEepromKomut =
  (typeof MKUEepromKomut)[keyof typeof MKUEepromKomut];
