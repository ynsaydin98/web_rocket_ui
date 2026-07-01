export function formatDeger(
  deger: number | undefined,
  bolen: number = 1,
  digitSayisi: number = 0,
): string {
  const undefinedDeger = 0;

  return typeof deger === "number" && Number.isFinite(deger)
    ? (deger / bolen).toFixed(digitSayisi)
    : undefinedDeger.toFixed(digitSayisi);
}
