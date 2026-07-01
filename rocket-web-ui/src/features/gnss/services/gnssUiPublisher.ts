import type { GnssOzetUiModel } from "../models/gnssOzetUiModel";
import { useGnssStore } from "../store/gnssStore";

type LatestGnss = {
  model: GnssOzetUiModel;
};

let latestGnss: LatestGnss | null = null;
let latestVersion = 0;
let publishedVersion = 0;
let timerId: number | undefined;

export function ingestGnssForUi(model: GnssOzetUiModel) {
  latestGnss = {
    model,
  };

  latestVersion += 1;
}

export function startGnssUiPublisher(intervalMs = 100) {
  if (timerId !== undefined) return;

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 100;

  timerId = window.setInterval(() => {
    if (!latestGnss) return;
    if (publishedVersion === latestVersion) return;

    publishedVersion = latestVersion;

    useGnssStore.getState().setGnssOzet(publishedVersion, latestGnss.model);
  }, safeIntervalMs);
}

export function stopGnssUiPublisher() {
  if (timerId === undefined) return;

  window.clearInterval(timerId);
  timerId = undefined;
}
