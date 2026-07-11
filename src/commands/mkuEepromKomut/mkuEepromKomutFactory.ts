import type { CommandEnvelope } from "../../contracts/commandEnvelope";
import { MessageTypes } from "../../contracts/messageTypes";
import type { MKUEepromGonderPaket } from "../../paketler/mku/mkuEepromPaket";
import { MKUEepromKomut } from "./mkuEepromKomut";

export function createMKUEepromAlKomut(
  id: string = "1",
): CommandEnvelope<Record<string, never>> {
  return {
    id,
    messageType: MessageTypes.MKUEepromPaket,
    commandType: MKUEepromKomut.Al,
    payload: {},
  };
}

export function createMKUEepromGonderKomut(
  id: string = "1",
  payload: MKUEepromGonderPaket,
): CommandEnvelope<MKUEepromGonderPaket> {
  return {
    id,
    messageType: MessageTypes.MKUEepromPaket,
    commandType: MKUEepromKomut.Gonder,
    payload,
  };
}
