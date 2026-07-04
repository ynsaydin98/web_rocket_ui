import type { SensorId } from "../config/missionControlConfig";

/**
 * Test standı telemetri paketinin ham (wire) tipi. itkiOpMod dışındaki alan
 * adları (sensorler, sistemSaati) placeholder'dır — gerçek protokol
 * belgesine göre bu dosyada, mapper'da ve handler'daki type-guard'da
 * güncellenmesi yeterlidir.
 */
export type TestStandTelemetriPaket = {
  /** 0=BEKLEMEDE, 1=GERİ SAYIM, 2=ATEŞLEME, 3=TAMAMLANDI (placeholder kod eşlemesi). */
  itkiOpMod: number;
  /** Pakette bulunmayan sensörler store'daki son bilinen değerini korur. */
  sensorler: Partial<Record<SensorId, number>>;
  sistemSaati?: number;
};
