import type { CommandEnvelope } from "../../contracts/commandEnvelope";
import type { MessageType } from "../../contracts/messageTypes";
import { YoklamaKomut } from "./yoklamaKomut";

export type YoklamaKomutPayload = Record<string, never>;

export function createYoklamaKomut(
  id: string = "1",
  messageType: MessageType,
): CommandEnvelope<YoklamaKomutPayload> {
  return {
    id: id,
    messageType: messageType,
    commandType: YoklamaKomut.Yoklama,
    payload: {},
  };
}
