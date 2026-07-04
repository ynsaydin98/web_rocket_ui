// Mission Control sayfasının YEREL UI/güvenlik durumu. Telemetri artık MKU
// itki diagnostik boru hattından geliyor (paketler/mku/mkuItkiDiagnostikPaket
// -> mapper -> storeServices publisher -> store/mku/mkuItkiDiagnostikPaketStore);
// bu store yalnızca acil-durdur kilidi, aborted bayrağı ve manuel vana
// anahtarının yerel durumunu tutar. Komutların donanıma nasıl gönderildiği
// için src/commands/{sekansBaslatKomut,acilDurdurKomut,manuelValfKomut}
// klasörlerine bakın.

import { create } from "zustand";
import { ABORT_UNLOCK_MS } from "../config/missionControlConfig";

export type ValveState = "open" | "closed";
export type IgniterState = "safe" | "armed" | "fired";

export type MissionControlState = {
  aborted: boolean;
  abortUnlockUntil: number;
  manualValve: ValveState;

  abort: () => void;
  reset: () => void;
  setManualValve: (open: boolean) => void;
  unlockAbort: () => void;
};

/**
 * unlockAbort()'un otomatik kilitlenme zamanlayıcısının handle'ı. UI
 * publisher'lardaki timerId deseni gibi modül seviyesinde tutulur — bir
 * timer handle'ı component'lerin subscribe olacağı bir şey değildir.
 */
let abortRelockTimerId: number | undefined;

function clearAbortRelockTimer() {
  if (abortRelockTimerId === undefined) return;
  window.clearTimeout(abortRelockTimerId);
  abortRelockTimerId = undefined;
}

export const useMissionControlStore = create<MissionControlState>((set, get) => ({
  aborted: false,
  abortUnlockUntil: 0,
  manualValve: "closed",

  abort: () => {
    const s = get();
    if (s.aborted) return;
    if (!(s.abortUnlockUntil > Date.now())) return;
    clearAbortRelockTimer();
    set({ aborted: true, manualValve: "closed", abortUnlockUntil: 0 });
  },

  reset: () => {
    clearAbortRelockTimer();
    set({ aborted: false, abortUnlockUntil: 0 });
  },

  setManualValve: (open) => {
    const next: ValveState = open ? "open" : "closed";
    if (get().manualValve === next) return;
    set({ manualValve: next });
  },

  unlockAbort: () => {
    const s = get();
    if (s.aborted) return;
    if (s.abortUnlockUntil > Date.now()) return;
    clearAbortRelockTimer();
    set({ abortUnlockUntil: Date.now() + ABORT_UNLOCK_MS });
    abortRelockTimerId = window.setTimeout(() => {
      abortRelockTimerId = undefined;
      set({ abortUnlockUntil: 0 });
    }, ABORT_UNLOCK_MS);
  },
}));
