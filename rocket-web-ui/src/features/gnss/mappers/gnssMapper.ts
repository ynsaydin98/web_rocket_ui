import type { GnssOzetUiModel } from "../models/gnssOzetUiModel";
import type { GnssPaket } from "../messages/gnssPaket";

export function mapGnssPaketToOzet(paket: GnssPaket): GnssOzetUiModel {
  return {
    gnssSaati: paket.gnssSaati,
  };
}
