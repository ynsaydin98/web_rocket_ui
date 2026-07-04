import { create } from "zustand";
import type { CommandEnvelope } from "../../../contracts/commandEnvelope";

type CommandSendStatus = "idle" | "sent" | "error";

type CommandStore = {
  lastCommand?: CommandEnvelope;
  status: CommandSendStatus;
  errorMessage?: string;
  setCommandSent: (command: CommandEnvelope) => void;
  setCommandError: (message: string) => void;
  clearCommandStatus: () => void;
};

export const useCommandStore = create<CommandStore>((set) => ({
  lastCommand: undefined,
  status: "idle",
  errorMessage: undefined,

  setCommandSent: (command) =>
    set({
      lastCommand: command,
      status: "sent",
      errorMessage: undefined,
    }),

  setCommandError: (message) =>
    set({
      status: "error",
      errorMessage: message,
    }),

  clearCommandStatus: () =>
    set({
      lastCommand: undefined,
      status: "idle",
      errorMessage: undefined,
    }),
}));
