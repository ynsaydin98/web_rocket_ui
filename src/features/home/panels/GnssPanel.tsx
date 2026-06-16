import Panel from '../../../components/common/Panel'
import Stat from '../../../components/common/Stat'
import { useTelemetry } from '../../../app/telemetry'
import { fmt, fmtUtc } from '../../../lib/format'

export default function GnssPanel() {
  const g = useTelemetry()?.gnss

  return (
    <Panel title="GNSS">
      <div className="stat-grid">
        <Stat label="Uydu sayısı" value={g ? String(g.satellites) : '—'} />
        <Stat label="Enlem" value={g ? fmt(g.latitude, 5) : '—'} unit="°" />
        <Stat label="Boylam" value={g ? fmt(g.longitude, 5) : '—'} unit="°" />
        <Stat label="Yükseklik" value={fmt(g?.altitude)} unit="m" />
        <Stat label="Hız" value={fmt(g?.speed)} unit="m/s" />
        <Stat label="Yönelim" value={fmt(g?.heading)} unit="°" />
        <Stat label="UTC" value={g ? fmtUtc(g.utc) : '—'} />
      </div>
    </Panel>
  )
}
