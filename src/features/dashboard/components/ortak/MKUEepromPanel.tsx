import {
  createMKUEepromAlKomut,
  createMKUEepromGonderKomut,
} from "../../../../commands/mkuEepromKomut/mkuEepromKomutFactory";
import type {
  Eeprom9,
  MKUEepromGonderPaket,
} from "../../../../paketler/mku/mkuEepromPaket";
import { sendCommand } from "../../../commands/services/commandSender";
import { useMKUEepromPaketStore } from "../../../../store/mku/mkuEepromPaketStore";
import type { MKUEepromPaketUiModel } from "../../../../ui-models/mku/mkuEepromPaketUiModel";
import { EepromTablo, type EepromAlanTanim } from "./EepromTablo";

const EEPROM_DIZI_UZUNLUGU = 9;

const MKU_EEPROM_ALANLARI: EepromAlanTanim<MKUEepromPaketUiModel>[] = [
  ...diziAlanlari("Parametre 1", "varsayilan_parametre1", "parametre1"),
  ...diziAlanlari("Parametre 2", "varsayilan_parametre2", "parametre2"),
  ...diziAlanlari("Parametre 3", "varsayilan_parametre3", "parametre3"),
  ...diziAlanlari("Parametre 4", "varsayilan_parametre4", "parametre4"),
];

export function MKUEepromPanel() {
  const ozet = useMKUEepromPaketStore((state) => state.ozet);
  const lastUpdateId = useMKUEepromPaketStore((state) => state.lastUpdateId);

  return (
    <EepromTablo<MKUEepromPaketUiModel, MKUEepromGonderPaket>
      baslik="MKU EEPROM"
      tip="NUMERIC EEPROM"
      model={ozet}
      lastUpdateId={lastUpdateId}
      alanlar={MKU_EEPROM_ALANLARI}
      payloadHazirla={buildPayload}
      onAl={() => sendCommand(createMKUEepromAlKomut("1"))}
      onGonder={(payload) =>
        sendCommand(createMKUEepromGonderKomut("1", payload))
      }
    />
  );
}

function buildPayload(model: MKUEepromPaketUiModel): MKUEepromGonderPaket {
  return {
    parametre1: cloneEeprom9(model.parametre1),
    parametre2: cloneEeprom9(model.parametre2),
    parametre3: cloneEeprom9(model.parametre3),
    parametre4: cloneEeprom9(model.parametre4),
  };
}

function diziAlanlari(
  etiket: string,
  varsayilanKey: keyof MKUEepromPaketUiModel,
  degerKey: keyof MKUEepromPaketUiModel,
): EepromAlanTanim<MKUEepromPaketUiModel>[] {
  return Array.from({ length: EEPROM_DIZI_UZUNLUGU }, (_, index) => ({
    etiket: `${etiket} [${index}]`,
    varsayilanKey,
    degerKey,
    index,
  }));
}

/**
 * Giden GONDER paketi her zaman sayısal olmalı. Okunamamış (undefined) alanlar
 * tabloda 0 gösterildiği için gönderilirken de 0 olarak yazılır.
 */
function cloneEeprom9(value: readonly (number | undefined)[]): Eeprom9 {
  return value.map((deger) => deger ?? 0) as Eeprom9;
}
