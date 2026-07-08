import { useMKUItkiKomutaPaketStore } from "../../store/mku/mkuItkiKomutaPaketStore";
import type { MKUItkiKomutaPaketUiModel } from "../../ui-models/mku/mkuItkiKomutaPaketUiModel";

type LatestData = {
  model: MKUItkiKomutaPaketUiModel;
};

let latestData: LatestData | null = null;
let latestVersion = 0;
let publishedVersion = 0;
let timerId: number | undefined;

export function ingestMKUItkiKomutaPaketForUi(data: MKUItkiKomutaPaketUiModel) {
  latestData = { model: data };
  latestVersion += 1;
}

export function startMKUItkiKomutaPaketUiPublisher(intervalMs = 100) {
  if (timerId !== undefined) {
    return;
  }

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 100;

  timerId = window.setInterval(() => {
    if (!latestData) return;
    if (latestVersion === publishedVersion) return;

    publishedVersion = latestVersion;

    useMKUItkiKomutaPaketStore
      .getState()
      .setOzet(publishedVersion, latestData.model);
  }, safeIntervalMs);
}

export function stopMKUItkiKomutaPaketUiPublisher() {
  if (timerId === undefined) {
    return;
  }

  window.clearInterval(timerId);
  timerId = undefined;
}
