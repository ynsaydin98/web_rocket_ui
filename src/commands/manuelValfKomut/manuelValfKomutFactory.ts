import type { CommandEnvelope } from "../../contracts/commandEnvelope";
import type { MessageType } from "../../contracts/messageTypes";
import { ManuelValfKomut } from "./manuelValfKomut";

export type ManuelValfKomutPayload = {
  acik: boolean;
};

export function createManuelValfKomut(
  id: string = "1",
  messageType: MessageType,
  acik: boolean,
): CommandEnvelope<ManuelValfKomutPayload> {
  return {
    id: id,
    messageType: messageType,
    commandType: ManuelValfKomut.ManuelValf,
    payload: { acik },
  };
}
