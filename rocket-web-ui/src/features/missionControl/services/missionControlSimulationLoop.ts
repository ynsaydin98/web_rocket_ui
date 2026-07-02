// Drives the Mission Control demo's simulation tick on an interval, the
// same way telemetryUiPublisher.ts drives real telemetry into its store.
// Started/stopped by the page itself so the simulation only runs while the
// Mission Control tab is mounted.

import { TICK_MS } from "../config/missionControlConfig";
import { useMissionControlStore } from "../store/missionControlStore";

let timerId: number | undefined;

export function startMissionControlSimulation() {
  if (timerId !== undefined) return;
  timerId = window.setInterval(() => {
    useMissionControlStore.getState().tick();
  }, TICK_MS);
}

export function stopMissionControlSimulation() {
  if (timerId === undefined) return;
  window.clearInterval(timerId);
  timerId = undefined;
}
