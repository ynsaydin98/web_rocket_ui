import type { MKUSekansAdim } from "./mkuSekansGonderPaket";

/** EEPROM'da kayıtlı sekans tablosunu sorgulayan / cevabında taşıyan paket. */
export type MKUSekansEepromOkuPaket = {
  adimlar: MKUSekansAdim[];
};
