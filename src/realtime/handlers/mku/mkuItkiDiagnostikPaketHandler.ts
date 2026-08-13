import { MessageTypes } from "../../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../../contracts/realtimeMessageEnvelope";
import { mapMKUItkiDiagnostikPaketToOzet } from "../../../mapper/mku/mkuItkiDiagnostikPaketMapper";
import type { MKUItkiDiagnostikPaket } from "../../../paketler/mku/mkuItkiDiagnostikPaket";
import { ingestMKUItkiDiagnostikPaketForUi } from "../../../storeServices/mku/mkuItkiDiagnostikPaketUiPublisher";
import {
  isOpsiyonelSayisalAlan,
  isSayisalAlan,
} from "../../../shared/utils/sayisalDogrulama";
import { registerRealtimeHandler } from "../../realtimeDispatcher";

export function registerMKUItkiDiagnostikPaketHandler() {
  registerRealtimeHandler(
    MessageTypes.MKUItkiDiagnostikPaket,
    handleMKUItkiDiagnostikPaket,
  );
}

function handleMKUItkiDiagnostikPaket(envelope: RealtimeMessageEnvelope) {
  if (!paketCheck(envelope.payload)) {
    console.warn(
      "MKUItkiDiagnostikPaket payload formatı geçersiz:",
      envelope.payload,
    );
    return;
  }

  const uiModel = mapMKUItkiDiagnostikPaketToOzet(envelope.payload);

  ingestMKUItkiDiagnostikPaketForUi(uiModel);
}

function paketCheck(payload: unknown): payload is MKUItkiDiagnostikPaket {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const value = payload as Partial<MKUItkiDiagnostikPaket>;
  return (
    isSayisalAlan(value.itkiOpDurumlari) &&
    isSayisalAlan(value.opGecenSure_ms) &&
    isSayisalAlan(value.itkiBaslatmaGeriSayim_sn) &&
    isSayisalAlan(value.acilDurdurDurum) &&
    isSayisalAlan(value.acilDurdurBasla) &&
    isSayisalAlan(value.komutItkiSuresi_ms) &&
    isSayisalAlan(value.tahliyeGecenSure) &&
    isSayisalAlan(value.itkiGecenSure_ms) &&
    isSayisalAlan(value.kalanItkiSuresi_ms) &&
    isSayisalAlan(value.kalanTahliyeSuresi_ms) &&
    isSayisalAlan(value.kalanAcilDurdurSuresi_ms) &&
    isSayisalAlan(value.acilDurdurGecenSure_ms) &&
    isSayisalAlan(value.sistemSaati_ms) &&
    isSayisalAlan(value.sonIslemSuresi_ms) &&
    isSayisalAlan(value.islemDurumlari) &&
    isSayisalAlan(value.valfDurum_Igniter1) &&
    isSayisalAlan(value.valfDurum_Igniter2) &&
    isSayisalAlan(value.valfDurum_OksitleyiciValf) &&
    isSayisalAlan(value.valfDurum_OksitleyiciYedekValf) &&
    isSayisalAlan(value.itkiSistemDurum) &&
    isSayisalAlan(value.itkiOperasyonCevrim) &&
    isSayisalAlan(value.itkiHazirlikCevrim) &&
    isSayisalAlan(value.itkiTahliyeDurum) &&
    isSayisalAlan(value.aphisDurum) &&
    isSayisalAlan(value.rksDurum) &&
    isSayisalAlan(value.valfKomutMod) &&
    isSayisalAlan(value.seciliAtesleyici) &&
    isSayisalAlan(value.imu_pitch) &&
    isSayisalAlan(value.imu_roll) &&
    isSayisalAlan(value.imu_yaw) &&
    isOpsiyonelSayisalAlan(value.batarya_yuzde) &&
    isSayisalAlan(value.PT1) &&
    isSayisalAlan(value.PT2) &&
    isSayisalAlan(value.PT3) &&
    isSayisalAlan(value.PT4) &&
    isSayisalAlan(value.PT5) &&
    isSayisalAlan(value.TC1) &&
    isSayisalAlan(value.TC2)
  );
}
