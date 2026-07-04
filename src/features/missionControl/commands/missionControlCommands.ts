export const MissionControlCommands = {
  StartSequence: "StartSequence",
  Abort: "Abort",
  SetManualValve: "SetManualValve",
} as const;

export type MissionControlCommand =
  (typeof MissionControlCommands)[keyof typeof MissionControlCommands];
