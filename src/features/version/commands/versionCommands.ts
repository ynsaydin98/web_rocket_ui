export const VersionCommands = {
  VersiyonSorgu: "VersiyonSorgu",
} as const;

export type VersionCommand =
  (typeof VersionCommands)[keyof typeof VersionCommands];
