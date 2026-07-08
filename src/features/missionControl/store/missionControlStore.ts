// Mission Control sayfasının YEREL UI/güvenlik durumu. Telemetri artık MKU
// itki diagnostik boru hattından geliyor (paketler/mku/mkuItkiDiagnostikPaket
// -> mapper -> storeServices publisher -> store/mku/mkuItkiDiagnostikPaketStore);
// bu store yalnızca acil-durdur kilidi, yerel manuel emniyet durumu ve manuel vana
// anahtarının yerel durumunu tutar. Komutların donanıma nasıl gönderildiği
// için src/commands/{sekansBaslatKomut,acilDurdurKomut,manuelValfKomut}
// klasörlerine bakın.

import { create } from "zustand";
import { ABORT_UNLOCK_MS } from "../config/missionControlConfig";

export type ValveState = "open" | "closed";
export type IgniterState = "safe" | "armed" | "fired";

export type MissionControlState = {
  abortUnlockUntil: number;
  manualValve: ValveState;

  abort: () => void;
  setManualValve: (open: boolean) => void;
  lockAbort: () => void;
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
  abortUnlockUntil: 0,
  manualValve: "closed",

  abort: () => {
    const s = get();
    if (!(s.abortUnlockUntil > Date.now())) return;
    clearAbortRelockTimer();
    set({ manualValve: "closed", abortUnlockUntil: 0 });
  },

  setManualValve: (open) => {
    const next: ValveState = open ? "open" : "closed";
    if (get().manualValve === next) return;
    set({ manualValve: next });
  },

  lockAbort: () => {
    clearAbortRelockTimer();
    set({ abortUnlockUntil: 0 });
  },

  unlockAbort: () => {
    const s = get();
    if (s.abortUnlockUntil > Date.now()) return;
    clearAbortRelockTimer();
    set({ abortUnlockUntil: Date.now() + ABORT_UNLOCK_MS });
    abortRelockTimerId = window.setTimeout(() => {
      abortRelockTimerId = undefined;
      set({ abortUnlockUntil: 0 });
    }, ABORT_UNLOCK_MS);
  },
}));
