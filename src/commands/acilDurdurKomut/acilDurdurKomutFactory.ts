import type { CommandEnvelope } from "../../contracts/commandEnvelope";
import type { MessageType } from "../../contracts/messageTypes";
import { AcilDurdurKomut } from "./acilDurdurKomut";

export type AcilDurdurKomutPayload = Record<string, never>;

export function createAcilDurdurKomut(
  id: string = "1",
  messageType: MessageType,
): CommandEnvelope<AcilDurdurKomutPayload> {
  return {
    id: id,
    messageType: messageType,
    commandType: AcilDurdurKomut.AcilDurdur,
    payload: {},
  };
}
