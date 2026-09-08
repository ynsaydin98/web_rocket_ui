// Kopruyu bagimsiz surec olarak calistirir (`npm run kopru`).
//
// Normalde kopru Vite sunucusunun icinde calisir (scripts/kopru/
// kopruVitePlugin.mjs) ve ayrica calistirilmasi gerekmez. Bu giris noktasi,
// arayuzun uretim derlemesi baska bir sunucudan yayinlandiginda ya da kopru
// arayuzden bagimsiz calistirilmak istendiginde kullanilir.

import { createServer } from "node:http";
import { kopruAyarlariniOku } from "./kopru/kopruAyarlari.mjs";
import {
  createSeriUdpKopru,
  kopruIstegiKarsila,
} from "./kopru/seriUdpKopru.mjs";

const ayarlar = kopruAyarlariniOku();

const kopru = createSeriUdpKopru(ayarlar, (mesaj, seviye) => {
  const satir = `[seri-udp-kopru] ${mesaj}`;
  if (seviye === "hata") console.error(satir);
  else console.log(satir);
});

const httpSunucusu = createServer((request, response) => {
  const yol = (request.url ?? "/").split("?")[0];

  kopruIstegiKarsila(kopru, request, response, yol)
    .then((karsilandi) => {
      if (karsilandi) return;

      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ hata: "Bilinmeyen uc." }));
    })
    .catch((error) => {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ hata: error.message }));
    });
});

httpSunucusu.listen(ayarlar.httpPort, "127.0.0.1", () => {
  console.log(
    `[seri-udp-kopru] Durum ucu hazir: http://127.0.0.1:${ayarlar.httpPort}/durum`,
  );
  console.log(
    `[seri-udp-kopru] Hedef Kripto servis: udp://${ayarlar.kriptoUdpIp}:${ayarlar.kriptoUdpPort}`,
  );

  if (ayarlar.otomatikBaslat) kopru.baslat();
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    kopru.durdur();
    httpSunucusu.close(() => process.exit(0));
  });
}
