import type { CommandEnvelope } from "../../contracts/commandEnvelope";
import type { MessageType } from "../../contracts/messageTypes";
import { VersiyonKomut } from "./versiyonKomut";

export type VersiyonKomutPayload = Record<string, never>;

export function createVersiyonKomut(
  id: string = "1",
  messageType: MessageType,
): CommandEnvelope<VersiyonKomutPayload> {
  return {
    id: id,
    messageType: messageType,
    commandType: VersiyonKomut.Versiyon,
    payload: {},
  };
}
