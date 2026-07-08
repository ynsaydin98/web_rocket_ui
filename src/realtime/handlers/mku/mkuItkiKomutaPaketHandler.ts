import { MessageTypes } from "../../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../../contracts/realtimeMessageEnvelope";
import { mapMKUItkiKomutaPaketToOzet } from "../../../mapper/mku/mkuItkiKomutaPaketMapper";
import type { MKUItkiKomutaPaket } from "../../../paketler/mku/mkuItkiKomutaPaket";
import { ingestMKUItkiKomutaPaketForUi } from "../../../storeServices/mku/mkuItkiKomutaPaketUiPublisher";
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
    typeof value.geriSayim_sn === "number" &&
    typeof value.anahtarKontrolu === "number" &&
    typeof value.seciliValf_0 === "number" &&
    typeof value.seciliIslem_0 === "number" &&
    typeof value.islemSuresi_0 === "number" &&
    typeof value.seciliValf_1 === "number" &&
    typeof value.seciliIslem_1 === "number" &&
    typeof value.islemSuresi_1 === "number" &&
    typeof value.seciliValf_2 === "number" &&
    typeof value.seciliIslem_2 === "number" &&
    typeof value.islemSuresi_2 === "number" &&
    typeof value.seciliValf_3 === "number" &&
    typeof value.seciliIslem_3 === "number" &&
    typeof value.islemSuresi_3 === "number" &&
    typeof value.seciliValf_4 === "number" &&
    typeof value.seciliIslem_4 === "number" &&
    typeof value.islemSuresi_4 === "number" &&
    typeof value.seciliValf_5 === "number" &&
    typeof value.seciliIslem_5 === "number" &&
    typeof value.islemSuresi_5 === "number" &&
    typeof value.seciliValf_6 === "number" &&
    typeof value.seciliIslem_6 === "number" &&
    typeof value.islemSuresi_6 === "number" &&
    typeof value.seciliValf_7 === "number" &&
    typeof value.seciliIslem_7 === "number" &&
    typeof value.islemSuresi_7 === "number" &&
    typeof value.seciliValf_8 === "number" &&
    typeof value.seciliIslem_8 === "number" &&
    typeof value.islemSuresi_8 === "number" &&
    typeof value.seciliValf_9 === "number" &&
    typeof value.seciliIslem_9 === "number" &&
    typeof value.islemSuresi_9 === "number"
  );
}
