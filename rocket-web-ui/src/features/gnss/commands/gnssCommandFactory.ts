import { appConfig } from "../../../app/appConfig";
import type { CommandEnvelope } from "../../../contracts/commandEnvelope";
import { MessageTypes } from "../../../contracts/messageTypes";
import { GnssCommands } from "./gnssCommands";

export type SyncGnssClockPayload = {
  epochSeconds: number;
};

export function createSyncGnssClockCommand(
  payload: SyncGnssClockPayload,
  id = appConfig.defaultCommandTargetId,
): CommandEnvelope<SyncGnssClockPayload> {
  return {
    id,
    messageType: MessageTypes.GnssPaket,
    commandType: GnssCommands.SyncGnssClock,
    payload,
  };
}
