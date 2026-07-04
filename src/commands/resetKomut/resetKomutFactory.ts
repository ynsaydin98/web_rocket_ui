import type { CommandEnvelope } from "../../contracts/commandEnvelope";
import type { MessageType } from "../../contracts/messageTypes";
import { ResetKomut } from "./resetKomut";

export type ResetKomutPayload = Record<string, never>;

export function createResetKomut(
  id: string = "1",
  messageType: MessageType,
): CommandEnvelope<ResetKomutPayload> {
  return {
    id: id,
    messageType: messageType,
    commandType: ResetKomut.Reset,
    payload: {},
  };
}
