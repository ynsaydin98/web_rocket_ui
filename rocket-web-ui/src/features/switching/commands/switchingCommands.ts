export const SwitchingCommands = {
  Close: "Close",
  Reset: "Reset",
  Open: "Open",
} as const;

export type SwitchingCommand =
  (typeof SwitchingCommands)[keyof typeof SwitchingCommands];
