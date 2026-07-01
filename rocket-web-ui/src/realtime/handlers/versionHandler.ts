import type { RealtimeMessageEnvelope } from "../../contracts/realtimeMessageEnvelope";
import { MessageTypes } from "../../contracts/messageTypes";
import { mapVersiyonBilgisiToUiModel } from "../../features/version/mappers/versiyonBilgisiMapper";
import type { VersiyonBilgisiMesaj } from "../../features/version/messages/versiyonBilgisiMesaj";
import { ingestVersionForUi } from "../../features/version/services/versionUiPublisher";
import { registerRealtimeHandler } from "../realtimeDispatcher";

export function registerVersionHandler() {
  registerRealtimeHandler(MessageTypes.VersiyonBilgisi, handleVersion);
}

function handleVersion(envelope: RealtimeMessageEnvelope) {
  if (!isVersiyonBilgisiMesaj(envelope.payload)) {
    console.warn("VersiyonBilgisi payload formati gecersiz:", envelope.payload);
    return;
  }

  const uiModel = mapVersiyonBilgisiToUiModel(envelope.payload);

  ingestVersionForUi(uiModel);
}

function isVersiyonBilgisiMesaj(
  payload: unknown,
): payload is VersiyonBilgisiMesaj {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const value = payload as Partial<VersiyonBilgisiMesaj>;

  return (
    isOptionalString(value.versiyon) &&
    isOptionalString(value.version) &&
    isOptionalString(value.firmwareVersion) &&
    isOptionalString(value.softwareVersion) &&
    isOptionalString(value.buildDate) &&
    isOptionalString(value.buildNumber)
  );
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === "string";
}
