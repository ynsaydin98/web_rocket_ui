import {
  createMKUEepromAlKomut,
  createMKUEepromGonderKomut,
} from "../../../../commands/mkuEepromKomut/mkuEepromKomutFactory";
import type { MKUEepromGonderPaket } from "../../../../paketler/mku/mkuEepromPaket";
import { sendCommand } from "../../../commands/services/commandSender";
import { useMKUEepromPaketStore } from "../../../../store/mku/mkuEepromPaketStore";
import type { MKUEepromPaketUiModel } from "../../../../ui-models/mku/mkuEepromPaketUiModel";
import { EepromTablo, type EepromAlanTanim } from "./EepromTablo";

const MKU_EEPROM_ALANLARI: EepromAlanTanim<MKUEepromPaketUiModel>[] = [
  { etiket: "Deger 1", varsayilanKey: "varsayilan_deger1", degerKey: "deger1" },
  { etiket: "Deger 2", varsayilanKey: "varsayilan_deger2", degerKey: "deger2" },
  { etiket: "Deger 3", varsayilanKey: "varsayilan_deger3", degerKey: "deger3" },
  { etiket: "Deger 4", varsayilanKey: "varsayilan_deger4", degerKey: "deger4" },
  { etiket: "Deger 5", varsayilanKey: "varsayilan_deger5", degerKey: "deger5" },
  { etiket: "Deger 6", varsayilanKey: "varsayilan_deger6", degerKey: "deger6" },
  { etiket: "Deger 7", varsayilanKey: "varsayilan_deger7", degerKey: "deger7" },
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
    deger1: model.deger1,
    deger2: model.deger2,
    deger3: model.deger3,
    deger4: model.deger4,
    deger5: model.deger5,
    deger6: model.deger6,
    deger7: model.deger7,
  };
}
