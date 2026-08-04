import type { Eeprom9, MKUEepromPaket } from "../../paketler/mku/mkuEepromPaket";
import type {
  Eeprom9Ui,
  MKUEepromPaketUiModel,
} from "../../ui-models/mku/mkuEepromPaketUiModel";

export function mapMKUEepromPaketToOzet(
  mesaj: MKUEepromPaket,
): MKUEepromPaketUiModel {
  return {
    varsayilan_parametre1: cloneEeprom9(mesaj.varsayilan_parametre1),
    varsayilan_parametre2: cloneEeprom9(mesaj.varsayilan_parametre2),
    varsayilan_parametre3: cloneEeprom9(mesaj.varsayilan_parametre3),
    varsayilan_parametre4: cloneEeprom9(mesaj.varsayilan_parametre4),
    parametre1: cloneEeprom9(mesaj.parametre1),
    parametre2: cloneEeprom9(mesaj.parametre2),
    parametre3: cloneEeprom9(mesaj.parametre3),
    parametre4: cloneEeprom9(mesaj.parametre4),
  };
}

function cloneEeprom9(value: Eeprom9): Eeprom9Ui {
  return [...value] as Eeprom9Ui;
}
