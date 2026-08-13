export type MKUItkiDiagnostikPaketUiModel = {
  itkiOpDurumlari: number | undefined;
  opGecenSure_ms: number | undefined;
  itkiBaslatmaGeriSayim_sn: number | undefined;
  acilDurdurDurum: number | undefined;
  acilDurdurBasla: number | undefined;
  komutItkiSuresi_ms: number | undefined;
  tahliyeGecenSure: number | undefined;
  itkiGecenSure_ms: number | undefined;
  kalanItkiSuresi_ms: number | undefined;
  kalanTahliyeSuresi_ms: number | undefined;
  kalanAcilDurdurSuresi_ms: number | undefined;
  acilDurdurGecenSure_ms: number | undefined;
  sistemSaati_ms: number | undefined;
  sonIslemSuresi_ms: number | undefined;
  islemDurumlari: number | undefined;

  valfDurum_Igniter1: number | undefined;
  valfDurum_Igniter2: number | undefined;
  valfDurum_OksitleyiciValf: number | undefined;
  valfDurum_OksitleyiciYedekValf: number | undefined;

  itkiSistemDurum: number | undefined;
  itkiOperasyonCevrim: number | undefined;
  itkiHazirlikCevrim: number | undefined;
  itkiTahliyeDurum: number | undefined;
  aphisDurum: number | undefined;
  rksDurum: number | undefined;
  valfKomutMod: number | undefined;
  seciliAtesleyici: number | undefined;
  imu_pitch: number | undefined;
  imu_roll: number | undefined;
  imu_yaw: number | undefined;

  /** Batarya doluluk yüzdesi (0-100); alan gelmediyse undefined. */
  batarya_yuzde: number | undefined;

  PT1: number | undefined;
  PT2: number | undefined;
  PT3: number | undefined;
  PT4: number | undefined;
  PT5: number | undefined;
  TC1: number | undefined;
  TC2: number | undefined;
};
