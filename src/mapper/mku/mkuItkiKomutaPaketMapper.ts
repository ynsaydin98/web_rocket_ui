import type { MKUItkiKomutaPaket } from "../../paketler/mku/mkuItkiKomutaPaket";
import { sayisalDeger } from "../../shared/utils/sayisalDogrulama";
import type { MKUItkiKomutaPaketUiModel } from "../../ui-models/mku/mkuItkiKomutaPaketUiModel";

export function mapMKUItkiKomutaPaketToOzet(
  mesaj: MKUItkiKomutaPaket,
): MKUItkiKomutaPaketUiModel {
  return {
    geriSayim_sn: sayisalDeger(mesaj.geriSayim_sn),
    anahtarKontrolu: sayisalDeger(mesaj.anahtarKontrolu),
    seciliValf_0: sayisalDeger(mesaj.seciliValf_0),
    seciliIslem_0: sayisalDeger(mesaj.seciliIslem_0),
    islemSuresi_0: sayisalDeger(mesaj.islemSuresi_0),
    seciliValf_1: sayisalDeger(mesaj.seciliValf_1),
    seciliIslem_1: sayisalDeger(mesaj.seciliIslem_1),
    islemSuresi_1: sayisalDeger(mesaj.islemSuresi_1),
    seciliValf_2: sayisalDeger(mesaj.seciliValf_2),
    seciliIslem_2: sayisalDeger(mesaj.seciliIslem_2),
    islemSuresi_2: sayisalDeger(mesaj.islemSuresi_2),
    seciliValf_3: sayisalDeger(mesaj.seciliValf_3),
    seciliIslem_3: sayisalDeger(mesaj.seciliIslem_3),
    islemSuresi_3: sayisalDeger(mesaj.islemSuresi_3),
    seciliValf_4: sayisalDeger(mesaj.seciliValf_4),
    seciliIslem_4: sayisalDeger(mesaj.seciliIslem_4),
    islemSuresi_4: sayisalDeger(mesaj.islemSuresi_4),
    seciliValf_5: sayisalDeger(mesaj.seciliValf_5),
    seciliIslem_5: sayisalDeger(mesaj.seciliIslem_5),
    islemSuresi_5: sayisalDeger(mesaj.islemSuresi_5),
    seciliValf_6: sayisalDeger(mesaj.seciliValf_6),
    seciliIslem_6: sayisalDeger(mesaj.seciliIslem_6),
    islemSuresi_6: sayisalDeger(mesaj.islemSuresi_6),
    seciliValf_7: sayisalDeger(mesaj.seciliValf_7),
    seciliIslem_7: sayisalDeger(mesaj.seciliIslem_7),
    islemSuresi_7: sayisalDeger(mesaj.islemSuresi_7),
    seciliValf_8: sayisalDeger(mesaj.seciliValf_8),
    seciliIslem_8: sayisalDeger(mesaj.seciliIslem_8),
    islemSuresi_8: sayisalDeger(mesaj.islemSuresi_8),
    seciliValf_9: sayisalDeger(mesaj.seciliValf_9),
    seciliIslem_9: sayisalDeger(mesaj.seciliIslem_9),
    islemSuresi_9: sayisalDeger(mesaj.islemSuresi_9),
  };
}
