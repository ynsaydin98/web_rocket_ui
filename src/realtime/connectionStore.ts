import { create } from "zustand";

export type WebSocketConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

type ConnectionStore = {
  status: WebSocketConnectionStatus;
  errorMessage?: string;
  setStatus: (status: WebSocketConnectionStatus) => void;
  setError: (message: string) => void;
};

export const useConnectionStore = create<ConnectionStore>((set) => ({
  status: "idle",
  errorMessage: undefined,

  setStatus: (status) =>
    set({
      status,
      errorMessage: undefined,
    }),

  setError: (message) =>
    set({
      status: "error",
      errorMessage: message,
    }),
}));
