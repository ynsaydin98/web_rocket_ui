import { useGrafikVeriStore } from "../../grafik/store/grafikVeriStore";
import {
  getGostergeDeger,
  type GostergeLimit,
  type GostergeTanim,
} from "../config/gostergeTanimlari";

type Props = {
  tanim: GostergeTanim;
};

type Durum = "notr" | "iyi" | "ihlal";

function hesaplaDurum(
  deger: number | undefined,
  limit: GostergeLimit | undefined,
): Durum {
  if (deger === undefined) return "notr";
  if (!limit || (limit.min === undefined && limit.max === undefined)) return "notr";
  if (limit.min !== undefined && deger < limit.min) return "ihlal";
  if (limit.max !== undefined && deger > limit.max) return "ihlal";
  return "iyi";
}

/** Tek parametreyi büyük puntoyla gösteren kart; limitler config'de gömülüdür. */
export function GostergeKarti({ tanim }: Props) {
  // React Compiler devre dışı: getGostergeDeger() render sırasında store
  // dışından (grafik kaynak snapshot'ından) okuma yapıyor. Derleyici bu
  // çağrıyı tek girdisi olan `tanim`e göre önbelleğe alıyor; `tanim` modül
  // seviyesinde sabit olduğu için değer ilk render'da donup kalıyordu.
  "use no memo";

  // Kart, canlı değerin versiyon sayacına KENDİSİ subscribe olur; parent'ın
  // render'ına güvenilmez (grafik panellerindeki desenle aynı gerekçe).
  useGrafikVeriStore((s) => s.versiyon);
  const deger = getGostergeDeger(tanim);

  const limit = tanim.limit;
  const durum = hesaplaDurum(deger, limit);
  const degerText =
    deger === undefined ? "--" : deger.toFixed(tanim.digit ?? 1);
  const limitVar =
    limit !== undefined && (limit.min !== undefined || limit.max !== undefined);

  return (
    <section className={`gosterge-kart gosterge-kart--${durum}`}>
      <header className="gosterge-kart__ust">
        <span className="gosterge-kart__baslik" title={tanim.baslik}>
          {tanim.baslik}
        </span>
      </header>

      <div className="gosterge-kart__deger-satir">
        <strong className="gosterge-kart__deger">{degerText}</strong>
        {tanim.birim && (
          <span className="gosterge-kart__birim">{tanim.birim}</span>
        )}
      </div>
      {limitVar && (
        <footer className="gosterge-kart__alt">
          <span className="gosterge-kart__limit-etiket">
            {limit.min !== undefined && `min ${limit.min}`}
            {limit.min !== undefined && limit.max !== undefined && " · "}
            {limit.max !== undefined && `maks ${limit.max}`}
          </span>
        </footer>
      )}
    </section>
  );
}
