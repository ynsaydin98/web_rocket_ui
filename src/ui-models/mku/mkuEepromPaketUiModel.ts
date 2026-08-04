export type Eeprom9Ui = [
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

export type MKUEepromPaketUiModel = {
  varsayilan_parametre1: Eeprom9Ui;
  varsayilan_parametre2: Eeprom9Ui;
  varsayilan_parametre3: Eeprom9Ui;
  varsayilan_parametre4: Eeprom9Ui;

  parametre1: Eeprom9Ui;
  parametre2: Eeprom9Ui;
  parametre3: Eeprom9Ui;
  parametre4: Eeprom9Ui;
};
