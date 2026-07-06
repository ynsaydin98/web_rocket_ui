import { useState } from "react";
import { useGrafikVeriStore } from "../../grafik/store/grafikVeriStore";
import { getGostergeDeger, type GostergeTanim } from "../config/gostergeTanimlari";
import type { GostergeLimit } from "../store/gostergeLimitStore";

type Props = {
  tanim: GostergeTanim;
  limit: GostergeLimit | undefined;
  onLimitKaydet: (limit: GostergeLimit) => void;
  onLimitTemizle: () => void;
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

function parseLimitInput(metin: string): number | undefined {
  if (!metin.trim()) return undefined;
  const sayi = Number(metin.replace(",", "."));
  return Number.isFinite(sayi) ? sayi : undefined;
}

function fmtLimit(deger: number | undefined): string {
  return deger === undefined ? "" : String(deger);
}

/** Tek parametreyi büyük puntoyla gösteren, min/max limiti girilebilir kart. */
export function GostergeKarti({
  tanim,
  limit,
  onLimitKaydet,
  onLimitTemizle,
}: Props) {
  // Kart, canlı değerin versiyon sayacına KENDİSİ subscribe olur; parent'ın
  // render'ına güvenilmez (grafik panellerindeki desenle aynı gerekçe).
  useGrafikVeriStore((s) => s.versiyon);
  const deger = getGostergeDeger(tanim);

  const [duzenleme, setDuzenleme] = useState(false);
  const [minMetin, setMinMetin] = useState("");
  const [maxMetin, setMaxMetin] = useState("");

  const durum = hesaplaDurum(deger, limit);
  const degerText =
    deger === undefined ? "--" : deger.toFixed(tanim.digit ?? 1);
  const limitVar =
    limit !== undefined && (limit.min !== undefined || limit.max !== undefined);

  const duzenlemeAc = () => {
    setMinMetin(fmtLimit(limit?.min));
    setMaxMetin(fmtLimit(limit?.max));
    setDuzenleme(true);
  };

  const kaydet = () => {
    const min = parseLimitInput(minMetin);
    const max = parseLimitInput(maxMetin);
    if (min === undefined && max === undefined) {
      onLimitTemizle();
    } else {
      onLimitKaydet({ min, max });
    }
    setDuzenleme(false);
  };

  const temizle = () => {
    onLimitTemizle();
    setDuzenleme(false);
  };

  return (
    <section className={`gosterge-kart gosterge-kart--${durum}`}>
      <header className="gosterge-kart__ust">
        <span className="gosterge-kart__baslik" title={tanim.baslik}>
          {tanim.baslik}
        </span>
        <button
          type="button"
          className="gosterge-kart__limit-btn"
          onClick={() => (duzenleme ? setDuzenleme(false) : duzenlemeAc())}
        >
          LİMİT
        </button>
      </header>

      {duzenleme ? (
        <div className="gosterge-kart__form">
          <label>
            <span>Min</span>
            <input
              type="number"
              value={minMetin}
              placeholder="—"
              onChange={(e) => setMinMetin(e.target.value)}
            />
          </label>
          <label>
            <span>Maks</span>
            <input
              type="number"
              value={maxMetin}
              placeholder="—"
              onChange={(e) => setMaxMetin(e.target.value)}
            />
          </label>
          <div className="gosterge-kart__form-aksiyon">
            <button type="button" className="gosterge-kart__kaydet" onClick={kaydet}>
              KAYDET
            </button>
            <button type="button" className="gosterge-kart__temizle" onClick={temizle}>
              TEMİZLE
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="gosterge-kart__deger-satir">
            <strong className="gosterge-kart__deger">{degerText}</strong>
            {tanim.birim && (
              <span className="gosterge-kart__birim">{tanim.birim}</span>
            )}
          </div>
          <footer className="gosterge-kart__alt">
            {limitVar ? (
              <span className="gosterge-kart__limit-etiket">
                {limit?.min !== undefined && `min ${limit.min}`}
                {limit?.min !== undefined && limit?.max !== undefined && " · "}
                {limit?.max !== undefined && `maks ${limit.max}`}
              </span>
            ) : (
              <span className="gosterge-kart__limit-etiket gosterge-kart__limit-etiket--bos">
                limit tanımsız
              </span>
            )}
          </footer>
        </>
      )}
    </section>
  );
}
