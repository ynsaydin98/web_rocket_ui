export const RoketTelemetriCommands = {
  SoftReset: "SoftReset",
  SoftResetWithPayload: "SoftResetWithPayload",
} as const;

export type RoketTelemetriCommand =
  (typeof RoketTelemetriCommands)[keyof typeof RoketTelemetriCommands];
