import type { MKUItkiKomutaPaket } from "../../paketler/mku/mkuItkiKomutaPaket";
import type { MKUItkiKomutaPaketUiModel } from "../../ui-models/mku/mkuItkiKomutaPaketUiModel";

export function mapMKUItkiKomutaPaketToOzet(
  mesaj: MKUItkiKomutaPaket,
): MKUItkiKomutaPaketUiModel {
  return {
    geriSayim_sn: mesaj.geriSayim_sn,
    anahtarKontrolu: mesaj.anahtarKontrolu,
    seciliValf_0: mesaj.seciliValf_0,
    seciliIslem_0: mesaj.seciliIslem_0,
    islemSuresi_0: mesaj.islemSuresi_0,
    seciliValf_1: mesaj.seciliValf_1,
    seciliIslem_1: mesaj.seciliIslem_1,
    islemSuresi_1: mesaj.islemSuresi_1,
    seciliValf_2: mesaj.seciliValf_2,
    seciliIslem_2: mesaj.seciliIslem_2,
    islemSuresi_2: mesaj.islemSuresi_2,
    seciliValf_3: mesaj.seciliValf_3,
    seciliIslem_3: mesaj.seciliIslem_3,
    islemSuresi_3: mesaj.islemSuresi_3,
    seciliValf_4: mesaj.seciliValf_4,
    seciliIslem_4: mesaj.seciliIslem_4,
    islemSuresi_4: mesaj.islemSuresi_4,
    seciliValf_5: mesaj.seciliValf_5,
    seciliIslem_5: mesaj.seciliIslem_5,
    islemSuresi_5: mesaj.islemSuresi_5,
    seciliValf_6: mesaj.seciliValf_6,
    seciliIslem_6: mesaj.seciliIslem_6,
    islemSuresi_6: mesaj.islemSuresi_6,
    seciliValf_7: mesaj.seciliValf_7,
    seciliIslem_7: mesaj.seciliIslem_7,
    islemSuresi_7: mesaj.islemSuresi_7,
    seciliValf_8: mesaj.seciliValf_8,
    seciliIslem_8: mesaj.seciliIslem_8,
    islemSuresi_8: mesaj.islemSuresi_8,
    seciliValf_9: mesaj.seciliValf_9,
    seciliIslem_9: mesaj.seciliIslem_9,
    islemSuresi_9: mesaj.islemSuresi_9,
  };
}
