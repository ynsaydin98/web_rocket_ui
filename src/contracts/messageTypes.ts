export const MessageTypes = {
  //#region MKU
  MKUItkiDiagnostikPaket: "MKUItkiDiagnostikPaket",
  MKUYoklamaPaket: "MKUYoklamaPaket",
  MKUVersiyonPaket: "MKUVersiyonPaket",
  MKUResetPaket: "MKUResetPaket",
  MKUKomutPaket: "MKUKomutPaket",
  MKUSekansGonderPaket: "MKUSekansGonderPaket",
  MKUSekansAlPaket: "MKUSekansAlPaket",
  MKUSekansEepromYazPaket: "MKUSekansEepromYazPaket",
  MKUSekansEepromOkuPaket: "MKUSekansEepromOkuPaket",
  MKUItkiKomutaPaket: "MKUItkiKomutaPaket",
  MKUEepromPaket: "MKUEepromPaket",
  //#endregion
} as const;

export type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];
