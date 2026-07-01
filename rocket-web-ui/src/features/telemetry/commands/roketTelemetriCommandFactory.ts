import { appConfig } from "../../../app/appConfig";
import type { CommandEnvelope } from "../../../contracts/commandEnvelope";
import { MessageTypes } from "../../../contracts/messageTypes";
import { RoketTelemetriCommands } from "./roketTelemetriCommands";

export type RoketTelemetriSoftResetPayload = Record<string, never>;

export type RoketTelemetriSoftResetWithPayloadPayload = {
  reason: string;
  delayMs: number;
};

export function createRoketTelemetriSoftResetCommand(): CommandEnvelope<RoketTelemetriSoftResetPayload> {
  return {
    id: appConfig.defaultCommandTargetId,
    messageType: MessageTypes.RoketTelemetriPaket,
    commandType: RoketTelemetriCommands.SoftReset,
    payload: {},
  };
}

export function createRoketTelemetriSoftResetWithPayloadCommand(
  payload: RoketTelemetriSoftResetWithPayloadPayload,
): CommandEnvelope<RoketTelemetriSoftResetWithPayloadPayload> {
  return {
    id: appConfig.defaultCommandTargetId,
    messageType: MessageTypes.RoketTelemetriPaket,
    commandType: RoketTelemetriCommands.SoftResetWithPayload,
    payload,
  };
}
