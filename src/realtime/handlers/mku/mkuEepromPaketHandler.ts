import { MessageTypes } from "../../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../../contracts/realtimeMessageEnvelope";
import { mapMKUEepromPaketToOzet } from "../../../mapper/mku/mkuEepromPaketMapper";
import type {
  Eeprom9Gelen,
  MKUEepromPaket,
} from "../../../paketler/mku/mkuEepromPaket";
import { ingestMKUEepromPaketForUi } from "../../../storeServices/mku/mkuEepromPaketUiPublisher";
import { isSayisalAlanDizisi } from "../../../shared/utils/sayisalDogrulama";
import { registerRealtimeHandler } from "../../realtimeDispatcher";

const EEPROM_DIZI_UZUNLUGU = 9;

export function registerMKUEepromPaketHandler() {
  registerRealtimeHandler(MessageTypes.MKUEepromPaket, handleMKUEepromPaket);
}

function handleMKUEepromPaket(envelope: RealtimeMessageEnvelope) {
  if (!paketCheck(envelope.payload)) {
    console.warn("MKUEepromPaket payload formati gecersiz:", envelope.payload);
    return;
  }

  const uiModel = mapMKUEepromPaketToOzet(envelope.payload);
  ingestMKUEepromPaketForUi(uiModel);
}

function paketCheck(payload: unknown): payload is MKUEepromPaket {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const value = payload as Partial<MKUEepromPaket>;
  return (
    isEeprom9(value.varsayilan_parametre1) &&
    isEeprom9(value.varsayilan_parametre2) &&
    isEeprom9(value.varsayilan_parametre3) &&
    isEeprom9(value.varsayilan_parametre4) &&
    isEeprom9(value.parametre1) &&
    isEeprom9(value.parametre2) &&
    isEeprom9(value.parametre3) &&
    isEeprom9(value.parametre4)
  );
}

function isEeprom9(value: unknown): value is Eeprom9Gelen {
  return isSayisalAlanDizisi(value, EEPROM_DIZI_UZUNLUGU);
}
