// Test standı Mission Control sayfasının ham state'i. Sensör okumaları
// (cur/hist) ve görev fazı (opMod) gerçek WebSocket telemetrisinden
// missionControlUiPublisher.ts -> ingestTelemetry() ile besleniyor; yerel
// simülasyon yok. Manuel vana, acil-durdur kilidi ve aborted bayrağı yerel
// UI/güvenlik durumu — start/abort/vana komutlarının donanıma nasıl
// gönderildiği için commands/missionControlCommandFactory.ts'e bakın.

import { create } from "zustand";
import {
  ABORT_UNLOCK_MS,
  HISTORY_LENGTH,
  SENSORS,
  SENSOR_ORDER,
  type OpMod,
  type SensorId,
} from "../config/missionControlConfig";
import type { MissionControlIngestModel } from "../models/missionControlIngestModel";

export type ValveState = "open" | "closed";
export type IgniterState = "safe" | "armed" | "fired";

export type MissionControlState = {
  opMod: OpMod;
  /** Son opMod değişiminin Date.now() zaman damgası; görev saati kronometresini sürer. */
  phaseEnteredAt: number;
  aborted: boolean;
  abortUnlockUntil: number;
  manualValve: ValveState;
  cur: Record<SensorId, number>;
  hist: Record<SensorId, number[]>;

  ingestTelemetry: (model: MissionControlIngestModel) => void;
  abort: () => void;
  reset: () => void;
  setManualValve: (open: boolean) => void;
  unlockAbort: () => void;
};

function initialSensorValues(): Record<SensorId, number> {
  const cur = {} as Record<SensorId, number>;
  for (const id of SENSOR_ORDER) cur[id] = SENSORS[id].axis[0];
  return cur;
}

function initialSensorHistory(): Record<SensorId, number[]> {
  const hist = {} as Record<SensorId, number[]>;
  for (const id of SENSOR_ORDER) hist[id] = new Array(HISTORY_LENGTH).fill(SENSORS[id].axis[0]);
  return hist;
}

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
  opMod: "BEKLEMEDE",
  phaseEnteredAt: Date.now(),
  aborted: false,
  abortUnlockUntil: 0,
  manualValve: "closed",
  cur: initialSensorValues(),
  hist: initialSensorHistory(),

  ingestTelemetry: (model) => {
    const s = get();
    const cur = { ...s.cur };
    const hist = { ...s.hist };
    for (const id of SENSOR_ORDER) {
      const v = model.sensors[id];
      if (v === undefined) continue;
      cur[id] = v;
      hist[id] = [...s.hist[id].slice(1), v];
    }
    const opModChanged = model.opMod !== s.opMod;
    set({
      cur,
      hist,
      opMod: model.opMod,
      phaseEnteredAt: opModChanged ? Date.now() : s.phaseEnteredAt,
    });
  },

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
