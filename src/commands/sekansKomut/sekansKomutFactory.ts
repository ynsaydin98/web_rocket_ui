import type { CommandEnvelope } from "../../contracts/commandEnvelope";
import { MessageTypes } from "../../contracts/messageTypes";
import type {
  MKUSekansAdim,
  MKUSekansGonderPaket,
} from "../../paketler/mku/mkuSekansGonderPaket";
import type { MKUSekansEepromYazPaket } from "../../paketler/mku/mkuSekansEepromYazPaket";
import { SekansKomut } from "./sekansKomut";

/** Sekans tablosunu üniteye (RAM) gönderir. */
export function createSekansGonderKomut(
  id: string = "1",
  adimlar: MKUSekansAdim[],
): CommandEnvelope<MKUSekansGonderPaket> {
  return {
    id: id,
    messageType: MessageTypes.MKUSekansGonderPaket,
    commandType: SekansKomut.SekansGonder,
    payload: { adimlar },
  };
}

/** Ünitede yüklü sekans tablosunu sorgular; cevap MKUSekansAlPaket ile döner. */
export function createSekansAlKomut(
  id: string = "1",
): CommandEnvelope<Record<string, never>> {
  return {
    id: id,
    messageType: MessageTypes.MKUSekansAlPaket,
    commandType: SekansKomut.SekansAl,
    payload: {},
  };
}

/** Ünitedeki güncel sekans tablosunun EEPROM'a yazılmasını ister. */
export function createSekansEepromYazKomut(
  id: string = "1",
): CommandEnvelope<MKUSekansEepromYazPaket> {
  return {
    id: id,
    messageType: MessageTypes.MKUSekansEepromYazPaket,
    commandType: SekansKomut.SekansEepromYaz,
    payload: {},
  };
}

/** EEPROM'da kayıtlı sekansı sorgular; cevap MKUSekansEepromOkuPaket ile döner. */
export function createSekansEepromOkuKomut(
  id: string = "1",
): CommandEnvelope<Record<string, never>> {
  return {
    id: id,
    messageType: MessageTypes.MKUSekansEepromOkuPaket,
    commandType: SekansKomut.SekansEepromOku,
    payload: {},
  };
}
