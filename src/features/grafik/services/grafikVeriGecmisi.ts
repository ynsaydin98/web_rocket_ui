// Grafik sayfasının zaman serisi tamponu. Kayıtlı her paket kaynağına
// (config/grafikKaynaklari.ts) subscribe olur, gelen her örneği kaynak
// bazlı ring buffer'da saklar ve grafikVeriStore versiyonunu artırarak
// grafiklerin yeniden çizilmesini tetikler. App.tsx yaşam döngüsünde
// start/stop edilir (UI publisher'larla aynı desen).

import { GRAFIK_KAYNAKLARI } from "../config/grafikKaynaklari";
import { useGrafikVeriStore } from "../store/grafikVeriStore";

export type GrafikOrnek = {
  t: number;
  degerler: Record<string, number>;
};

/** Kaynak başına saklanan örnek sayısı (100 ms yayında ~30 sn pencere). */
const MAX_ORNEK = 300;

const gecmis = new Map<string, GrafikOrnek[]>();
let unsubscribers: Array<() => void> | undefined;

export function startGrafikVeriGecmisi() {
  if (unsubscribers) return;

  unsubscribers = GRAFIK_KAYNAKLARI.map((kaynak) =>
    kaynak.subscribe(() => {
      const snapshot = kaynak.getSnapshot();
      if (!snapshot) return;

      let buffer = gecmis.get(kaynak.id);
      if (!buffer) {
        buffer = [];
        gecmis.set(kaynak.id, buffer);
      }

      buffer.push({ t: Date.now(), degerler: snapshot });
      if (buffer.length > MAX_ORNEK) buffer.shift();

      useGrafikVeriStore.getState().bump();
    }),
  );
}

export function stopGrafikVeriGecmisi() {
  if (!unsubscribers) return;
  for (const unsubscribe of unsubscribers) unsubscribe();
  unsubscribers = undefined;
}

export function getGrafikGecmisi(kaynakId: string): GrafikOrnek[] {
  return gecmis.get(kaynakId) ?? [];
}
