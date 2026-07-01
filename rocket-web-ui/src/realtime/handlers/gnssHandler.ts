import type { RealtimeMessageEnvelope } from "../../contracts/realtimeMessageEnvelope";
import { MessageTypes } from "../../contracts/messageTypes";
import { mapGnssPaketToOzet } from "../../features/gnss/mappers/gnssMapper";
import type { GnssPaket } from "../../features/gnss/messages/gnssPaket";
import { ingestGnssForUi } from "../../features/gnss/services/gnssUiPublisher";
import { registerRealtimeHandler } from "../realtimeDispatcher";

export function registerGnssHandler() {
  registerRealtimeHandler(MessageTypes.GnssPaket, handleGnss);
}

function handleGnss(envelope: RealtimeMessageEnvelope) {
  if (!isGnssPaket(envelope.payload)) {
    console.warn("GnssPaket payload formatı geçersiz:", envelope.payload);
    return;
  }

  const uiModel = mapGnssPaketToOzet(envelope.payload);

  ingestGnssForUi(uiModel);
}

function isGnssPaket(payload: unknown): payload is GnssPaket {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const value = payload as Partial<GnssPaket>;

  return typeof value.gnssSaati === "string";
}
