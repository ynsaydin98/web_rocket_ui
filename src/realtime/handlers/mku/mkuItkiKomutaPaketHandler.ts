import { MessageTypes } from "../../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../../contracts/realtimeMessageEnvelope";
import { mapMKUItkiKomutaPaketToOzet } from "../../../mapper/mku/mkuItkiKomutaPaketMapper";
import type { MKUItkiKomutaPaket } from "../../../paketler/mku/mkuItkiKomutaPaket";
import { ingestMKUItkiKomutaPaketForUi } from "../../../storeServices/mku/mkuItkiKomutaPaketUiPublisher";
import { isSayisalAlan } from "../../../shared/utils/sayisalDogrulama";
import { registerRealtimeHandler } from "../../realtimeDispatcher";

export function registerMKUItkiKomutaPaketHandler() {
  registerRealtimeHandler(
    MessageTypes.MKUItkiKomutaPaket,
    handleMKUItkiKomutaPaket,
  );
}

function handleMKUItkiKomutaPaket(envelope: RealtimeMessageEnvelope) {
  if (!paketCheck(envelope.payload)) {
    console.warn(
      "MKUItkiKomutaPaket payload formatı geçersiz:",
      envelope.payload,
    );
    return;
  }

  const uiModel = mapMKUItkiKomutaPaketToOzet(envelope.payload);

  ingestMKUItkiKomutaPaketForUi(uiModel);
}

function paketCheck(payload: unknown): payload is MKUItkiKomutaPaket {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const value = payload as Partial<MKUItkiKomutaPaket>;
  return (
    isSayisalAlan(value.geriSayim_sn) &&
    isSayisalAlan(value.anahtarKontrolu) &&
    isSayisalAlan(value.seciliValf_0) &&
    isSayisalAlan(value.seciliIslem_0) &&
    isSayisalAlan(value.islemSuresi_0) &&
    isSayisalAlan(value.seciliValf_1) &&
    isSayisalAlan(value.seciliIslem_1) &&
    isSayisalAlan(value.islemSuresi_1) &&
    isSayisalAlan(value.seciliValf_2) &&
    isSayisalAlan(value.seciliIslem_2) &&
    isSayisalAlan(value.islemSuresi_2) &&
    isSayisalAlan(value.seciliValf_3) &&
    isSayisalAlan(value.seciliIslem_3) &&
    isSayisalAlan(value.islemSuresi_3) &&
    isSayisalAlan(value.seciliValf_4) &&
    isSayisalAlan(value.seciliIslem_4) &&
    isSayisalAlan(value.islemSuresi_4) &&
    isSayisalAlan(value.seciliValf_5) &&
    isSayisalAlan(value.seciliIslem_5) &&
    isSayisalAlan(value.islemSuresi_5) &&
    isSayisalAlan(value.seciliValf_6) &&
    isSayisalAlan(value.seciliIslem_6) &&
    isSayisalAlan(value.islemSuresi_6) &&
    isSayisalAlan(value.seciliValf_7) &&
    isSayisalAlan(value.seciliIslem_7) &&
    isSayisalAlan(value.islemSuresi_7) &&
    isSayisalAlan(value.seciliValf_8) &&
    isSayisalAlan(value.seciliIslem_8) &&
    isSayisalAlan(value.islemSuresi_8) &&
    isSayisalAlan(value.seciliValf_9) &&
    isSayisalAlan(value.seciliIslem_9) &&
    isSayisalAlan(value.islemSuresi_9)
  );
}
