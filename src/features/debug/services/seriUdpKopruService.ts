import { appConfig } from "../../../app/appConfig";
import type { SeriUdpKopruDurumu } from "../models/seriUdpKopruDurumu";
import { useSeriUdpKopruStore } from "../store/seriUdpKopruStore";

const KOPRU_ERISIM_HATASI =
  "Kopru surecine ulasilamadi. Operator bilgisayarinda `npm run kopru` calisiyor mu?";

async function kopruyeIstek(
  yol: string,
  method: "GET" | "POST",
): Promise<SeriUdpKopruDurumu | undefined> {
  try {
    const response = await fetch(`${appConfig.kopruDurumUrl}${yol}`, {
      method: method,
    });

    if (!response.ok) {
      useSeriUdpKopruStore
        .getState()
        .setHata(`Kopru istegi basarisiz: HTTP ${response.status}`);
      return undefined;
    }

    const durum = (await response.json()) as SeriUdpKopruDurumu;
    useSeriUdpKopruStore.getState().setDurum(durum);

    return durum;
  } catch {
    useSeriUdpKopruStore.getState().setHata(KOPRU_ERISIM_HATASI);
    return undefined;
  }
}

export function kopruDurumuOku() {
  return kopruyeIstek("/durum", "GET");
}

export function kopruBaslat() {
  return kopruyeIstek("/baslat", "POST");
}

export function kopruDurdur() {
  return kopruyeIstek("/durdur", "POST");
}

// Durum ucu HTTP oldugu icin arayuz belirli araliklarla yoklar; aralik
// appConfig uzerinden ayarlanir.
export function kopruDurumTakibiBaslat() {
  void kopruDurumuOku();

  const timer = window.setInterval(() => {
    void kopruDurumuOku();
  }, appConfig.kopruDurumAralikMs);

  return () => window.clearInterval(timer);
}
