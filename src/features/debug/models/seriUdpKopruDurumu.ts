export type KopruCalismaDurumu = "kapali" | "aciliyor" | "acik" | "hata";

// scripts/seriUdpKopru.mjs surecinin /durum ucundan donen model.
export type SeriUdpKopruDurumu = {
  durum: KopruCalismaDurumu;
  seriPortYolu: string;
  seriBaud: number;
  kriptoUdpIp: string;
  kriptoUdpPort: number;
  udpDinlemePort: number;
  seriOkunanBayt: number;
  seriYazilanBayt: number;
  udpGonderilenPaket: number;
  udpAlinanPaket: number;
  sonHata?: string;
  sonSeriVeriZamani?: string;
  sonUdpVeriZamani?: string;
  baslangicZamani?: string;
};
