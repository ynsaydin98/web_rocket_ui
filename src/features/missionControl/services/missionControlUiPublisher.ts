import type { MissionControlIngestModel } from "../models/missionControlIngestModel";
import { useMissionControlStore } from "../store/missionControlStore";

type LatestMissionControl = {
  model: MissionControlIngestModel;
};

let latest: LatestMissionControl | null = null;
let latestVersion = 0;
let publishedVersion = 0;
let timerId: number | undefined;

export function ingestMissionControlForUi(model: MissionControlIngestModel) {
  latest = {
    model,
  };

  latestVersion += 1;
}

export function startMissionControlUiPublisher(intervalMs = 100) {
  if (timerId !== undefined) return;

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 100;

  timerId = window.setInterval(() => {
    if (!latest) return;
    if (publishedVersion === latestVersion) return;

    publishedVersion = latestVersion;

    useMissionControlStore.getState().ingestTelemetry(latest.model);
  }, safeIntervalMs);
}

export function stopMissionControlUiPublisher() {
  if (timerId === undefined) return;

  window.clearInterval(timerId);
  timerId = undefined;
}
