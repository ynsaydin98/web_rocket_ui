import type { VersiyonBilgisiUiModel } from "../models/versiyonBilgisiUiModel";
import { useVersionStore } from "../store/versionStore";

let latestVersionUpdateId = 0;

export function ingestVersionForUi(model: VersiyonBilgisiUiModel) {
  latestVersionUpdateId += 1;

  useVersionStore
    .getState()
    .setVersiyonBilgisi(latestVersionUpdateId, model);
}
