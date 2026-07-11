import { useMKUEepromPaketStore } from "../../store/mku/mkuEepromPaketStore";
import type { MKUEepromPaketUiModel } from "../../ui-models/mku/mkuEepromPaketUiModel";

type LatestData = {
  model: MKUEepromPaketUiModel;
};

let latestData: LatestData | null = null;
let latestVersion = 0;
let publishedVersion = 0;
let timerId: number | undefined;

export function ingestMKUEepromPaketForUi(data: MKUEepromPaketUiModel) {
  latestData = { model: data };
  latestVersion += 1;
}

export function startMKUEepromPaketUiPublisher(intervalMs = 100) {
  if (timerId !== undefined) {
    return;
  }

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 100;

  timerId = window.setInterval(() => {
    if (!latestData) return;
    if (latestVersion === publishedVersion) return;

    publishedVersion = latestVersion;

    useMKUEepromPaketStore
      .getState()
      .setOzet(publishedVersion, latestData.model);
  }, safeIntervalMs);
}

export function stopMKUEepromPaketUiPublisher() {
  if (timerId === undefined) {
    return;
  }

  window.clearInterval(timerId);
  timerId = undefined;
}
