import type { SayisalAlan } from "../../shared/utils/sayisalDogrulama";

export type MKUItkiDiagnostikPaket = {
  itkiOpDurumlari: SayisalAlan;
  opGecenSure_ms: SayisalAlan;
  itkiBaslatmaGeriSayim_sn: SayisalAlan;
  acilDurdurDurum: SayisalAlan;
  acilDurdurBasla: SayisalAlan;
  komutItkiSuresi_ms: SayisalAlan;
  tahliyeGecenSure: SayisalAlan;
  itkiGecenSure_ms: SayisalAlan;
  kalanItkiSuresi_ms: SayisalAlan;
  kalanTahliyeSuresi_ms: SayisalAlan;
  kalanAcilDurdurSuresi_ms: SayisalAlan;
  acilDurdurGecenSure_ms: SayisalAlan;
  sistemSaati_ms: SayisalAlan;
  sonIslemSuresi_ms: SayisalAlan;
  islemDurumlari: SayisalAlan;

  valfDurum_Igniter1: SayisalAlan;
  valfDurum_Igniter2: SayisalAlan;
  valfDurum_OksitleyiciValf: SayisalAlan;
  valfDurum_OksitleyiciYedekValf: SayisalAlan;

  itkiSistemDurum: SayisalAlan;
  itkiOperasyonCevrim: SayisalAlan;
  itkiHazirlikCevrim: SayisalAlan;
  itkiTahliyeDurum: SayisalAlan;
  aphisDurum: SayisalAlan;
  rksDurum: SayisalAlan;
  valfKomutMod: SayisalAlan;
  seciliAtesleyici: SayisalAlan;
  imu_pitch: SayisalAlan;
  imu_roll: SayisalAlan;
  imu_yaw: SayisalAlan;

  PT1: SayisalAlan;
  PT2: SayisalAlan;
  PT3: SayisalAlan;
  PT4: SayisalAlan;
  PT5: SayisalAlan;
  TC1: SayisalAlan;
  TC2: SayisalAlan;
};
