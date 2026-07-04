export const AcilDurdurKomut = {
  AcilDurdur: "AcilDurdur",
} as const;

export type AcilDurdurKomut =
  (typeof AcilDurdurKomut)[keyof typeof AcilDurdurKomut];
