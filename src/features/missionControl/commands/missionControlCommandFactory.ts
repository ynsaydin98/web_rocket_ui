import { appConfig } from "../../../app/appConfig";
import type { CommandEnvelope } from "../../../contracts/commandEnvelope";
import { MessageTypes } from "../../../contracts/messageTypes";
import { MissionControlCommands } from "./missionControlCommands";

export type MissionControlStartSequencePayload = Record<string, never>;
export type MissionControlAbortPayload = Record<string, never>;
export type MissionControlSetManualValvePayload = { open: boolean };

export function createMissionControlStartSequenceCommand(): CommandEnvelope<MissionControlStartSequencePayload> {
  return {
    id: appConfig.defaultCommandTargetId,
    messageType: MessageTypes.TestStandTelemetriPaket,
    commandType: MissionControlCommands.StartSequence,
    payload: {},
  };
}

export function createMissionControlAbortCommand(): CommandEnvelope<MissionControlAbortPayload> {
  return {
    id: appConfig.defaultCommandTargetId,
    messageType: MessageTypes.TestStandTelemetriPaket,
    commandType: MissionControlCommands.Abort,
    payload: {},
  };
}

export function createMissionControlSetManualValveCommand(
  open: boolean,
): CommandEnvelope<MissionControlSetManualValvePayload> {
  return {
    id: appConfig.defaultCommandTargetId,
    messageType: MessageTypes.TestStandTelemetriPaket,
    commandType: MissionControlCommands.SetManualValve,
    payload: { open },
  };
}
