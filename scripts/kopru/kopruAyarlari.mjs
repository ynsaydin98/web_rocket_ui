// Kopru ayarlari .env dosyasindan okunur; ayni VITE_* degerlerini arayuz de
// src/app/appConfig.ts uzerinden gorur. Boylece adres/port ayari tek yerde
// kalir.

import { readFileSync } from "node:fs";
import { join } from "node:path";

function readEnvFile(kokDizin, fileName) {
  try {
    const content = readFileSync(join(kokDizin, fileName), "utf8");
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

export function kopruAyarlariniOku(kokDizin = process.cwd()) {
  const envValues = {
    ...readEnvFile(kokDizin, ".env.example"),
    ...readEnvFile(kokDizin, ".env"),
    ...process.env,
  };

  const readText = (key, fallback) => {
    const value = envValues[key];
    return value?.trim() ? value.trim() : fallback;
  };

  const readNumber = (key, fallback) => {
    const parsed = Number(envValues[key]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  return {
    aktif: readText("VITE_KOPRU_AKTIF", "true") === "true",
    seriPortYolu: readText("VITE_SERI_PORT_YOLU", ""),
    seriBaud: readNumber("VITE_SERI_BAUD", 115200),
    kriptoUdpIp: readText("VITE_KRIPTO_UDP_IP", "127.0.0.1"),
    kriptoUdpPort: readNumber("VITE_KRIPTO_UDP_PORT", 6000),
    udpDinlemePort: readNumber("VITE_KOPRU_UDP_DINLEME_PORT", 6001),
    httpPort: readNumber("VITE_KOPRU_HTTP_PORT", 5050),
    yenidenDenemeMs: readNumber("VITE_KOPRU_YENIDEN_DENEME_MS", 3000),
    otomatikBaslat: readText("VITE_KOPRU_OTOMATIK_BASLAT", "false") === "true",
  };
}
