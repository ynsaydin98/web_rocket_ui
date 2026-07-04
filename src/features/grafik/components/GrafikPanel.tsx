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

type Props = {
  tanim: GrafikTanim;
  onRemove: () => void;
};

function fmtDeger(v: number): string {
  if (!Number.isFinite(v)) return "--";
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString("tr-TR");
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function fmtSaat(t: number): string {
  return new Date(t).toLocaleTimeString("tr-TR", {
    hour12: false,
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Seçili alanların görünür örnekler üzerindeki ortak min/max ölçeği (tek eksen). */
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
  if (min === Number.POSITIVE_INFINITY) return [0, 1];
  if (min === max) return [min - 1, max + 1];
  const pad = (max - min) * 0.08;
  return [min - pad, max + pad];
}

function buildPoints(
  gecmis: GrafikOrnek[],
  alan: string,
  yMin: number,
  yMax: number,
): string {
  const n = gecmis.length;
  if (n < 2) return "";
  const drawH = VIEW_H - PAD_TOP - PAD_BOTTOM;
  const points: string[] = [];
  for (let i = 0; i < n; i++) {
    const v = gecmis[i].degerler[alan];
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    const x = (i / (n - 1)) * VIEW_W;
    const oran = (v - yMin) / (yMax - yMin);
    const y = VIEW_H - PAD_BOTTOM - Math.max(0, Math.min(1, oran)) * drawH;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

/** Tek bir kullanıcı tanımlı zaman serisi grafiği: legend, crosshair ve tooltip ile. */
export function GrafikPanel({ tanim, onRemove }: Props) {
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

      <div className="grafik-panel__body">
        {gecmis.length < 2 ? (
          <div className="grafik-panel__empty">Veri bekleniyor...</div>
        ) : (
          <>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
              className="grafik-panel__svg"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {[0.25, 0.5, 0.75].map((oran) => (
                <line
                  key={oran}
                  x1={0}
                  y1={VIEW_H * oran}
                  x2={VIEW_W}
                  y2={VIEW_H * oran}
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
            <span className="grafik-panel__axis grafik-panel__axis--max">
              {fmtDeger(yMax)}
            </span>
            <span className="grafik-panel__axis grafik-panel__axis--min">
              {fmtDeger(yMin)}
            </span>
            {hoverOrnek && (
              <div className="grafik-panel__tooltip">{fmtSaat(hoverOrnek.t)}</div>
            )}
          </>
        )}
      </div>

      <footer className="grafik-panel__meta">
        <span>{gecmis.length > 0 ? fmtSaat(gecmis[0].t) : "--:--"}</span>
        <span>{sonOrnek ? fmtSaat(sonOrnek.t) : "--:--"}</span>
      </footer>
    </section>
  );
}
