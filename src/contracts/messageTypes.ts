export const MessageTypes = {
  //#region MKU
  MKUItkiDiagnostikPaket: "MKUItkiDiagnostikPaket",
  MKUYoklamaPaket: "MKUYoklamaPaket",
  MKUVersiyonPaket: "MKUVersiyonPaket",
  MKUResetPaket: "MKUResetPaket",
  //#endregion
} as const;

export type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];
