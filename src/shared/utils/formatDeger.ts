export function formatDeger(
  deger: number | undefined,
  bolen: number = 1,
  digitSayisi: number = 0,
  birim: string = "",
): string {
  const undefinedDeger = 0;

  return typeof deger === "number" && Number.isFinite(deger)
    ? `${(deger / bolen).toFixed(digitSayisi)} ${birim}`
    : `${undefinedDeger.toFixed(digitSayisi)} ${birim}`;
}
