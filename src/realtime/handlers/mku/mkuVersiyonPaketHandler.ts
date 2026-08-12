import { MessageTypes } from "../../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../../contracts/realtimeMessageEnvelope";
import { mapMKUVersiyonPaketToOzet } from "../../../mapper/mku/mkuVersiyonPaketMapper";
import type { MKUVersiyonPaket } from "../../../paketler/mku/mkuVersiyonPaket";
import { ingestMKUVersiyonPaketForUi } from "../../../storeServices/mku/mkuVersiyonPaketUiiPublisher";
import { isSayisalAlan } from "../../../shared/utils/sayisalDogrulama";
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
    isSayisalAlan(value.major) &&
    isSayisalAlan(value.minor) &&
    isSayisalAlan(value.build) &&
    isSayisalAlan(value.revision)
  );
}
