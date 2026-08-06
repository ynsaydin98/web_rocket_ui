import { useModemDeviceIpPaketStore } from "../../store/modem/modemDeviceIpPaketStore";
import type { ModemDeviceIpPaketUiModel } from "../../ui-models/modem/modemDeviceIpPaketUiModel";

type LatestData = {
  model: ModemDeviceIpPaketUiModel;
};

let latestData: LatestData | null = null;
let latestVersion = 0;
let publishedVersion = 0;
let timerId: number | undefined;

export function ingestModemDeviceIpPaketForUi(data: ModemDeviceIpPaketUiModel) {
  latestData = { model: data };
  latestVersion += 1;
}

export function startModemDeviceIpPaketUiPublisher(intervalMs = 100) {
  if (timerId !== undefined) {
    return;
  }

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 100;

  timerId = window.setInterval(() => {
    if (!latestData) return;
    if (latestVersion === publishedVersion) return;

    publishedVersion = latestVersion;

    useModemDeviceIpPaketStore
      .getState()
      .setOzet(publishedVersion, latestData.model);
  }, safeIntervalMs);
}

export function stopModemDeviceIpPaketUiPublisher() {
  if (timerId === undefined) {
    return;
  }

  window.clearInterval(timerId);
  timerId = undefined;
}
