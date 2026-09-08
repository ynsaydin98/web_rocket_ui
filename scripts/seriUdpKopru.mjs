// Seri Port <-> UDP koprusu.
//
// Tarayici UDP soketi acamaz; bu yuzden seri porttan okuma ve Kripto servise
// UDP gonderme isini arayuz degil, operator bilgisayarinda calisan bu Node
// sureci yapar. Veri akisi:
//
//   Seri Port -> (UDP) -> Kripto Servis -> HAM2VERI -> (WebSocket) -> Arayuz
//   Kripto Servis -> (UDP) -> bu kopru -> Seri Port
//
// Ayarlar .env dosyasindan okunur; ayni degerleri arayuz de appConfig
// uzerinden gorur. Kopru durumu ve baslat/durdur ucu localhost HTTP
// sunucusundan verilir, Hata Ayiklama sayfasi bu ucu kullanir.

import { createServer } from "node:http";
import { createSocket } from "node:dgram";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SerialPort } from "serialport";

function readEnvFile(fileName) {
  try {
    const content = readFileSync(join(process.cwd(), fileName), "utf8");
    const values = {};

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex <= 0) continue;

      values[trimmed.slice(0, separatorIndex).trim()] = trimmed
        .slice(separatorIndex + 1)
        .trim();
    }

    return values;
  } catch {
    return {};
  }
}

const envValues = { ...readEnvFile(".env.example"), ...readEnvFile(".env"), ...process.env };

function readText(key, fallback) {
  const value = envValues[key];
  return value?.trim() ? value.trim() : fallback;
}

function readNumber(key, fallback) {
  const parsed = Number(envValues[key]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const config = {
  seriPortYolu: readText("VITE_SERI_PORT_YOLU", ""),
  seriBaud: readNumber("VITE_SERI_BAUD", 115200),
  kriptoUdpIp: readText("VITE_KRIPTO_UDP_IP", "127.0.0.1"),
  kriptoUdpPort: readNumber("VITE_KRIPTO_UDP_PORT", 6000),
  udpDinlemePort: readNumber("VITE_KOPRU_UDP_DINLEME_PORT", 6001),
  httpPort: readNumber("VITE_KOPRU_HTTP_PORT", 5050),
  yenidenDenemeMs: readNumber("VITE_KOPRU_YENIDEN_DENEME_MS", 3000),
  otomatikBaslat: readText("VITE_KOPRU_OTOMATIK_BASLAT", "false") === "true",
};

const durum = {
  durum: "kapali",
  seriPortYolu: config.seriPortYolu,
  seriBaud: config.seriBaud,
  kriptoUdpIp: config.kriptoUdpIp,
  kriptoUdpPort: config.kriptoUdpPort,
  udpDinlemePort: config.udpDinlemePort,
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

function log(mesaj) {
  console.log(`[seri-udp-kopru] ${mesaj}`);
}

function hataYaz(mesaj) {
  durum.sonHata = mesaj;
  console.error(`[seri-udp-kopru] ${mesaj}`);
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
    seriPortAc();
  }, config.yenidenDenemeMs);
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

  soket.bind(config.udpDinlemePort, () => {
    log(`UDP dinleniyor: 0.0.0.0:${config.udpDinlemePort}`);
  });
}

function seriPortAc() {
  if (!calisiyor || seriPort) return;

  if (!config.seriPortYolu) {
    durum.durum = "hata";
    hataYaz("VITE_SERI_PORT_YOLU tanimli degil.");
    calisiyor = false;
    return;
  }

  durum.durum = "aciliyor";

  const port = new SerialPort({
    path: config.seriPortYolu,
    baudRate: config.seriBaud,
    autoOpen: false,
  });

  seriPort = port;

  port.on("open", () => {
    durum.durum = "acik";
    durum.sonHata = undefined;
    log(`Seri port acildi: ${config.seriPortYolu} @ ${config.seriBaud}`);
  });

  // Seri porttan gelen ham baytlar oldugu gibi Kripto servise gonderilir.
  port.on("data", (chunk) => {
    durum.seriOkunanBayt += chunk.length;
    durum.sonSeriVeriZamani = new Date().toISOString();

    udpSoketi?.send(chunk, config.kriptoUdpPort, config.kriptoUdpIp, (error) => {
      if (error) {
        hataYaz(`UDP gonderilemedi: ${error.message}`);
        return;
      }

      durum.udpGonderilenPaket += 1;
    });
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

function kopruBaslat() {
  if (calisiyor) return;

  calisiyor = true;
  durum.baslangicZamani = new Date().toISOString();
  durum.sonHata = undefined;

  udpSoketiAc();
  seriPortAc();
}

function kopruDurdur() {
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
}

async function seriPortlariListele() {
  try {
    const portlar = await SerialPort.list();
    return portlar.map((port) => ({
      yol: port.path,
      uretici: port.manufacturer,
      seriNo: port.serialNumber,
    }));
  } catch (error) {
    hataYaz(`Seri portlar listelenemedi: ${error.message}`);
    return [];
  }
}

function jsonYaz(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(body));
}

const httpSunucusu = createServer(async (request, response) => {
  const yol = (request.url ?? "/").split("?")[0];

  if (request.method === "OPTIONS") {
    jsonYaz(response, 204, {});
    return;
  }

  if (request.method === "GET" && yol === "/durum") {
    jsonYaz(response, 200, durum);
    return;
  }

  if (request.method === "GET" && yol === "/portlar") {
    jsonYaz(response, 200, { portlar: await seriPortlariListele() });
    return;
  }

  if (request.method === "POST" && yol === "/baslat") {
    kopruBaslat();
    jsonYaz(response, 200, durum);
    return;
  }

  if (request.method === "POST" && yol === "/durdur") {
    kopruDurdur();
    jsonYaz(response, 200, durum);
    return;
  }

  jsonYaz(response, 404, { hata: "Bilinmeyen uc." });
});

httpSunucusu.listen(config.httpPort, "127.0.0.1", () => {
  log(`Durum ucu hazir: http://127.0.0.1:${config.httpPort}/durum`);
  log(
    `Hedef Kripto servis: udp://${config.kriptoUdpIp}:${config.kriptoUdpPort}`,
  );

  if (config.otomatikBaslat) kopruBaslat();
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    kopruDurdur();
    httpSunucusu.close(() => process.exit(0));
  });
}
