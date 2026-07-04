import { useMKUVersiyonPaketStore } from "../../store/mku/mkuVersiyonPaketStore";
import type { MKUVersiyonPaketUiModel } from "../../ui-models/mku/mkuVersiyonPaketUiModel";

type LatestData = {
  model: MKUVersiyonPaketUiModel;
};

let latestData: LatestData | null = null;
let latestVersion = 0;
let publishedVersion = 0;
let timerId: number | undefined;

export function ingestMKUVersiyonPaketForUi(data: MKUVersiyonPaketUiModel) {
  latestData = { model: data };
  latestVersion += 1;
}

export function startMKUVersiyonPaketUiPublisher(intervalMs = 100) {
  if (timerId !== undefined) {
    return;
  }

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 100;

  timerId = window.setInterval(() => {
    if (!latestData) return;
    if (latestVersion === publishedVersion) return;

    publishedVersion = latestVersion;

    useMKUVersiyonPaketStore
      .getState()
      .setOzet(publishedVersion, latestData.model);
  }, safeIntervalMs);
}

export function stopMKUVersiyonPaketUiPublisher() {
  if (timerId !== undefined) {
    return;
  }

  window.clearInterval(timerId);
  timerId = undefined;
}
