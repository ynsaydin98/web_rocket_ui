export const ResetKomut = {
  Reset: "Reset",
} as const;

export type ResetKomut = (typeof ResetKomut)[keyof typeof ResetKomut];
