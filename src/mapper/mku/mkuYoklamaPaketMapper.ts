import type { MKUYoklamaPaket } from "../../paketler/mku/mkuYoklamaPaket";
import { sayisalDeger } from "../../shared/utils/sayisalDogrulama";
import type { MKUYoklamaPaketUiModel } from "../../ui-models/mku/mkuYoklamaPaketUiModel";

export function mapMKUYoklamaPaketToOzet(
  mesaj: MKUYoklamaPaket,
): MKUYoklamaPaketUiModel {
  return {
    Yoklama: sayisalDeger(mesaj.Yoklama),
  };
}
