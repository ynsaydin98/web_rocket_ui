// Seri Port <-> UDP koprusunun cekirdegi.
//
// Tarayici UDP soketi acamaz; bu yuzden seri porttan okuma ve Kripto servise
// UDP gonderme isini arayuz degil, operator bilgisayarinda calisan Node
// tarafi yapar. Veri akisi:
//
//   Seri Port -> (UDP) -> Kripto Servis -> HAM2VERI -> (WebSocket) -> Arayuz
//   Kripto Servis -> (UDP) -> bu kopru -> Seri Port
//
// Bu modul HTTP sunucusu acmaz; sadece kopruyu ve istek karsilayicisini
// uretir. Boylece hem Vite dev sunucusunun icinde (kopruVitePlugin.mjs) hem
// de bagimsiz surec olarak (scripts/seriUdpKopru.mjs) kullanilabilir.

import { createSocket } from "node:dgram";

const SERIALPORT_KURULU_DEGIL =
  "serialport paketi bulunamadi. Proje kokunde `npm install` calistirin.";

// serialport yerel derlemeli bir pakettir; kurulu degilse Vite dev sunucusunu
// dusurmemek icin dinamik yuklenir ve hata durum modeline yazilir.
let serialPortModulu;

async function serialPortSinifiniYukle() {
  serialPortModulu ??= import("serialport");
  const { SerialPort } = await serialPortModulu;
  return SerialPort;
}

export function createSeriUdpKopru(ayarlar, log = () => {}) {
  const durum = {
    durum: "kapali",
    seriPortYolu: ayarlar.seriPortYolu,
    seriBaud: ayarlar.seriBaud,
    kriptoUdpIp: ayarlar.kriptoUdpIp,
    kriptoUdpPort: ayarlar.kriptoUdpPort,
    udpDinlemePort: ayarlar.udpDinlemePort,
    seriOkunanBayt: 0,
    seriYazilanBayt: 0,
    udpGonderilenPaket: 0,
    udpAlinanPaket: 0,
    sonHata: undefined,
    sonSeriVeriZamani: undefined,
    sonUdpVeriZamani: undefined,
    baslangicZamani: undefined,
  };

  let seriPort = null;
  let udpSoketi = null;
  let yenidenDenemeZamanlayici = null;
  let calisiyor = false;

  function hataYaz(mesaj) {
    durum.sonHata = mesaj;
    log(mesaj, "hata");
  }

  function yenidenDenemeIptal() {
    if (yenidenDenemeZamanlayici === null) return;

    clearTimeout(yenidenDenemeZamanlayici);
    yenidenDenemeZamanlayici = null;
  }

  function yenidenDenemePlanla() {
    if (!calisiyor || yenidenDenemeZamanlayici !== null) return;

    yenidenDenemeZamanlayici = setTimeout(() => {
      yenidenDenemeZamanlayici = null;
      void seriPortAc();
    }, ayarlar.yenidenDenemeMs);
  }

  function udpSoketiAc() {
    if (udpSoketi) return;

    const soket = createSocket("udp4");
    udpSoketi = soket;

    // Kripto servisten donen mesajlar dogrudan seri porta yazilir.
    soket.on("message", (payload) => {
      durum.udpAlinanPaket += 1;
      durum.sonUdpVeriZamani = new Date().toISOString();

      if (!seriPort?.isOpen) return;

      seriPort.write(payload, (error) => {
        if (error) {
          hataYaz(`Seri porta yazilamadi: ${error.message}`);
          return;
        }

        durum.seriYazilanBayt += payload.length;
      });
    });

    soket.on("error", (error) => {
      hataYaz(`UDP soket hatasi: ${error.message}`);
    });

    soket.bind(ayarlar.udpDinlemePort, () => {
      log(`UDP dinleniyor: 0.0.0.0:${ayarlar.udpDinlemePort}`);
    });
  }

  async function seriPortAc() {
    if (!calisiyor || seriPort) return;

    if (!ayarlar.seriPortYolu) {
      durum.durum = "hata";
      hataYaz("VITE_SERI_PORT_YOLU tanimli degil.");
      calisiyor = false;
      return;
    }

    durum.durum = "aciliyor";

    let SerialPort;

    try {
      SerialPort = await serialPortSinifiniYukle();
    } catch {
      durum.durum = "hata";
      hataYaz(SERIALPORT_KURULU_DEGIL);
      calisiyor = false;
      return;
    }

    if (!calisiyor) return;

    const port = new SerialPort({
      path: ayarlar.seriPortYolu,
      baudRate: ayarlar.seriBaud,
      autoOpen: false,
    });

    seriPort = port;

    port.on("open", () => {
      durum.durum = "acik";
      durum.sonHata = undefined;
      log(`Seri port acildi: ${ayarlar.seriPortYolu} @ ${ayarlar.seriBaud}`);
    });

    // Seri porttan gelen ham baytlar oldugu gibi Kripto servise gonderilir.
    port.on("data", (chunk) => {
      durum.seriOkunanBayt += chunk.length;
      durum.sonSeriVeriZamani = new Date().toISOString();

      udpSoketi?.send(
        chunk,
        ayarlar.kriptoUdpPort,
        ayarlar.kriptoUdpIp,
        (error) => {
          if (error) {
            hataYaz(`UDP gonderilemedi: ${error.message}`);
            return;
          }

          durum.udpGonderilenPaket += 1;
        },
      );
    });

    port.on("error", (error) => {
      if (seriPort !== port) return;

      durum.durum = "hata";
      hataYaz(`Seri port hatasi: ${error.message}`);
    });

    port.on("close", () => {
      if (seriPort !== port) return;

      seriPort = null;

      if (!calisiyor) {
        durum.durum = "kapali";
        return;
      }

      durum.durum = "aciliyor";
      log("Seri port kapandi, yeniden denenecek.");
      yenidenDenemePlanla();
    });

    port.open((error) => {
      if (!error) return;

      durum.durum = "hata";
      hataYaz(`Seri port acilamadi: ${error.message}`);
      seriPort = null;
      yenidenDenemePlanla();
    });
  }

  function baslat() {
    if (calisiyor) return durum;

    calisiyor = true;
    durum.baslangicZamani = new Date().toISOString();
    durum.sonHata = undefined;

    udpSoketiAc();
    void seriPortAc();

    return durum;
  }

  function durdur() {
    calisiyor = false;
    yenidenDenemeIptal();

    const acikPort = seriPort;
    seriPort = null;
    if (acikPort?.isOpen) acikPort.close();

    const acikSoket = udpSoketi;
    udpSoketi = null;
    acikSoket?.close();

    durum.durum = "kapali";
    log("Kopru durduruldu.");

    return durum;
  }

  async function portlariListele() {
    try {
      const SerialPort = await serialPortSinifiniYukle();
      const portlar = await SerialPort.list();

      return portlar.map((port) => ({
        yol: port.path,
        uretici: port.manufacturer,
        seriNo: port.serialNumber,
      }));
    } catch {
      hataYaz(SERIALPORT_KURULU_DEGIL);
      return [];
    }
  }

  return { durum, baslat, durdur, portlariListele };
}

function jsonYaz(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(body));
}

// Hem bagimsiz HTTP sunucusu hem Vite ara katmani ayni uclari kullanir.
// Islenen istekte true, bilinmeyen yolda false doner.
export async function kopruIstegiKarsila(kopru, request, response, yol) {
  if (request.method === "OPTIONS") {
    jsonYaz(response, 204, {});
    return true;
  }

  if (request.method === "GET" && yol === "/durum") {
    jsonYaz(response, 200, kopru.durum);
    return true;
  }

  if (request.method === "GET" && yol === "/portlar") {
    jsonYaz(response, 200, { portlar: await kopru.portlariListele() });
    return true;
  }

  if (request.method === "POST" && yol === "/baslat") {
    jsonYaz(response, 200, kopru.baslat());
    return true;
  }

  if (request.method === "POST" && yol === "/durdur") {
    jsonYaz(response, 200, kopru.durdur());
    return true;
  }

  return false;
}
