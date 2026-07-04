import type { CommandEnvelope } from "../../contracts/commandEnvelope";
import type { MessageType } from "../../contracts/messageTypes";
import { SekansBaslatKomut } from "./sekansBaslatKomut";

export type SekansBaslatKomutPayload = Record<string, never>;

export function createSekansBaslatKomut(
  id: string = "1",
  messageType: MessageType,
): CommandEnvelope<SekansBaslatKomutPayload> {
  return {
    id: id,
    messageType: messageType,
    commandType: SekansBaslatKomut.SekansBaslat,
    payload: {},
  };
}
