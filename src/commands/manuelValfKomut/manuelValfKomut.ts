export const ManuelValfKomut = {
  ManuelValf: "ManuelValf",
} as const;

export type ManuelValfKomut =
  (typeof ManuelValfKomut)[keyof typeof ManuelValfKomut];
