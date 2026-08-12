import type { SayisalAlan } from "../../shared/utils/sayisalDogrulama";

/** Giden EEPROM komutunun dizi tipi; gönderilen değerler her zaman sayısaldır. */
export type Eeprom9 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

/** Gelen EEPROM paketinin dizi tipi; okunamayan elemanlar null/NaN olabilir. */
export type Eeprom9Gelen = [
  SayisalAlan,
  SayisalAlan,
  SayisalAlan,
  SayisalAlan,
  SayisalAlan,
  SayisalAlan,
  SayisalAlan,
  SayisalAlan,
  SayisalAlan,
];

export type MKUEepromPaket = {
  varsayilan_parametre1: Eeprom9Gelen;
  varsayilan_parametre2: Eeprom9Gelen;
  varsayilan_parametre3: Eeprom9Gelen;
  varsayilan_parametre4: Eeprom9Gelen;

  parametre1: Eeprom9Gelen;
  parametre2: Eeprom9Gelen;
  parametre3: Eeprom9Gelen;
  parametre4: Eeprom9Gelen;
};

export type MKUEepromGonderPaket = {
  parametre1: Eeprom9;
  parametre2: Eeprom9;
  parametre3: Eeprom9;
  parametre4: Eeprom9;
};
