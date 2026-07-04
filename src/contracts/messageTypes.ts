export const MessageTypes = {
  //#region MKU
  MKUItkiDiagnostikPaket: "MKUItkiDiagnostikPaket",
  MKUYoklamaPaket: "MKUYoklamaPaket",
  MKUVersiyonPaket: "MKUVersiyonPaket",
  MKUResetPaket: "MKUResetPaket",
  //#endregion

  TestStandTelemetriPaket: "TestStandTelemetriPaket",
} as const;

export type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];
