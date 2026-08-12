import type {
  Eeprom9Gelen,
  MKUEepromPaket,
} from "../../paketler/mku/mkuEepromPaket";
import { sayisalDegerDizisi } from "../../shared/utils/sayisalDogrulama";
import type {
  Eeprom9Ui,
  MKUEepromPaketUiModel,
} from "../../ui-models/mku/mkuEepromPaketUiModel";

export function mapMKUEepromPaketToOzet(
  mesaj: MKUEepromPaket,
): MKUEepromPaketUiModel {
  return {
    varsayilan_parametre1: toEeprom9Ui(mesaj.varsayilan_parametre1),
    varsayilan_parametre2: toEeprom9Ui(mesaj.varsayilan_parametre2),
    varsayilan_parametre3: toEeprom9Ui(mesaj.varsayilan_parametre3),
    varsayilan_parametre4: toEeprom9Ui(mesaj.varsayilan_parametre4),
    parametre1: toEeprom9Ui(mesaj.parametre1),
    parametre2: toEeprom9Ui(mesaj.parametre2),
    parametre3: toEeprom9Ui(mesaj.parametre3),
    parametre4: toEeprom9Ui(mesaj.parametre4),
  };
}

/** Okunamayan (null/NaN) elemanlar undefined olarak taşınır. */
function toEeprom9Ui(value: Eeprom9Gelen): Eeprom9Ui {
  return sayisalDegerDizisi(value) as Eeprom9Ui;
}
