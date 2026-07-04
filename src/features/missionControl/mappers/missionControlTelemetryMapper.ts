import type { OpMod } from "../config/missionControlConfig";
import type { TestStandTelemetriPaket } from "../messages/testStandTelemetriPaket";
import type { MissionControlIngestModel } from "../models/missionControlIngestModel";

export function mapTestStandTelemetriToIngestModel(
  mesaj: TestStandTelemetriPaket,
): MissionControlIngestModel {
  return {
    opMod: mapItkiOpMod(mesaj.itkiOpMod),
    sensors: mesaj.sensorler,
    sistemSaati: mesaj.sistemSaati,
  };
}

/**
 * itkiOpMod sayısal kodunu 4 değerli görev fazına eşler.
 * PLACEHOLDER eşleme (0/1/2/3) — gerçek test standı protokol belgesi
 * netleşince, tıpkı roketTelemetriMapper.ts'teki mapDurumKodu gibi
 * güncellenmesi yeterli.
 */
function mapItkiOpMod(itkiOpMod: number): OpMod {
  switch (itkiOpMod) {
    case 0:
      return "BEKLEMEDE";
    case 1:
      return "GERİ SAYIM";
    case 2:
      return "ATEŞLEME";
    case 3:
      return "TAMAMLANDI";
    default:
      return "BEKLEMEDE";
  }
}
