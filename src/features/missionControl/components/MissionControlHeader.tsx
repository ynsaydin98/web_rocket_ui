import type { MissionControlView } from "../mappers/missionControlViewMapper";

type Props = {
  view: MissionControlView;
};

/** Mission clock + SAFE/ARMED/FIRING/ABORT status strip for the test-stand sequence. */
export function MissionControlHeader({ view }: Props) {
  return (
    <header className="mc-header">
      <div className="mc-header__clock">
        <div className="mc-header__clock-label">MISSION CLOCK</div>
        <div
          className="mc-header__clock-value"
          style={{ color: view.statusColor, textShadow: `0 0 12px ${view.statusColor}66` }}
        >
          {view.clockText}
        </div>
      </div>
      <div className="mc-header__status">
        <div className="mc-header__status-label">SİSTEM DURUMU</div>
        <div
          className={`mc-status-pill${view.status === "ABORT" ? " mc-status-pill--abort" : ""}`}
          style={{ color: view.statusColor, background: `${view.statusColor}18` }}
        >
          <span className="mc-status-pill__dot" />
          {view.status}
        </div>
      </div>
    </header>
  );
}
