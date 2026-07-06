export const MKUKomut = {
  VanaKomut: "VanaKomut",
} as const;

export type MKUKomut = (typeof MKUKomut)[keyof typeof MKUKomut];
