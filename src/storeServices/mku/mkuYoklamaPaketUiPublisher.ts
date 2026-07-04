import { useMKUYoklamaPaketStore } from "../../store/mku/mkuYoklamaPaketStore";
import type { MKUYoklamaPaketUiModel } from "../../ui-models/mku/mkuYoklamaPaketUiModel";

type LatestData = {
  model: MKUYoklamaPaketUiModel;
};

let latestData: LatestData | null = null;
let latestVersion = 0;
let publishedVersion = 0;
let timerId: number | undefined;

export function ingestMKUYoklamaPaketForUi(data: MKUYoklamaPaketUiModel) {
  latestData = { model: data };
  latestVersion += 1;
}

export function startMKUYoklamaPaketUiPublisher(intervalMs = 100) {
  if (timerId !== undefined) {
    return;
  }

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 100;

  timerId = window.setInterval(() => {
    if (!latestData) return;
    if (latestVersion === publishedVersion) return;

    publishedVersion = latestVersion;

    useMKUYoklamaPaketStore
      .getState()
      .setOzet(publishedVersion, latestData.model);
  }, safeIntervalMs);
}

export function stopMKUYoklamaPaketUiPublisher() {
  if (timerId !== undefined) {
    return;
  }

  window.clearInterval(timerId);
  timerId = undefined;
}
