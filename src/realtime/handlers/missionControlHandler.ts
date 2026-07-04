import { MessageTypes } from "../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../contracts/realtimeMessageEnvelope";
import { SENSOR_ORDER, type SensorId } from "../../features/missionControl/config/missionControlConfig";
import { mapTestStandTelemetriToIngestModel } from "../../features/missionControl/mappers/missionControlTelemetryMapper";
import type { TestStandTelemetriPaket } from "../../features/missionControl/messages/testStandTelemetriPaket";
import { ingestMissionControlForUi } from "../../features/missionControl/services/missionControlUiPublisher";
import { registerRealtimeHandler } from "../realtimeDispatcher";

export function registerMissionControlHandler() {
  registerRealtimeHandler(
    MessageTypes.TestStandTelemetriPaket,
    handleTestStandTelemetri,
  );
}

function handleTestStandTelemetri(envelope: RealtimeMessageEnvelope) {
  if (!isTestStandTelemetriPaket(envelope.payload)) {
    console.warn(
      "TestStandTelemetriPaket payload formatı geçersiz:",
      envelope.payload,
    );
    return;
  }

  const uiModel = mapTestStandTelemetriToIngestModel(envelope.payload);

  ingestMissionControlForUi(uiModel);
}

function isTestStandTelemetriPaket(
  payload: unknown,
): payload is TestStandTelemetriPaket {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const value = payload as Partial<TestStandTelemetriPaket>;

  if (typeof value.itkiOpMod !== "number") return false;
  if (typeof value.sensorler !== "object" || value.sensorler === null) return false;

  const sensorler = value.sensorler as Partial<Record<SensorId, unknown>>;
  for (const id of SENSOR_ORDER) {
    const v = sensorler[id];
    if (v !== undefined && typeof v !== "number") return false;
  }

  const sistemSaatiValid =
    value.sistemSaati === undefined || typeof value.sistemSaati === "number";

  return sistemSaatiValid;
}
