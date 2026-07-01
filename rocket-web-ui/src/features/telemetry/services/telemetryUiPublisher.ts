import type { RoketOzetUiModel } from "../models/roketOzetUiModel";
import { useTelemetryStore } from "../store/telemetryStore";

type LatestTelemetry = {
  model: RoketOzetUiModel;
};

let latestTelemetry: LatestTelemetry | null = null;
let latestVersion = 0;
let publishedVersion = 0;
let timerId: number | undefined;

export function ingestTelemetryForUi(telemetry: RoketOzetUiModel) {
  latestTelemetry = {
    model: telemetry,
  };

  latestVersion += 1;
}

export function startTelemetryUiPublisher(intervalMs = 100) {
  if (timerId !== undefined) return;

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 100;

  timerId = window.setInterval(() => {
    if (!latestTelemetry) return;
    if (publishedVersion === latestVersion) return;

    publishedVersion = latestVersion;

    useTelemetryStore
      .getState()
      .setRoketOzet(publishedVersion, latestTelemetry.model);
  }, safeIntervalMs);
}

export function stopTelemetryUiPublisher() {
  if (timerId === undefined) return;

  window.clearInterval(timerId);
  timerId = undefined;
}
