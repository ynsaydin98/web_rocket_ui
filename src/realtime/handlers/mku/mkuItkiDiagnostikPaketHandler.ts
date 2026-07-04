import { MessageTypes } from "../../../contracts/messageTypes";
import type { RealtimeMessageEnvelope } from "../../../contracts/realtimeMessageEnvelope";
import { mapMKUItkiDiagnostikPaketToOzet } from "../../../mapper/mku/mkuItkiDiagnostikPaketMapper";
import type { MKUItkiDiagnostikPaket } from "../../../paketler/mku/mkuItkiDiagnostikPaket";
import { ingestMKUItkiDiagnostikPaketForUi } from "../../../storeServices/mku/mkuItkiDiagnostikPaketUiPublisher";
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
    typeof value.itkiOpDurumlari === "number" &&
    typeof value.opGecenSure_ms === "number" &&
    typeof value.itkiBaslatmaGeriSayim_sn === "number" &&
    typeof value.acilDurdurDurum === "number" &&
    typeof value.acilDurdurBasla === "number" &&
    typeof value.komutItkiSuresi_ms === "number" &&
    typeof value.tahliyeGecenSure === "number" &&
    typeof value.itkiGecenSure_ms === "number" &&
    typeof value.kalanItkiSuresi_ms === "number" &&
    typeof value.kalanTahliyeSuresi_ms === "number" &&
    typeof value.kalanAcilDurdurSuresi_ms === "number" &&
    typeof value.acilDurdurGecenSure_ms === "number" &&
    typeof value.sistemSaati_ms === "number" &&
    typeof value.sonIslemSuresi_ms === "number" &&
    typeof value.islemDurumlari === "number" &&
    typeof value.valfDurum_Igniter1 === "number" &&
    typeof value.valfDurum_Igniter2 === "number" &&
    typeof value.valfDurum_OksitleyiciValf === "number" &&
    typeof value.valfDurum_OksitleyiciYedekValf === "number" &&
    typeof value.itkiSistemDurum === "number" &&
    typeof value.itkiOperasyonCevrim === "number" &&
    typeof value.itkiHazirlikCevrim === "number" &&
    typeof value.itkiTahliyeDurum === "number" &&
    typeof value.aphisDurum === "number" &&
    typeof value.rksDurum === "number" &&
    typeof value.valfKomutMod === "number" &&
    typeof value.seciliAtesleyici === "number" &&
    typeof value.imu_pitch === "number" &&
    typeof value.imu_roll === "number" &&
    typeof value.imu_yaw === "number" &&
    typeof value.PT1 === "number" &&
    typeof value.PT2 === "number" &&
    typeof value.PT3 === "number" &&
    typeof value.PT4 === "number" &&
    typeof value.PT5 === "number" &&
    typeof value.TC1 === "number" &&
    typeof value.TC2 === "number"
  );
}
