import type { VersiyonBilgisiMesaj } from "../messages/versiyonBilgisiMesaj";
import type { VersiyonBilgisiUiModel } from "../models/versiyonBilgisiUiModel";

export function mapVersiyonBilgisiToUiModel(
  mesaj: VersiyonBilgisiMesaj,
): VersiyonBilgisiUiModel {
  return {
    versiyon:
      mesaj.versiyon ??
      mesaj.version ??
      mesaj.firmwareVersion ??
      mesaj.softwareVersion ??
      "Bilinmiyor",
    buildBilgisi: mesaj.buildNumber ?? mesaj.buildDate,
  };
}
