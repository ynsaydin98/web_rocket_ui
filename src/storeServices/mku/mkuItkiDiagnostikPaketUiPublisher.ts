import { useMKUItkiDiagnostikPaketStore } from "../../store/mku/mkuItkiDiagnostikPaketStore";
import type { MKUItkiDiagnostikPaketUiModel } from "../../ui-models/mku/mkuItkiDiagnostikPaketUiModel";

type LatestData = {
  model: MKUItkiDiagnostikPaketUiModel;
};

let latestData: LatestData | null = null;
let latestVersion = 0;
let publishedVersion = 0;
let timerId: number | undefined;

export function ingestMKUItkiDiagnostikPaketForUi(
  data: MKUItkiDiagnostikPaketUiModel,
) {
  latestData = { model: data };
  latestVersion += 1;
}

export function startMKUItkiDiagnostikPaketUiPublisher(intervalMs = 100) {
  if (timerId !== undefined) {
    return;
  }

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 100;

  timerId = window.setInterval(() => {
    if (!latestData) return;
    if (latestVersion === publishedVersion) return;

    publishedVersion = latestVersion;

    useMKUItkiDiagnostikPaketStore
      .getState()
      .setOzet(publishedVersion, latestData.model);
  }, safeIntervalMs);
}

export function stopMKUItkiDiagnostikPaketUiPublisher() {
  if (timerId !== undefined) {
    return;
  }

  window.clearInterval(timerId);
  timerId = undefined;
}
