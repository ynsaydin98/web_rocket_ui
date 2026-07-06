import type { CommandEnvelope } from "../../contracts/commandEnvelope";
import { MessageTypes } from "../../contracts/messageTypes";
import {
  MKUKomutTipleri,
  type MKUKomutHedef,
  type MKUKomutPaket,
} from "../../paketler/mku/mkuKomutPaket";
import { MKUKomut } from "./mkuKomut";

/** Manuel komut panelindeki AÇ / KAPAT butonlarının komut zarfını üretir. */
export function createMKUKomut(
  id: string = "1",
  hedef: MKUKomutHedef,
  ac: boolean,
): CommandEnvelope<MKUKomutPaket> {
  return {
    id: id,
    messageType: MessageTypes.MKUKomutPaket,
    commandType: MKUKomut.VanaKomut,
    payload: {
      hedef,
      komut: ac ? MKUKomutTipleri.Ac : MKUKomutTipleri.Kapat,
    },
  };
}
