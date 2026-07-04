import { MessageTypes } from "../../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../../contracts/realtimeMessageEnvelope";
import { mapMKUVersiyonPaketToOzet } from "../../../mapper/mku/mkuVersiyonPaketMapper";
import type { MKUVersiyonPaket } from "../../../paketler/mku/mkuVersiyonPaket";
import { ingestMKUVersiyonPaketForUi } from "../../../storeServices/mku/mkuVersiyonPaketUiiPublisher";
import { registerRealtimeHandler } from "../../realtimeDispatcher";

export function registerMKUVersiyonPaketHandler() {
  registerRealtimeHandler(
    MessageTypes.MKUVersiyonPaket,
    handleMKUVersiyonPaket,
  );
}

function handleMKUVersiyonPaket(envelope: RealtimeMessageEnvelope) {
  if (!paketCheck(envelope.payload)) {
    console.warn(
      "MKUVersiyonPaket payload formatı geçersiz:",
      envelope.payload,
    );
    return;
  }

  const uiModel = mapMKUVersiyonPaketToOzet(envelope.payload);

  ingestMKUVersiyonPaketForUi(uiModel);
}

function paketCheck(payload: unknown): payload is MKUVersiyonPaket {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const value = payload as Partial<MKUVersiyonPaket>;
  return (
    typeof value.major === "number" &&
    typeof value.minor === "number" &&
    typeof value.build === "number" &&
    typeof value.revision === "number"
  );
}
