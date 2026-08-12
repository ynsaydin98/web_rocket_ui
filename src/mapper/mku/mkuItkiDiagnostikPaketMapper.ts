import type { MKUItkiDiagnostikPaket } from "../../paketler/mku/mkuItkiDiagnostikPaket";
import { sayisalDeger } from "../../shared/utils/sayisalDogrulama";
import type { MKUItkiDiagnostikPaketUiModel } from "../../ui-models/mku/mkuItkiDiagnostikPaketUiModel";

export function mapMKUItkiDiagnostikPaketToOzet(
  mesaj: MKUItkiDiagnostikPaket,
): MKUItkiDiagnostikPaketUiModel {
  return {
    itkiOpDurumlari: sayisalDeger(mesaj.itkiOpDurumlari),
    opGecenSure_ms: sayisalDeger(mesaj.opGecenSure_ms),
    itkiBaslatmaGeriSayim_sn: sayisalDeger(mesaj.itkiBaslatmaGeriSayim_sn),
    acilDurdurDurum: sayisalDeger(mesaj.acilDurdurDurum),
    acilDurdurBasla: sayisalDeger(mesaj.acilDurdurBasla),
    komutItkiSuresi_ms: sayisalDeger(mesaj.komutItkiSuresi_ms),
    tahliyeGecenSure: sayisalDeger(mesaj.tahliyeGecenSure),
    itkiGecenSure_ms: sayisalDeger(mesaj.itkiGecenSure_ms),
    kalanItkiSuresi_ms: sayisalDeger(mesaj.kalanItkiSuresi_ms),
    kalanTahliyeSuresi_ms: sayisalDeger(mesaj.kalanTahliyeSuresi_ms),
    kalanAcilDurdurSuresi_ms: sayisalDeger(mesaj.kalanAcilDurdurSuresi_ms),
    acilDurdurGecenSure_ms: sayisalDeger(mesaj.acilDurdurGecenSure_ms),
    sistemSaati_ms: sayisalDeger(mesaj.sistemSaati_ms),
    sonIslemSuresi_ms: sayisalDeger(mesaj.sonIslemSuresi_ms),
    islemDurumlari: sayisalDeger(mesaj.islemDurumlari),

    valfDurum_Igniter1: sayisalDeger(mesaj.valfDurum_Igniter1),
    valfDurum_Igniter2: sayisalDeger(mesaj.valfDurum_Igniter2),
    valfDurum_OksitleyiciValf: sayisalDeger(mesaj.valfDurum_OksitleyiciValf),
    valfDurum_OksitleyiciYedekValf: sayisalDeger(mesaj.valfDurum_OksitleyiciYedekValf),

    itkiSistemDurum: sayisalDeger(mesaj.itkiSistemDurum),
    itkiOperasyonCevrim: sayisalDeger(mesaj.itkiOperasyonCevrim),
    itkiHazirlikCevrim: sayisalDeger(mesaj.itkiHazirlikCevrim),
    itkiTahliyeDurum: sayisalDeger(mesaj.itkiTahliyeDurum),
    aphisDurum: sayisalDeger(mesaj.aphisDurum),
    rksDurum: sayisalDeger(mesaj.rksDurum),
    valfKomutMod: sayisalDeger(mesaj.valfKomutMod),
    seciliAtesleyici: sayisalDeger(mesaj.seciliAtesleyici),
    imu_pitch: sayisalDeger(mesaj.imu_pitch),
    imu_roll: sayisalDeger(mesaj.imu_roll),
    imu_yaw: sayisalDeger(mesaj.imu_yaw),

    PT1: sayisalDeger(mesaj.PT1),
    PT2: sayisalDeger(mesaj.PT2),
    PT3: sayisalDeger(mesaj.PT3),
    PT4: sayisalDeger(mesaj.PT4),
    PT5: sayisalDeger(mesaj.PT5),
    TC1: sayisalDeger(mesaj.TC1),
    TC2: sayisalDeger(mesaj.TC2),
  };
}
