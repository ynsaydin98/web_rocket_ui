import type { MKUVersiyonPaket } from "../../paketler/mku/mkuVersiyonPaket";
import type { MKUVersiyonPaketUiModel } from "../../ui-models/mku/mkuVersiyonPaketUiModel";

export function mapMKUVersiyonPaketToOzet(
  mesaj: MKUVersiyonPaket,
): MKUVersiyonPaketUiModel {
  return {
    major: mesaj.major,
    minor: mesaj.minor,
    build: mesaj.build,
    revision: mesaj.revision,
    versiyonText: `${mesaj.major}.${mesaj.minor}.${mesaj.build}.${mesaj.revision}`,
  };
}
