import type { MKUVersiyonPaket } from "../../paketler/mku/mkuVersiyonPaket";
import { sayisalDeger } from "../../shared/utils/sayisalDogrulama";
import type { MKUVersiyonPaketUiModel } from "../../ui-models/mku/mkuVersiyonPaketUiModel";

/** Okunamayan versiyon parçası metinde "?" olarak gösterilir. */
const OKUNAMAYAN_PARCA = "?";

export function mapMKUVersiyonPaketToOzet(
  mesaj: MKUVersiyonPaket,
): MKUVersiyonPaketUiModel {
  const major = sayisalDeger(mesaj.major);
  const minor = sayisalDeger(mesaj.minor);
  const build = sayisalDeger(mesaj.build);
  const revision = sayisalDeger(mesaj.revision);

  return {
    major,
    minor,
    build,
    revision,
    versiyonText: [major, minor, build, revision]
      .map((parca) => parca ?? OKUNAMAYAN_PARCA)
      .join("."),
  };
}
