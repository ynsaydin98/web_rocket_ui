// Kopruyu Vite sunucusunun icinde calistiran eklenti.
//
// Boylece ayri bir terminalde `npm run kopru` calistirmaya gerek kalmaz:
// `npm run dev` / `npm run preview` ile kopru de ayaga kalkar ve arayuz
// ayni origin uzerinden /__kopru uclarini kullanir.

import { kopruAyarlariniOku } from "./kopruAyarlari.mjs";
import { createSeriUdpKopru, kopruIstegiKarsila } from "./seriUdpKopru.mjs";

export const KOPRU_TEMEL_YOL = "/__kopru";

export function seriUdpKopruPlugin() {
  let kopru;
  let ayarlar;

  function kopruyuHazirla(server) {
    ayarlar ??= kopruAyarlariniOku(server.config?.root ?? process.cwd());

    if (!ayarlar.aktif) return undefined;

    kopru ??= createSeriUdpKopru(ayarlar, (mesaj, seviye) => {
      const satir = `[seri-udp-kopru] ${mesaj}`;
      if (seviye === "hata") console.error(satir);
      else console.log(satir);
    });

    return kopru;
  }

  function eklentiyiBagla(server) {
    const aktifKopru = kopruyuHazirla(server);

    if (!aktifKopru) {
      console.log("[seri-udp-kopru] VITE_KOPRU_AKTIF=false, kopru kapali.");
      return;
    }

    server.middlewares.use((request, response, next) => {
      const istekYolu = (request.url ?? "/").split("?")[0];

      if (!istekYolu.startsWith(KOPRU_TEMEL_YOL)) {
        next();
        return;
      }

      const yol = istekYolu.slice(KOPRU_TEMEL_YOL.length) || "/";

      kopruIstegiKarsila(aktifKopru, request, response, yol)
        .then((karsilandi) => {
          if (!karsilandi) next();
        })
        .catch(next);
    });

    console.log(
      `[seri-udp-kopru] Durum ucu hazir: ${KOPRU_TEMEL_YOL}/durum -> udp://${ayarlar.kriptoUdpIp}:${ayarlar.kriptoUdpPort}`,
    );

    if (ayarlar.otomatikBaslat) aktifKopru.baslat();

    // Sunucu kapaninca seri port ve UDP soketi birakilir.
    server.httpServer?.on("close", () => aktifKopru.durdur());
  }

  return {
    name: "seri-udp-kopru",
    apply: "serve",
    configureServer: eklentiyiBagla,
    configurePreviewServer: eklentiyiBagla,
  };
}
