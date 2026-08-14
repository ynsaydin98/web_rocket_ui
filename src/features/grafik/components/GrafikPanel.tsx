import { useRef, useState } from "react";
import { getGrafikAlanLabel, getGrafikKaynak } from "../config/grafikKaynaklari";
import { GRAFIK_SERI_RENKLERI } from "../config/grafikRenkleri";
import { getGrafikGecmisi, type GrafikOrnek } from "../services/grafikVeriGecmisi";
import type { GrafikTanim } from "../store/grafikTanimStore";
import { useGrafikVeriStore } from "../store/grafikVeriStore";

const VIEW_W = 300;
const VIEW_H = 120;
const PAD_TOP = 6;
const PAD_BOTTOM = 6;
const DRAW_H = VIEW_H - PAD_TOP - PAD_BOTTOM;

/**
 * Y ekseni sınırlarının veri uçlarına eklenen payı: üst limit = görünen
 * maksimum + 10, alt limit = görünen minimum - 10. Veri değiştikçe eksen
 * etiketleri de bu paya göre dinamik güncellenir.
 */
const EKSEN_PAYI = 10;

/** Y ekseni etiket/gridline oranları (1 = üst limit, 0 = alt limit). */
const Y_TICK_ORANLARI = [1, 0.75, 0.5, 0.25, 0];

/** X ekseninde gösterilecek zaman etiketi sayısı. */
const X_TICK_SAYISI = 4;

type Props = {
  tanim: GrafikTanim;
  onRemove: () => void;
};

function fmtDeger(v: number): string {
  if (!Number.isFinite(v)) return "--";
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString("tr-TR");
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/**
 * Y ekseni etiketleri: tüm tick'ler aynı ondalık hassasiyetiyle yazılır.
 * Ondalık gerekmeyen büyük değerlerde legend ile aynı binlik ayracı kullanılır.
 */
function fmtEksenDeger(v: number, basamak: number): string {
  if (!Number.isFinite(v)) return "--";
  return basamak === 0 ? Math.round(v).toLocaleString("tr-TR") : v.toFixed(basamak);
}

/** Tick aralığına göre ondalık basamak sayısı. */
function eksenBasamak(aralik: number): number {
  if (aralik >= 10) return 0;
  if (aralik >= 1) return 1;
  return 2;
}

function fmtSaat(t: number): string {
  return new Date(t).toLocaleTimeString("tr-TR", {
    hour12: false,
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Seçili alanların görünür örnekler üzerindeki ortak ölçeği (tek eksen).
 * Sınırlar veri uçlarına `EKSEN_PAYI` eklenerek bulunur; yeni örnek geldikçe
 * pencere kaydığı için eksen de her çizimde yeniden hesaplanır.
 */
function computeYScale(gecmis: GrafikOrnek[], alanlar: string[]): [number, number] {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const ornek of gecmis) {
    for (const alan of alanlar) {
      const v = ornek.degerler[alan];
      if (typeof v !== "number" || !Number.isFinite(v)) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (min === Number.POSITIVE_INFINITY) return [0, EKSEN_PAYI];
  return [min - EKSEN_PAYI, max + EKSEN_PAYI];
}

/** Oranı (0 = alt limit, 1 = üst limit) çizim alanı içindeki y koordinatına çevirir. */
function yKoordinat(oran: number): number {
  return VIEW_H - PAD_BOTTOM - Math.max(0, Math.min(1, oran)) * DRAW_H;
}

function buildPoints(
  gecmis: GrafikOrnek[],
  alan: string,
  yMin: number,
  yMax: number,
): string {
  const n = gecmis.length;
  if (n < 2) return "";
  const points: string[] = [];
  for (let i = 0; i < n; i++) {
    const v = gecmis[i].degerler[alan];
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    const x = (i / (n - 1)) * VIEW_W;
    const y = yKoordinat((v - yMin) / (yMax - yMin));
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

/** Tek bir kullanıcı tanımlı zaman serisi grafiği: legend, crosshair ve tooltip ile. */
export function GrafikPanel({ tanim, onRemove }: Props) {
  // React Compiler devre dışı: getGrafikGecmisi() render sırasında store
  // dışındaki ring buffer'dan okuyor. Derleyici bu çağrıyı `tanim.kaynakId`e
  // göre önbelleğe aldığı için tampon yerinde değişse bile panel ilk okuduğu
  // diziyle kalıyordu (bkz. GostergeKarti'ndaki aynı gerekçe).
  "use no memo";

  // Panel, veri geçmişi versiyonuna KENDİSİ subscribe olur; parent'ın
  // render'ına güvenilmez (React, props'u değişmeyen çocukları atlayabilir).
  useGrafikVeriStore((s) => s.versiyon);

  const kaynak = getGrafikKaynak(tanim.kaynakId);
  const gecmis = getGrafikGecmisi(tanim.kaynakId);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [yMin, yMax] = computeYScale(gecmis, tanim.alanlar);
  const sonOrnek = gecmis.length > 0 ? gecmis[gecmis.length - 1] : undefined;
  const hoverOrnek =
    hoverIndex !== null && hoverIndex >= 0 && hoverIndex < gecmis.length
      ? gecmis[hoverIndex]
      : undefined;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (gecmis.length < 2 || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const oran = (e.clientX - rect.left) / rect.width;
    const index = Math.round(oran * (gecmis.length - 1));
    setHoverIndex(Math.max(0, Math.min(gecmis.length - 1, index)));
  };

  const hoverX =
    hoverIndex !== null && gecmis.length > 1
      ? (hoverIndex / (gecmis.length - 1)) * VIEW_W
      : null;

  // Eksen etiketleri: y değerleri güncel ölçekten, x zamanları görünür
  // pencerenin ilk/son örneklerinden türetilir.
  const tickBasamak = eksenBasamak(
    (yMax - yMin) / (Y_TICK_ORANLARI.length - 1),
  );
  const yTicks = Y_TICK_ORANLARI.map((oran) => ({
    oran,
    etiket: fmtEksenDeger(yMin + oran * (yMax - yMin), tickBasamak),
    yuzde: (yKoordinat(oran) / VIEW_H) * 100,
  }));
  const xTicks =
    gecmis.length > 1
      ? Array.from({ length: X_TICK_SAYISI }, (_, i) => {
          const oran = i / (X_TICK_SAYISI - 1);
          const index = Math.round(oran * (gecmis.length - 1));
          return { oran, t: gecmis[index].t };
        })
      : [];

  return (
    <section className="grafik-panel">
      <header className="grafik-panel__head">
        <div>
          <h3>{tanim.baslik}</h3>
          <p>{kaynak?.label ?? tanim.kaynakId}</p>
        </div>
        <button
          type="button"
          className="grafik-panel__remove"
          title="Grafiği kaldır"
          aria-label={`${tanim.baslik} grafiğini kaldır`}
          onClick={onRemove}
        >
          ×
        </button>
      </header>

      <div className="grafik-panel__legend">
        {tanim.alanlar.map((alan, i) => (
          <span className="grafik-panel__legend-item" key={alan}>
            <span
              className="grafik-panel__swatch"
              style={{ background: GRAFIK_SERI_RENKLERI[i] }}
            />
            {getGrafikAlanLabel(tanim.kaynakId, alan)}
            <strong>
              {fmtDeger((hoverOrnek ?? sonOrnek)?.degerler[alan] ?? Number.NaN)}
            </strong>
          </span>
        ))}
      </div>

      {gecmis.length < 2 ? (
        <div className="grafik-panel__body grafik-panel__body--bos">
          <div className="grafik-panel__empty">Veri bekleniyor...</div>
        </div>
      ) : (
        <>
          <div className="grafik-panel__body">
            <div className="grafik-panel__y-ekseni">
              {yTicks.map((tick) => (
                <span
                  key={tick.oran}
                  className="grafik-panel__y-tick"
                  style={{ top: `${tick.yuzde}%` }}
                >
                  {tick.etiket}
                </span>
              ))}
            </div>

            <div className="grafik-panel__plot">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                preserveAspectRatio="none"
                className="grafik-panel__svg"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {yTicks.map((tick) => (
                  <line
                    key={tick.oran}
                    x1={0}
                    y1={yKoordinat(tick.oran)}
                    x2={VIEW_W}
                    y2={yKoordinat(tick.oran)}
                    className="grafik-panel__gridline"
                  />
                ))}
                {tanim.alanlar.map((alan, i) => (
                  <polyline
                    key={alan}
                    points={buildPoints(gecmis, alan, yMin, yMax)}
                    className="grafik-panel__line"
                    stroke={GRAFIK_SERI_RENKLERI[i]}
                  />
                ))}
                {hoverX !== null && (
                  <line
                    x1={hoverX}
                    y1={0}
                    x2={hoverX}
                    y2={VIEW_H}
                    className="grafik-panel__crosshair"
                  />
                )}
              </svg>
              {hoverOrnek && (
                <div className="grafik-panel__tooltip">{fmtSaat(hoverOrnek.t)}</div>
              )}
            </div>
          </div>

          <footer className="grafik-panel__x-ekseni">
            {xTicks.map((tick) => (
              <span
                key={tick.oran}
                className="grafik-panel__x-tick"
                style={{
                  left: `${tick.oran * 100}%`,
                  transform:
                    tick.oran === 0
                      ? "none"
                      : tick.oran === 1
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                }}
              >
                {fmtSaat(tick.t)}
              </span>
            ))}
          </footer>
        </>
      )}
    </section>
  );
}
