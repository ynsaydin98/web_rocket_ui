import type { MissionControlView } from "../mappers/missionControlViewMapper";

type Props = {
  view: MissionControlView;
};

const LEGEND_ITEMS = [
  { color: "#39e08a", label: "AKIŞ AKTİF", dot: false },
  { color: "#39e08a", label: "AÇIK", dot: true },
  { color: "#57697c", label: "KAPALI", dot: true },
];

/** P&ID mimic: oxidizer tank -> valves -> manifold -> combustion chamber -> nozzle. */
export function MissionControlSchematic({ view }: Props) {
  return (
    <div className="mc-panel mc-schematic">
      <div className="mc-panel__head">
        <div className="mc-panel__head-title">
          <span className="mc-panel__head-title-dot" />
          P&amp;ID MİMİK ŞEMASI
        </div>
        <div className="mc-legend">
          {LEGEND_ITEMS.map((item) => (
            <span className="mc-legend-item" key={item.label}>
              <span
                className={`mc-legend-swatch${item.dot ? " mc-legend-swatch--dot" : ""}`}
                style={{ background: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 1080 430" preserveAspectRatio="xMidYMid meet" className="mc-schematic__svg">
        <defs>
          <linearGradient id="mc-exhaust-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff0c2" />
            <stop offset="0.3" stopColor="#ffb347" />
            <stop offset="0.65" stopColor="#ff5a2a" />
            <stop offset="1" stopColor="#ff3b2a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mc-n2o-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#33b4d6" stopOpacity="0.5" />
            <stop offset="1" stopColor="#155e77" stopOpacity="0.85" />
          </linearGradient>
          <clipPath id="mc-tank-clip">
            <rect x={32} y={172} width={216} height={116} rx={58} />
          </clipPath>
        </defs>

        {/* base pipe (horizontal, left to right) */}
        <polyline points="250,230 640,230" fill="none" stroke="#1b2a37" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
        {/* animated flow overlay */}
        <polyline points="250,230 640,230" className={`mc-flow-line${view.flowActive ? " mc-flow-line--active" : ""}`} />

        {/* OXIDIZER TANK (horizontal, N2O liquid) */}
        <text x={140} y={160} textAnchor="middle" style={{ font: "600 10px 'Chakra Petch'", letterSpacing: ".14em", fill: "#8fa4b6" }}>OKSİTLEYİCİ TANKI</text>
        <rect x={30} y={170} width={220} height={120} rx={60} style={{ fill: "#0d1822", stroke: "#2f7d8a", strokeWidth: 2 }} />
        <g clipPath="url(#mc-tank-clip)">
          <rect x={30} y={224} width={220} height={66} style={{ fill: "url(#mc-n2o-grad)" }} />
          <rect x={30} y={221} width={220} height={4} style={{ fill: "rgba(150,231,247,.6)" }} />
          <ellipse cx={110} cy={224} rx={70} ry={7} className="mc-liquid-wave" style={{ fill: "rgba(180,240,252,.22)" }} />
        </g>
        <text x={140} y={214} textAnchor="middle" style={{ font: "800 26px 'JetBrains Mono'", letterSpacing: ".02em", fill: "#dff4fa" }}>N₂O</text>

        {/* MANUAL VALVE @275 (operator-controlled) */}
        <polygon points="259,212 259,248 275,230" fill={view.valveManual.color} />
        <polygon points="291,212 291,248 275,230" fill={view.valveManual.color} />
        <line x1={275} y1={212} x2={275} y2={197} style={{ stroke: "#7f93a6", strokeWidth: 2 }} />
        <circle cx={275} cy={191} r={6} fill="none" stroke="#7f93a6" style={{ strokeWidth: 2 }} />
        <text x={275} y={300} textAnchor="middle" style={{ font: "600 10px 'Chakra Petch'", letterSpacing: ".06em", fill: "#8296a8" }}>MANUEL VANA</text>
        <text x={275} y={316} textAnchor="middle" fill={view.valveManual.color} style={{ font: "700 11px 'JetBrains Mono'" }}>{view.valveManual.text}</text>

        {/* MAIN (thrust) VALVE @360 */}
        <polygon points="328,208 328,252 360,230" fill={view.valveMain.color} />
        <polygon points="392,208 392,252 360,230" fill={view.valveMain.color} />
        <rect x={350} y={204} width={20} height={14} rx={2} fill={view.valveMain.color} />
        <text x={360} y={300} textAnchor="middle" style={{ font: "600 10px 'Chakra Petch'", letterSpacing: ".08em", fill: "#8296a8" }}>İTKİ VANASI</text>
        <text x={360} y={316} textAnchor="middle" fill={view.valveMain.color} style={{ font: "700 11px 'JetBrains Mono'" }}>{view.valveMain.text}</text>

        {/* MANIFOLD */}
        <rect x={596} y={196} width={24} height={68} rx={6} style={{ fill: "#101c27", stroke: "#33485a", strokeWidth: 1.5 }} />
        <text x={632} y={230} transform="rotate(90 632 230)" textAnchor="middle" style={{ font: "600 8.5px 'Chakra Petch'", letterSpacing: ".12em", fill: "#8296a8" }}>MANİFOLD</text>

        {/* COMBUSTION CHAMBER (horizontal) */}
        <text x={745} y={235} textAnchor="middle" style={{ font: "600 11px 'Chakra Petch'", letterSpacing: ".12em", fill: "#8fa4b6" }}>YANMA ODASI</text>
        <rect x={640} y={170} width={210} height={120} rx={18} style={{ fill: "#0e1a24", stroke: "#35495b", strokeWidth: 2 }} />

        {/* NOZZLE (horizontal, points right) */}
        <polygon points="850,205 850,255 930,285 930,175" style={{ fill: "#16232f", stroke: "#35495b", strokeWidth: 2 }} />
        <text x={890} y={312} textAnchor="middle" style={{ font: "600 9.5px 'Chakra Petch'", letterSpacing: ".12em", fill: "#66788a" }}>NOZZLE</text>
        {/* EXHAUST (horizontal plume) */}
        <polygon points="930,180 930,280 1075,242 1075,218" fill="url(#mc-exhaust-grad)" className={`mc-exhaust${view.exhaustActive ? " mc-exhaust--active" : ""}`} />

        {/* IGNITER 1 (top, before manifold) */}
        <polyline points="490,90 490,230" stroke={view.igniter1.color} className={`mc-ig-line mc-ig-line--${view.igniter1.state}`} />
        <rect x={442} y={50} width={96} height={40} rx={8} stroke={view.igniter1.color} style={{ fill: "rgba(4,9,15,.78)", strokeWidth: 1.4 }} />
        <text x={490} y={67} textAnchor="middle" style={{ font: "600 9px 'Chakra Petch'", letterSpacing: ".04em", fill: "#a8bccd" }}>ATEŞLEYİCİ-1</text>
        <text x={490} y={82} textAnchor="middle" fill={view.igniter1.color} style={{ font: "700 9px 'JetBrains Mono'", letterSpacing: ".04em" }}>{view.igniter1.text}</text>

        {/* IGNITER 2 (bottom, before manifold) */}
        <polyline points="490,312 490,230" stroke={view.igniter2.color} className={`mc-ig-line mc-ig-line--${view.igniter2.state}`} />
        <rect x={442} y={312} width={96} height={40} rx={8} stroke={view.igniter2.color} style={{ fill: "rgba(4,9,15,.78)", strokeWidth: 1.4 }} />
        <text x={490} y={329} textAnchor="middle" style={{ font: "600 9px 'Chakra Petch'", letterSpacing: ".04em", fill: "#a8bccd" }}>ATEŞLEYİCİ-2</text>
        <text x={490} y={344} textAnchor="middle" fill={view.igniter2.color} style={{ font: "700 9px 'JetBrains Mono'", letterSpacing: ".04em" }}>{view.igniter2.text}</text>

        {/* SENSOR BADGES (circular gauges wired to the schematic) */}
        {view.badges.map((bd) => (
          <g key={bd.id}>
            <line x1={bd.cx} y1={bd.cy} x2={bd.ax} y2={bd.ay} stroke={bd.color} style={{ strokeWidth: 1.4, opacity: 0.5 }} />
            <circle cx={bd.ax} cy={bd.ay} r={3.5} fill={bd.color} />
            <circle cx={bd.cx} cy={bd.cy} r={34} fill="#070d14" stroke={bd.color} style={{ strokeWidth: 2.5 }} />
            <foreignObject x={bd.foX} y={bd.foY} width={64} height={52}>
              <div className="mc-badge-fo">
                <span className="mc-badge-fo__id" style={{ color: bd.color }}>{bd.id}</span>
                <span className="mc-badge-fo__value">{bd.reading}</span>
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  );
}
