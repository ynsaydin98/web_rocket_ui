import { useMKUItkiDiagnostikPaketStore } from "../../../store/mku/mkuItkiDiagnostikPaketStore";
import { hesaplaZenitAzimut } from "../mappers/zenitAzimutMapper";

// Gösterge en dış halkası bu zenit açısına karşılık gelir; daha büyük
// sapmalar dış halkaya sabitlenir. Uyarı/tehlike eşikleri protokol
// belgesi netleşene kadar placeholder'dır.
const MAKS_ZENIT_DERECE = 30;
const UYARI_ZENIT_DERECE = 10;
const TEHLIKE_ZENIT_DERECE = 20;

const DIS_HALKA_YARICAP = 90;

/**
 * Roketin dikeyden sapmasını (zenit) ve sapma yönünü (azimut) 2D
 * dairesel göstergede çizer: merkez = tam dik, halkalar 10°/20°/30°,
 * işaretçinin yönü pusula azimutu.
 */
export function ZenitAzimutGostergesi() {
  const ozet = useMKUItkiDiagnostikPaketStore((state) => state.ozet);

  const acilar = ozet
    ? hesaplaZenitAzimut(ozet.imu_pitch, ozet.imu_roll, ozet.imu_yaw)
    : undefined;

  const zenitSinirli = acilar
    ? Math.min(acilar.zenit, MAKS_ZENIT_DERECE)
    : 0;
  const yaricap = (zenitSinirli / MAKS_ZENIT_DERECE) * DIS_HALKA_YARICAP;
  const azimutRad = acilar ? (acilar.azimut * Math.PI) / 180 : 0;
  const isaretX = yaricap * Math.sin(azimutRad);
  const isaretY = -yaricap * Math.cos(azimutRad);

  const durumRengi = !acilar
    ? "var(--text-muted)"
    : acilar.zenit >= TEHLIKE_ZENIT_DERECE
      ? "var(--accent-red)"
      : acilar.zenit >= UYARI_ZENIT_DERECE
        ? "var(--accent-yellow)"
        : "var(--accent-green)";

  return (
    <div className="zenit-azimut">
      <svg
        viewBox="-110 -110 220 220"
        role="img"
        aria-label="Roketin zenit ve azimut açısını gösteren dairesel gösterge"
      >
        {/* Zenit halkaları: 10° / 20° / 30° */}
        {[1, 2, 3].map((adim) => (
          <circle
            key={adim}
            cx={0}
            cy={0}
            r={(DIS_HALKA_YARICAP / 3) * adim}
            fill="none"
            stroke="var(--border-panel)"
            strokeWidth={1}
          />
        ))}

        {/* Eksen çizgileri */}
        <line x1={-DIS_HALKA_YARICAP} y1={0} x2={DIS_HALKA_YARICAP} y2={0} stroke="var(--border-panel)" strokeWidth={0.5} />
        <line x1={0} y1={-DIS_HALKA_YARICAP} x2={0} y2={DIS_HALKA_YARICAP} stroke="var(--border-panel)" strokeWidth={0.5} />

        {/* Yön etiketleri */}
        <text x={0} y={-97} className="zenit-azimut__yon">K</text>
        <text x={101} y={4} className="zenit-azimut__yon">D</text>
        <text x={0} y={106} className="zenit-azimut__yon">G</text>
        <text x={-101} y={4} className="zenit-azimut__yon">B</text>

        {/* Halka derece etiketleri */}
        <text x={4} y={-DIS_HALKA_YARICAP / 3 - 3} className="zenit-azimut__derece">10°</text>
        <text x={4} y={(-DIS_HALKA_YARICAP / 3) * 2 - 3} className="zenit-azimut__derece">20°</text>
        <text x={4} y={-DIS_HALKA_YARICAP - 3} className="zenit-azimut__derece">30°</text>

        {acilar && (
          <>
            {/* Merkezden işaretçiye yön çizgisi */}
            <line
              x1={0}
              y1={0}
              x2={isaretX}
              y2={isaretY}
              stroke={durumRengi}
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            {/* Roket sapma işaretçisi */}
            <circle
              cx={isaretX}
              cy={isaretY}
              r={6}
              fill={durumRengi}
              stroke="white"
              strokeWidth={2}
            />
          </>
        )}
      </svg>

      <div className="zenit-azimut__degerler">
        <span>
          ZENİT <strong style={{ color: durumRengi }}>{formatAci(acilar?.zenit)}</strong>
        </span>
        <span>
          AZİMUT <strong>{formatAci(acilar?.azimut)}</strong>
        </span>
      </div>
    </div>
  );
}

function formatAci(deger?: number) {
  return Number.isFinite(deger) ? `${deger!.toFixed(1)}°` : "--°";
}
