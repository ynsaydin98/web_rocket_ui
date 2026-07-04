import type { MKUItkiDiagnostikPaket } from "../../paketler/mku/mkuItkiDiagnostikPaket";
import type { MKUItkiDiagnostikPaketUiModel } from "../../ui-models/mku/mkuItkiDiagnostikPaketUiModel";

export function mapMKUItkiDiagnostikPaketToOzet(
  mesaj: MKUItkiDiagnostikPaket,
): MKUItkiDiagnostikPaketUiModel {
  return {
    itkiOpDurumlari: mesaj.itkiOpDurumlari,
    opGecenSure_ms: mesaj.opGecenSure_ms,
    itkiBaslatmaGeriSayim_sn: mesaj.itkiBaslatmaGeriSayim_sn,
    acilDurdurDurum: mesaj.acilDurdurDurum,
    acilDurdurBasla: mesaj.acilDurdurBasla,
    komutItkiSuresi_ms: mesaj.komutItkiSuresi_ms,
    tahliyeGecenSure: mesaj.tahliyeGecenSure,
    itkiGecenSure_ms: mesaj.itkiGecenSure_ms,
    kalanItkiSuresi_ms: mesaj.kalanItkiSuresi_ms,
    kalanTahliyeSuresi_ms: mesaj.kalanTahliyeSuresi_ms,
    kalanAcilDurdurSuresi_ms: mesaj.kalanAcilDurdurSuresi_ms,
    acilDurdurGecenSure_ms: mesaj.acilDurdurGecenSure_ms,
    sistemSaati_ms: mesaj.sistemSaati_ms,
    sonIslemSuresi_ms: mesaj.sonIslemSuresi_ms,
    islemDurumlari: mesaj.islemDurumlari,

    valfDurum_Igniter1: mesaj.valfDurum_Igniter1,
    valfDurum_Igniter2: mesaj.valfDurum_Igniter2,
    valfDurum_OksitleyiciValf: mesaj.valfDurum_OksitleyiciValf,
    valfDurum_OksitleyiciYedekValf: mesaj.valfDurum_OksitleyiciYedekValf,

    itkiSistemDurum: mesaj.itkiSistemDurum,
    itkiOperasyonCevrim: mesaj.itkiOperasyonCevrim,
    itkiHazirlikCevrim: mesaj.itkiHazirlikCevrim,
    itkiTahliyeDurum: mesaj.itkiTahliyeDurum,
    aphisDurum: mesaj.aphisDurum,
    rksDurum: mesaj.rksDurum,
    valfKomutMod: mesaj.valfKomutMod,
    seciliAtesleyici: mesaj.seciliAtesleyici,
  };
}
