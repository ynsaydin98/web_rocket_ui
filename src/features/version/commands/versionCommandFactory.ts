import { appConfig } from "../../../app/appConfig";
import type { CommandEnvelope } from "../../../contracts/commandEnvelope";
import { MessageTypes } from "../../../contracts/messageTypes";
import { VersionCommands } from "./versionCommands";

export type VersionQueryPayload = Record<string, never>;

export function createVersionQueryCommand(): CommandEnvelope<VersionQueryPayload> {
  return {
    id: appConfig.defaultCommandTargetId,
    messageType: MessageTypes.MKUVersiyonPaket,
    commandType: VersionCommands.VersiyonSorgu,
    payload: {},
  };
}
