import type { RealtimeMessageEnvelope } from "../../contracts/realtimeMessageEnvelope";
import { MessageTypes } from "../../contracts/messageTypes";
import { mapRoketTelemetriToOzet } from "../../features/telemetry/mappers/roketTelemetriMapper";
import type { RoketTelemetriPaket } from "../../features/telemetry/messages/roketTelemetriPaket";
import { registerRealtimeHandler } from "../realtimeDispatcher";
import { ingestTelemetryForUi } from "../../features/telemetry/services/telemetryUiPublisher";

export function registerRoketTelemetriHandler() {
  registerRealtimeHandler(
    MessageTypes.RoketTelemetriPaket,
    handleRoketTelemetri,
  );
}

function handleRoketTelemetri(envelope: RealtimeMessageEnvelope) {
  if (!isRoketTelemetriPaket(envelope.payload)) {
    console.warn(
      "RoketTelemetriPaket payload formatı geçersiz:",
      envelope.payload,
    );
    return;
  }

  const uiModel = mapRoketTelemetriToOzet(envelope.payload);

  ingestTelemetryForUi(uiModel);
}

function isRoketTelemetriPaket(
  payload: unknown,
): payload is RoketTelemetriPaket {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const value = payload as Partial<RoketTelemetriPaket>;

  const sistemSaatiValid =
    value.sistemSaati === undefined || typeof value.sistemSaati === "number";

  return (
    typeof value.irtifa === "number" &&
    typeof value.hiz === "number" &&
    typeof value.batarya === "number" &&
    typeof value.durumKodu === "number" &&
    sistemSaatiValid
  );
}
