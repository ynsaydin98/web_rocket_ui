// Bu dosya scripts/grafikAlanlariUret.mjs tarafindan uretilir.
// Elle duzenlemeyin; ui-model type alanlari degistiginde script yeniden calistirilir.

export type GeneratedGrafikKaynakAlanlari = {
  messageTypeName: string;
  label: string;
  source: string;
  alanlar: Array<{ key: string; label: string }>;
};

export const GENERATED_GRAFIK_ALANLARI = [
  {
    "messageTypeName": "MKUEepromPaket",
    "label": "MKUEeprom Paket",
    "source": "src/ui-models/mku/mkuEepromPaketUiModel.ts",
    "alanlar": [
      {
        "key": "varsayilan_deger1",
        "label": "varsayilan_deger1"
      },
      {
        "key": "varsayilan_deger2",
        "label": "varsayilan_deger2"
      },
      {
        "key": "varsayilan_deger3",
        "label": "varsayilan_deger3"
      },
      {
        "key": "varsayilan_deger4",
        "label": "varsayilan_deger4"
      },
      {
        "key": "varsayilan_deger5",
        "label": "varsayilan_deger5"
      },
      {
        "key": "varsayilan_deger6",
        "label": "varsayilan_deger6"
      },
      {
        "key": "varsayilan_deger7",
        "label": "varsayilan_deger7"
      },
      {
        "key": "deger1",
        "label": "deger1"
      },
      {
        "key": "deger2",
        "label": "deger2"
      },
      {
        "key": "deger3",
        "label": "deger3"
      },
      {
        "key": "deger4",
        "label": "deger4"
      },
      {
        "key": "deger5",
        "label": "deger5"
      },
      {
        "key": "deger6",
        "label": "deger6"
      },
      {
        "key": "deger7",
        "label": "deger7"
      }
    ]
  },
  {
    "messageTypeName": "MKUItkiDiagnostikPaket",
    "label": "MKUItki Diagnostik Paket",
    "source": "src/ui-models/mku/mkuItkiDiagnostikPaketUiModel.ts",
    "alanlar": [
      {
        "key": "itkiOpDurumlari",
        "label": "itkiOpDurumlari"
      },
      {
        "key": "opGecenSure_ms",
        "label": "opGecenSure_ms"
      },
      {
        "key": "itkiBaslatmaGeriSayim_sn",
        "label": "itkiBaslatmaGeriSayim_sn"
      },
      {
        "key": "acilDurdurDurum",
        "label": "acilDurdurDurum"
      },
      {
        "key": "acilDurdurBasla",
        "label": "acilDurdurBasla"
      },
      {
        "key": "komutItkiSuresi_ms",
        "label": "komutItkiSuresi_ms"
      },
      {
        "key": "tahliyeGecenSure",
        "label": "tahliyeGecenSure"
      },
      {
        "key": "itkiGecenSure_ms",
        "label": "itkiGecenSure_ms"
      },
      {
        "key": "kalanItkiSuresi_ms",
        "label": "kalanItkiSuresi_ms"
      },
      {
        "key": "kalanTahliyeSuresi_ms",
        "label": "kalanTahliyeSuresi_ms"
      },
      {
        "key": "kalanAcilDurdurSuresi_ms",
        "label": "kalanAcilDurdurSuresi_ms"
      },
      {
        "key": "acilDurdurGecenSure_ms",
        "label": "acilDurdurGecenSure_ms"
      },
      {
        "key": "sistemSaati_ms",
        "label": "sistemSaati_ms"
      },
      {
        "key": "sonIslemSuresi_ms",
        "label": "sonIslemSuresi_ms"
      },
      {
        "key": "islemDurumlari",
        "label": "islemDurumlari"
      },
      {
        "key": "valfDurum_Igniter1",
        "label": "valfDurum_Igniter1"
      },
      {
        "key": "valfDurum_Igniter2",
        "label": "valfDurum_Igniter2"
      },
      {
        "key": "valfDurum_OksitleyiciValf",
        "label": "valfDurum_OksitleyiciValf"
      },
      {
        "key": "valfDurum_OksitleyiciYedekValf",
        "label": "valfDurum_OksitleyiciYedekValf"
      },
      {
        "key": "itkiSistemDurum",
        "label": "itkiSistemDurum"
      },
      {
        "key": "itkiOperasyonCevrim",
        "label": "itkiOperasyonCevrim"
      },
      {
        "key": "itkiHazirlikCevrim",
        "label": "itkiHazirlikCevrim"
      },
      {
        "key": "itkiTahliyeDurum",
        "label": "itkiTahliyeDurum"
      },
      {
        "key": "aphisDurum",
        "label": "aphisDurum"
      },
      {
        "key": "rksDurum",
        "label": "rksDurum"
      },
      {
        "key": "valfKomutMod",
        "label": "valfKomutMod"
      },
      {
        "key": "seciliAtesleyici",
        "label": "seciliAtesleyici"
      },
      {
        "key": "imu_pitch",
        "label": "imu_pitch"
      },
      {
        "key": "imu_roll",
        "label": "imu_roll"
      },
      {
        "key": "imu_yaw",
        "label": "imu_yaw"
      },
      {
        "key": "PT1",
        "label": "PT1"
      },
      {
        "key": "PT2",
        "label": "PT2"
      },
      {
        "key": "PT3",
        "label": "PT3"
      },
      {
        "key": "PT4",
        "label": "PT4"
      },
      {
        "key": "PT5",
        "label": "PT5"
      },
      {
        "key": "TC1",
        "label": "TC1"
      },
      {
        "key": "TC2",
        "label": "TC2"
      }
    ]
  },
  {
    "messageTypeName": "MKUItkiKomutaPaket",
    "label": "MKUItki Komuta Paket",
    "source": "src/ui-models/mku/mkuItkiKomutaPaketUiModel.ts",
    "alanlar": [
      {
        "key": "geriSayim_sn",
        "label": "geriSayim_sn"
      },
      {
        "key": "anahtarKontrolu",
        "label": "anahtarKontrolu"
      },
      {
        "key": "seciliValf_0",
        "label": "seciliValf_0"
      },
      {
        "key": "seciliIslem_0",
        "label": "seciliIslem_0"
      },
      {
        "key": "islemSuresi_0",
        "label": "islemSuresi_0"
      },
      {
        "key": "seciliValf_1",
        "label": "seciliValf_1"
      },
      {
        "key": "seciliIslem_1",
        "label": "seciliIslem_1"
      },
      {
        "key": "islemSuresi_1",
        "label": "islemSuresi_1"
      },
      {
        "key": "seciliValf_2",
        "label": "seciliValf_2"
      },
      {
        "key": "seciliIslem_2",
        "label": "seciliIslem_2"
      },
      {
        "key": "islemSuresi_2",
        "label": "islemSuresi_2"
      },
      {
        "key": "seciliValf_3",
        "label": "seciliValf_3"
      },
      {
        "key": "seciliIslem_3",
        "label": "seciliIslem_3"
      },
      {
        "key": "islemSuresi_3",
        "label": "islemSuresi_3"
      },
      {
        "key": "seciliValf_4",
        "label": "seciliValf_4"
      },
      {
        "key": "seciliIslem_4",
        "label": "seciliIslem_4"
      },
      {
        "key": "islemSuresi_4",
        "label": "islemSuresi_4"
      },
      {
        "key": "seciliValf_5",
        "label": "seciliValf_5"
      },
      {
        "key": "seciliIslem_5",
        "label": "seciliIslem_5"
      },
      {
        "key": "islemSuresi_5",
        "label": "islemSuresi_5"
      },
      {
        "key": "seciliValf_6",
        "label": "seciliValf_6"
      },
      {
        "key": "seciliIslem_6",
        "label": "seciliIslem_6"
      },
      {
        "key": "islemSuresi_6",
        "label": "islemSuresi_6"
      },
      {
        "key": "seciliValf_7",
        "label": "seciliValf_7"
      },
      {
        "key": "seciliIslem_7",
        "label": "seciliIslem_7"
      },
      {
        "key": "islemSuresi_7",
        "label": "islemSuresi_7"
      },
      {
        "key": "seciliValf_8",
        "label": "seciliValf_8"
      },
      {
        "key": "seciliIslem_8",
        "label": "seciliIslem_8"
      },
      {
        "key": "islemSuresi_8",
        "label": "islemSuresi_8"
      },
      {
        "key": "seciliValf_9",
        "label": "seciliValf_9"
      },
      {
        "key": "seciliIslem_9",
        "label": "seciliIslem_9"
      },
      {
        "key": "islemSuresi_9",
        "label": "islemSuresi_9"
      }
    ]
  },
  {
    "messageTypeName": "MKUVersiyonPaket",
    "label": "MKUVersiyon Paket",
    "source": "src/ui-models/mku/mkuVersiyonPaketUiModel.ts",
    "alanlar": [
      {
        "key": "major",
        "label": "major"
      },
      {
        "key": "minor",
        "label": "minor"
      },
      {
        "key": "build",
        "label": "build"
      },
      {
        "key": "revision",
        "label": "revision"
      }
    ]
  },
  {
    "messageTypeName": "MKUYoklamaPaket",
    "label": "MKUYoklama Paket",
    "source": "src/ui-models/mku/mkuYoklamaPaketUiModel.ts",
    "alanlar": [
      {
        "key": "Yoklama",
        "label": "Yoklama"
      }
    ]
  }
] as const satisfies readonly GeneratedGrafikKaynakAlanlari[];
