import type { RoketTelemetriPaket } from "../messages/roketTelemetriPaket";
import type { RoketOzetUiModel } from "../models/roketOzetUiModel";

export function mapRoketTelemetriToOzet(
  mesaj: RoketTelemetriPaket,
): RoketOzetUiModel {
  return {
    irtifa: mesaj.irtifa,
    hiz: mesaj.hiz,
    batarya: mesaj.batarya,
    durumText: mapDurumKodu(mesaj.durumKodu),
    kritikMi: mesaj.batarya < 20,
    enlem: mesaj.enlem,
    boylam: mesaj.boylam,
    roll: mesaj.roll,
    pitch: mesaj.pitch,
    yaw: mesaj.yaw,
    sistemSaati: mesaj.sistemSaati,
  };
}

function mapDurumKodu(durumKodu: number): string {
  switch (durumKodu) {
    case 0:
      return "Beklemede";
    case 1:
      return "Hazır";
    case 2:
      return "Uçuşta";
    case 3:
      return "İnişte";
    default:
      return "Bilinmiyor";
  }
}
