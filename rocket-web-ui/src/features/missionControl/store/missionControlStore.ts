// Raw simulation state for the propulsion test-stand Mission Control demo.
//
// This mirrors the original design's Component class: a small state machine
// (IDLE -> PRECHECK -> ARM -> BACKUP -> MAINVALVE -> IGNITION -> BURN ->
// SHUTDOWN) driving simulated sensor values, plus manual valve and
// emergency-stop lock controls. It is a self-contained demo (not wired to
// the real WebSocket telemetry), so its state lives in its own store rather
// than the telemetry feature's.

import { create } from "zustand";
import {
  ABORT_UNLOCK_MS,
  HISTORY_LENGTH,
  IGNITION_STEP_INDEX,
  SENSORS,
  SENSOR_ORDER,
  STEPS,
  TARGETS,
  TICK_MS,
  type MissionStatus,
  type Phase,
  type SensorId,
} from "../config/missionControlConfig";

export type ValveState = "open" | "closed";
export type IgniterState = "safe" | "armed" | "fired";

export type MissionControlState = {
  status: MissionStatus;
  running: boolean;
  aborted: boolean;
  abortPhase: boolean;
  stepIndex: number;
  stepElapsed: number;
  clock: number;
  valves: { main: ValveState; backup: ValveState };
  manualValve: ValveState;
  abortUnlockUntil: number;
  igniters: { ig1: IgniterState; ig2: IgniterState };
  cur: Record<SensorId, number>;
  hist: Record<SensorId, number[]>;

  start: () => void;
  abort: () => void;
  reset: () => void;
  setManualValve: (open: boolean) => void;
  unlockAbort: () => void;
  tick: () => void;
};

function initialSensorValues(): Record<SensorId, number> {
  const cur = {} as Record<SensorId, number>;
  for (const id of SENSOR_ORDER) cur[id] = TARGETS.IDLE[id];
  return cur;
}

function initialSensorHistory(): Record<SensorId, number[]> {
  const hist = {} as Record<SensorId, number[]>;
  for (const id of SENSOR_ORDER) hist[id] = new Array(HISTORY_LENGTH).fill(TARGETS.IDLE[id]);
  return hist;
}

function currentPhase(state: Pick<MissionControlState, "abortPhase" | "running" | "stepIndex">): Phase {
  if (state.abortPhase) return "ABORT";
  return state.running ? STEPS[state.stepIndex].id : "IDLE";
}

function applyStepEntry(id: Phase, patch: Partial<MissionControlState>) {
  switch (id) {
    case "PRECHECK":
      patch.status = "SAFE";
      break;
    case "ARM":
      patch.status = "ARMED";
      patch.igniters = { ig1: "armed", ig2: "armed" };
      break;
    case "BACKUP":
      patch.status = "ARMED";
      break;
    case "MAINVALVE":
      patch.status = "ARMED";
      break;
    case "IGNITION":
      patch.status = "FIRING";
      patch.igniters = { ig1: "fired", ig2: "fired" };
      break;
    case "BURN":
      patch.status = "FIRING";
      break;
    case "SHUTDOWN":
      patch.status = "SAFE";
      patch.igniters = { ig1: "safe", ig2: "safe" };
      break;
  }
}

export const useMissionControlStore = create<MissionControlState>((set, get) => ({
  status: "SAFE",
  running: false,
  aborted: false,
  abortPhase: false,
  stepIndex: 0,
  stepElapsed: 0,
  clock: 0,
  valves: { main: "closed", backup: "closed" },
  manualValve: "open",
  abortUnlockUntil: 0,
  igniters: { ig1: "safe", ig2: "safe" },
  cur: initialSensorValues(),
  hist: initialSensorHistory(),

  start: () => {
    const s = get();
    if (s.running || s.aborted) return;
    const patch: Partial<MissionControlState> = {
      running: true,
      stepIndex: 1,
      stepElapsed: 0,
      valves: { ...s.valves },
      igniters: { ...s.igniters },
    };
    applyStepEntry("PRECHECK", patch);
    set(patch);
  },

  abort: () => {
    const s = get();
    if (s.aborted) return;
    if (!(s.abortUnlockUntil > Date.now())) return;
    set({
      running: false,
      aborted: true,
      abortPhase: true,
      status: "ABORT",
      valves: { main: "closed", backup: "closed" },
      manualValve: "closed",
      igniters: { ig1: "safe", ig2: "safe" },
    });
  },

  reset: () => {
    set({
      aborted: false,
      abortPhase: false,
      running: false,
      stepIndex: 0,
      stepElapsed: 0,
      status: "SAFE",
      clock: 0,
      manualValve: "open",
    });
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
    set({ abortUnlockUntil: Date.now() + ABORT_UNLOCK_MS });
  },

  tick: () => {
    const s = get();
    const dt = TICK_MS / 1000;
    const phase = currentPhase(s);
    const target = TARGETS[phase];

    const cur = { ...s.cur };
    const hist = { ...s.hist };
    for (const id of SENSOR_ORDER) {
      const cfg = SENSORS[id];
      const rate = Math.min(1, cfg.k * dt);
      let v = cur[id] + (target[id] - cur[id]) * rate;
      const noiseAmp = phase === "IDLE" || phase === "ABORT" ? cfg.noise * 0.3 : cfg.noise;
      v += (Math.random() - 0.5) * noiseAmp;
      cur[id] = v;
      hist[id] = [...s.hist[id].slice(1), v];
    }

    let running = s.running;
    let stepIndex = s.stepIndex;
    let stepElapsed = s.stepElapsed;
    const entryPatch: Partial<MissionControlState> = {};
    let valves = s.valves;
    let igniters = s.igniters;
    let status = s.status;

    if (running) {
      stepElapsed += dt;
      const step = STEPS[stepIndex];
      if (stepElapsed >= step.dur) {
        if (stepIndex >= STEPS.length - 1) {
          running = false;
          status = "SAFE";
          stepIndex = 0;
          stepElapsed = 0;
        } else {
          stepIndex += 1;
          stepElapsed = 0;
          const nextId = STEPS[stepIndex].id;
          if (nextId === "BACKUP") valves = { ...valves, backup: "open" };
          if (nextId === "MAINVALVE") valves = { ...valves, main: "open" };
          if (nextId === "SHUTDOWN") valves = { main: "closed", backup: "closed" };
          applyStepEntry(nextId, entryPatch);
          if (entryPatch.status) status = entryPatch.status;
          if (entryPatch.igniters) igniters = entryPatch.igniters;
        }
      }
    }

    let clock = s.clock;
    if (running) {
      if (stepIndex < IGNITION_STEP_INDEX) {
        let rem = STEPS[stepIndex].dur - stepElapsed;
        for (let i = stepIndex + 1; i < IGNITION_STEP_INDEX; i++) rem += STEPS[i].dur;
        clock = -rem;
      } else {
        let since = stepElapsed;
        for (let i = IGNITION_STEP_INDEX; i < stepIndex; i++) since += STEPS[i].dur;
        clock = since;
      }
    }

    set({ cur, hist, running, stepIndex, stepElapsed, clock, valves, igniters, status });
  },
}));
