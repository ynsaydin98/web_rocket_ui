import type { MKUYoklamaPaket } from "../../paketler/mku/mkuYoklamaPaket";
import type { MKUYoklamaPaketUiModel } from "../../ui-models/mku/mkuYoklamaPaketUiModel";

export function mapMKUYoklamaPaketToOzet(
  mesaj: MKUYoklamaPaket,
): MKUYoklamaPaketUiModel {
  return {
    Yoklama: mesaj.Yoklama,
  };
}
