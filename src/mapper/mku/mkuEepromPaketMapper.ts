import type { MKUEepromPaket } from "../../paketler/mku/mkuEepromPaket";
import type { MKUEepromPaketUiModel } from "../../ui-models/mku/mkuEepromPaketUiModel";

export function mapMKUEepromPaketToOzet(
  mesaj: MKUEepromPaket,
): MKUEepromPaketUiModel {
  return {
    varsayilan_deger1: mesaj.varsayilan_deger1,
    varsayilan_deger2: mesaj.varsayilan_deger2,
    varsayilan_deger3: mesaj.varsayilan_deger3,
    varsayilan_deger4: mesaj.varsayilan_deger4,
    varsayilan_deger5: mesaj.varsayilan_deger5,
    varsayilan_deger6: mesaj.varsayilan_deger6,
    varsayilan_deger7: mesaj.varsayilan_deger7,
    deger1: mesaj.deger1,
    deger2: mesaj.deger2,
    deger3: mesaj.deger3,
    deger4: mesaj.deger4,
    deger5: mesaj.deger5,
    deger6: mesaj.deger6,
    deger7: mesaj.deger7,
  };
}
