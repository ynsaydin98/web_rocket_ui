import type { ReactNode } from "react";
import { useMKUItkiDiagnostikPaketStore } from "../../../store/mku/mkuItkiDiagnostikPaketStore";

// Gösterge kadranı sabitleri: dış çember tik halkası, iç çember dekoratif.
const DIS_CEMBER_YARICAP = 118;
const IC_CEMBER_YARICAP = 82;

const PUSULA_YONLERI: Record<number, string> = { 0: "K", 90: "D", 180: "G", 270: "B" };

// Tik halkaları veriyle değişmez; modül yüklenirken bir kez üretilir.
const pusulaTikleri = (() => {
  const elemanlar: ReactNode[] = [];
  for (let i = 0; i < 36; i++) {
    const derece = i * 10;
    const anaTik = i % 3 === 0;
    elemanlar.push(
      <g key={derece} transform={`rotate(${derece})`}>
        <line x1={0} y1={-118} x2={0} y2={anaTik ? -104 : -111} stroke="var(--border-panel)" strokeWidth={anaTik ? 2 : 1} />
        {anaTik && (
          <text x={0} y={-92} className={PUSULA_YONLERI[derece] ? "ft-durus__tik-etiket ft-durus__tik-etiket--vurgu" : "ft-durus__tik-etiket"}>
            {PUSULA_YONLERI[derece] ?? String(derece)}
          </text>
        )}
      </g>,
    );
  }
  return elemanlar;
})();

const rollTikleri = (() => {
  const elemanlar: ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const derece = i * 30;
    const isaretli = derece > 180 ? derece - 360 : derece;
    const anaTik = derece % 90 === 0;
    const etiket = derece === 180 ? "±180" : isaretli > 0 ? `+${isaretli}` : String(isaretli);
    elemanlar.push(
      <g key={derece} transform={`rotate(${derece})`}>
        <line x1={0} y1={-118} x2={0} y2={anaTik ? -104 : -111} stroke="var(--border-panel)" strokeWidth={anaTik ? 2 : 1} />
        {anaTik && (
          <text x={0} y={-92} transform={`rotate(${-derece} 0 -97)`} className="ft-durus__tik-etiket">
            {etiket}
          </text>
        )}
      </g>,
    );
  }
  return elemanlar;
})();

const pitchTikleri = (() => {
  const elemanlar: ReactNode[] = [];
  for (let derece = -90; derece <= 90; derece += 15) {
    const anaTik = derece % 30 === 0;
    elemanlar.push(
      <g key={derece} transform={`rotate(${derece})`}>
        <line x1={0} y1={-118} x2={0} y2={anaTik ? -104 : -111} stroke="var(--border-panel)" strokeWidth={anaTik ? 2 : 1} />
        {anaTik && (
          <text x={0} y={-92} transform={`rotate(${-derece} 0 -97)`} className={derece === 0 ? "ft-durus__tik-etiket ft-durus__tik-etiket--ref" : "ft-durus__tik-etiket"}>
            {derece > 0 ? `+${derece}` : String(derece)}
          </text>
        )}
      </g>,
    );
  }
  return elemanlar;
})();

/**
 * Uçuş sonlandırma sayfasındaki pitch / roll / yaw kadranları. IMU
 * Euler açılarını doğrudan gösterir; 3D sahneyle aynı işaret kuralı
 * (pitch 0 = dik roket, yaw pusula yönünde, roll suni ufuk yönünde).
 * Model offset formu 3D görsel hizası içindir, buraya uygulanmaz.
 */
export function DurusGostergeleri() {
  const ozet = useMKUItkiDiagnostikPaketStore((state) => state.ozet);

  const pitch = ozet?.imu_pitch ?? 0;
  const roll = ozet?.imu_roll ?? 0;
  const yaw = normalizeYaw(ozet?.imu_yaw ?? 0);
  const veriVar = ozet !== undefined && ozet !== null;

  return (
    <div className="ft-durus-grid">
      <DurusKarti
        baslik="PITCH"
        aralik="-90° / +90°"
        deger={veriVar ? formatIsaretliAci(pitch) : "--°"}
        altYazi="YAN GÖRÜNÜM"
      >
        <svg viewBox="-130 -130 260 260" role="img" aria-label="Pitch açısını yandan görünümde gösteren kadran">
          <circle cx={0} cy={0} r={DIS_CEMBER_YARICAP} fill="none" stroke="var(--border-panel)" strokeWidth={1} />
          <circle cx={0} cy={0} r={IC_CEMBER_YARICAP} fill="none" stroke="var(--border-panel)" strokeWidth={1.5} opacity={0.6} />
          {pitchTikleri}
          {/* 0° referansı: dik roket ekseni */}
          <line x1={0} y1={-110} x2={0} y2={110} stroke="var(--accent-blue)" strokeWidth={2} />
          <text x={6} y={-102} className="ft-durus__tik-etiket ft-durus__tik-etiket--ref" textAnchor="start" fontSize={11}>
            REF 0°
          </text>
          <g transform={`rotate(${pitch.toFixed(2)})`}>
            <line x1={0} y1={-104} x2={0} y2={104} stroke="var(--accent-green)" strokeWidth={1.5} strokeDasharray="7 6" opacity={0.65} />
            <YanGorunumRoket />
          </g>
        </svg>
      </DurusKarti>

      <DurusKarti
        baslik="ROLL"
        aralik="-180° / +180°"
        deger={veriVar ? formatIsaretliAci(roll) : "--°"}
        altYazi="ALT GÖRÜNÜM"
      >
        <svg viewBox="-130 -130 260 260" role="img" aria-label="Roll açısını alttan görünümde gösteren kadran">
          {rollTikleri}
          <circle cx={0} cy={0} r={DIS_CEMBER_YARICAP} fill="none" stroke="var(--border-panel)" strokeWidth={1} />
          <circle cx={0} cy={0} r={IC_CEMBER_YARICAP} fill="none" stroke="var(--border-panel)" strokeWidth={1.5} opacity={0.6} />
          {/* Sabit 0° referans oku */}
          <polygon points="0,-120 -7,-132 7,-132" fill="var(--accent-blue)" />
          <g transform={`rotate(${roll.toFixed(2)})`}>
            <polygon points="0,-116 -6,-104 6,-104" fill="var(--accent-green)" />
          </g>
          <g transform={`rotate(${roll.toFixed(2)})`}>
            <AltGorunumRoket />
          </g>
        </svg>
      </DurusKarti>

      <DurusKarti
        baslik="YAW"
        aralik="0° / 360°"
        deger={veriVar ? `${yaw.toFixed(1)}°` : "--°"}
        altYazi="PUSULA"
      >
        <svg viewBox="-130 -130 260 260" role="img" aria-label="Yaw açısını pusula üzerinde gösteren kadran">
          {pusulaTikleri}
          <circle cx={0} cy={0} r={DIS_CEMBER_YARICAP} fill="none" stroke="var(--border-panel)" strokeWidth={1} />
          <circle cx={0} cy={0} r={IC_CEMBER_YARICAP} fill="none" stroke="var(--border-panel)" strokeWidth={1.5} opacity={0.6} />
          {/* Kuzey referans oku ve çizgisi */}
          <polygon points="0,-120 -7,-132 7,-132" fill="var(--accent-blue)" />
          <line x1={0} y1={0} x2={0} y2={-110} stroke="var(--accent-blue)" strokeWidth={2} />
          <g transform={`rotate(${yaw.toFixed(2)})`}>
            <line x1={0} y1={-104} x2={0} y2={104} stroke="var(--accent-green)" strokeWidth={1.5} strokeDasharray="7 6" opacity={0.65} />
            <OnGorunumRoket />
          </g>
        </svg>
      </DurusKarti>
    </div>
  );
}

type DurusKartiProps = {
  baslik: string;
  aralik: string;
  deger: string;
  altYazi: string;
  children: ReactNode;
};

function DurusKarti({ baslik, aralik, deger, altYazi, children }: DurusKartiProps) {
  return (
    <div className="ft-durus-kart">
      <div className="ft-durus-kart__ust">
        <span>{baslik}</span>
        <span>{aralik}</span>
      </div>
      <div className="ft-durus-kart__gosterge">{children}</div>
      <div className="ft-durus-kart__deger">
        <strong>{deger}</strong>
        <span>{altYazi}</span>
      </div>
    </div>
  );
}

/** Yandan roket silueti (pitch kadranı). */
function YanGorunumRoket() {
  return (
    <g transform="translate(-20,-60) scale(0.7)">
      <path d="M28.5 2 C35 14 41 27 41 40 L16 40 C16 27 22 14 28.5 2 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <rect x={16} y={40} width={25} height={86} fill="#0d2136" stroke="var(--accent-blue)" strokeWidth={2} />
      <line x1={28.5} y1={40} x2={28.5} y2={126} stroke="var(--accent-blue)" strokeWidth={2} opacity={0.8} />
      <path d="M16 116 L2 156 L16 148 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <path d="M41 116 L55 156 L41 148 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <path d="M28.5 118 L28.5 152 L34 148 Z" fill="#0f2a42" stroke="var(--accent-blue)" strokeWidth={2} />
      <path d="M20 126 L22 136 L35 136 L37 126 Z" fill="#0a1a2c" stroke="var(--accent-blue)" strokeWidth={2} />
    </g>
  );
}

/** Önden roket silueti (yaw/pusula kadranı). */
function OnGorunumRoket() {
  return (
    <g transform="translate(-25.6,-68) scale(0.8)">
      <path d="M32 2 C38 14 44 27 44 40 L20 40 C20 27 26 14 32 2 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <rect x={20} y={40} width={24} height={86} fill="#0d2136" stroke="var(--accent-blue)" strokeWidth={2} />
      <rect x={20} y={52} width={24} height={8} fill="var(--accent-blue)" opacity={0.85} />
      <path d="M20 122 L4 156 L20 148 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <path d="M44 122 L60 156 L44 148 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <path d="M24 126 L26 136 L38 136 L40 126 Z" fill="#0a1a2c" stroke="var(--accent-blue)" strokeWidth={2} />
    </g>
  );
}

/** Alttan roket silueti: dört kanatçık + gövde kesiti (roll kadranı). */
function AltGorunumRoket() {
  return (
    <g>
      <line x1={0} y1={-24} x2={0} y2={-76} stroke="var(--accent-blue)" strokeWidth={2.5} />
      <polygon points="0,-80 -6,-68 6,-68" fill="var(--accent-blue)" />
      <path d="M-6 -22 L-6 -52 L0 -62 L6 -52 L6 -22 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <path d="M-22 6 L-52 6 L-62 0 L-52 -6 L-22 -6 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <path d="M-6 22 L-6 52 L0 62 L6 52 L6 22 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <path d="M22 -6 L52 -6 L62 0 L52 6 L22 6 Z" fill="#12304a" stroke="var(--accent-blue)" strokeWidth={2} />
      <circle cx={0} cy={0} r={22} fill="#0d2136" stroke="var(--accent-blue)" strokeWidth={2} />
      <circle cx={0} cy={0} r={11} fill="#0a1a2c" stroke="var(--accent-blue)" strokeWidth={2} />
    </g>
  );
}

function normalizeYaw(derece: number) {
  return ((derece % 360) + 360) % 360;
}

function formatIsaretliAci(derece: number) {
  return `${derece >= 0 ? "+" : ""}${derece.toFixed(1)}°`;
}
