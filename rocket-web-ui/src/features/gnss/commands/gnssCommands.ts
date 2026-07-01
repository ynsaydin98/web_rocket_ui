export const GnssCommands = {
  SyncGnssClock: "SyncGnssClock",
} as const;

export type GnssCommand = (typeof GnssCommands)[keyof typeof GnssCommands];
