import { MessageTypes } from "../../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../../contracts/realtimeMessageEnvelope";
import { mapMKUYoklamaPaketToOzet } from "../../../mapper/mku/mkuYoklamaPaketMapper";
import type { MKUYoklamaPaket } from "../../../paketler/mku/mkuYoklamaPaket";
import { ingestMKUYoklamaPaketForUi } from "../../../storeServices/mku/mkuYoklamaPaketUiPublisher";
import { registerRealtimeHandler } from "../../realtimeDispatcher";

export function registerMKUYoklamaPaketHandler() {
  registerRealtimeHandler(MessageTypes.MKUYoklamaPaket, handleMKUYoklamaPaket);
}

function handleMKUYoklamaPaket(envelope: RealtimeMessageEnvelope) {
  if (!paketCheck(envelope.payload)) {
    console.warn("MKUYoklamaPaket payload formatı geçersiz:", envelope.payload);
    return;
  }

  const uiModel = mapMKUYoklamaPaketToOzet(envelope.payload);

  ingestMKUYoklamaPaketForUi(uiModel);
}

function paketCheck(payload: unknown): payload is MKUYoklamaPaket {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const value = payload as Partial<MKUYoklamaPaket>;
  return typeof value.Yoklama === "number";
}
