import { useTelemetry } from '../../app/telemetry'
import MissionClock from '../common/MissionClock'
import { fmt } from '../../lib/format'

export default function TopBar() {
  const telemetry = useTelemetry()
  const speed = telemetry?.gnss.speed
  const altitude = telemetry?.gnss.altitude

  return (
    <header className="topbar">
      <div className="brand">
        <img className="brand-logo" src="/rocket.svg" alt="Logo" width="40" height="40" />
        <div className="brand-text">
          <span className="brand-title">Rocket Mission-1</span>
          <span className="brand-sub">Space Industry</span>
        </div>
      </div>

      <MissionClock />

      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">VELOCITY</span>
          <span className="hud-value">{fmt(speed)}<span className="hud-unit"> m/s</span></span>
        </div>
        <div className="hud-item">
          <span className="hud-label">ALTITUDE</span>
          <span className="hud-value">{fmt(altitude)}<span className="hud-unit"> m</span></span>
        </div>
      </div>
    </header>
  )
}
