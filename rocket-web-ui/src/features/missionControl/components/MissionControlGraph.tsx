import type { MissionControlView } from "../mappers/missionControlViewMapper";

type Props = {
  view: MissionControlView;
};

/** Live time-series of chamber/manifold pressures and chamber temperature. */
export function MissionControlGraph({ view }: Props) {
  return (
    <div className="mc-panel mc-graph">
      <div className="mc-panel__head">
        <div className="mc-panel__head-title">
          <span className="mc-panel__head-title-dot" />
          CANLI TELEMETRİ
        </div>
        <div className="mc-legend">
          {view.graphLines.map((line) => (
            <span className="mc-legend-item" key={line.label} style={{ font: "600 9px 'JetBrains Mono'", letterSpacing: ".03em", color: "#8296a8" }}>
              <span className="mc-legend-swatch" style={{ background: line.color }} />
              {line.label}
            </span>
          ))}
        </div>
      </div>
      <div className="mc-graph__body">
        <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="mc-graph__svg">
          <line x1={0} y1={20} x2={300} y2={20} className="mc-graph__gridline" />
          <line x1={0} y1={40} x2={300} y2={40} className="mc-graph__gridline" />
          <line x1={0} y1={60} x2={300} y2={60} className="mc-graph__gridline" />
          <line x1={0} y1={80} x2={300} y2={80} className="mc-graph__gridline" />
          {view.graphLines.map((line) => (
            <polyline key={line.label} points={line.points} className="mc-graph__line" stroke={line.color} />
          ))}
        </svg>
      </div>
    </div>
  );
}
