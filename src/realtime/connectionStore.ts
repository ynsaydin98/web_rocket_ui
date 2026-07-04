import { create } from "zustand";

export type WebSocketConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

/** Bu süre boyunca WebSocket'ten hiç mesaj gelmezse veri LED'i kırmızıya döner. */
const DATA_LIVE_TIMEOUT_MS = 2000;

type ConnectionStore = {
  status: WebSocketConnectionStatus;
  errorMessage?: string;
  /** WebSocket'ten aktif veri akıyor mu (son 2 sn içinde en az bir mesaj). */
  dataLive: boolean;
  setStatus: (status: WebSocketConnectionStatus) => void;
  setError: (message: string) => void;
  markDataReceived: () => void;
};

/**
 * dataLive'ı zaman aşımına düşüren timer'ın handle'ı. Her mesajda yalnızca
 * timer sıfırlanır; store yalnızca false->true / true->false geçişlerinde
 * güncellenir ki yüksek mesaj hızında gereksiz render tetiklenmesin.
 */
let dataLiveTimerId: number | undefined;

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  status: "idle",
  errorMessage: undefined,
  dataLive: false,

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

  markDataReceived: () => {
    if (dataLiveTimerId !== undefined) {
      window.clearTimeout(dataLiveTimerId);
    }
    dataLiveTimerId = window.setTimeout(() => {
      dataLiveTimerId = undefined;
      set({ dataLive: false });
    }, DATA_LIVE_TIMEOUT_MS);

    if (!get().dataLive) {
      set({ dataLive: true });
    }
  },
}));
