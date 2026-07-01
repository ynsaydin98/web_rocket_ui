export const MessageTypes = {
  RoketTelemetriPaket: "RoketTelemetriPaket",
  GnssPaket: "GnssPaket",
  VersiyonBilgisi: "VersiyonBilgisi",
} as const;

export type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];
