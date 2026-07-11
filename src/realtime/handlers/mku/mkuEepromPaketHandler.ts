import { MessageTypes } from "../../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../../contracts/realtimeMessageEnvelope";
import { mapMKUEepromPaketToOzet } from "../../../mapper/mku/mkuEepromPaketMapper";
import type { MKUEepromPaket } from "../../../paketler/mku/mkuEepromPaket";
import { ingestMKUEepromPaketForUi } from "../../../storeServices/mku/mkuEepromPaketUiPublisher";
import { registerRealtimeHandler } from "../../realtimeDispatcher";

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
    typeof value.varsayilan_deger1 === "number" &&
    typeof value.varsayilan_deger2 === "number" &&
    typeof value.varsayilan_deger3 === "number" &&
    typeof value.varsayilan_deger4 === "number" &&
    typeof value.varsayilan_deger5 === "number" &&
    typeof value.varsayilan_deger6 === "number" &&
    typeof value.varsayilan_deger7 === "number" &&
    typeof value.deger1 === "number" &&
    typeof value.deger2 === "number" &&
    typeof value.deger3 === "number" &&
    typeof value.deger4 === "number" &&
    typeof value.deger5 === "number" &&
    typeof value.deger6 === "number" &&
    typeof value.deger7 === "number"
  );
}
