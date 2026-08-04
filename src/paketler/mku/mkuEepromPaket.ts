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

export type MKUEepromPaket = {
  varsayilan_parametre1: Eeprom9;
  varsayilan_parametre2: Eeprom9;
  varsayilan_parametre3: Eeprom9;
  varsayilan_parametre4: Eeprom9;

  parametre1: Eeprom9;
  parametre2: Eeprom9;
  parametre3: Eeprom9;
  parametre4: Eeprom9;
};

export type MKUEepromGonderPaket = Pick<
  MKUEepromPaket,
  "parametre1" | "parametre2" | "parametre3" | "parametre4"
>;
