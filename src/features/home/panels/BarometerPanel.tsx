import Panel from '../../../components/common/Panel'
import Stat from '../../../components/common/Stat'
import { useTelemetry } from '../../../app/telemetry'
import { fmt } from '../../../lib/format'

export default function BarometerPanel() {
  const b = useTelemetry()?.barometer

  return (
    <Panel title="Barometre">
      <div className="stat-grid">
        <Stat label="Basınç" value={fmt(b?.pressure, 2)} unit="hPa" />
        <Stat label="Yükseklik" value={fmt(b?.altitude)} unit="m" />
        <Stat label="Sıcaklık" value={fmt(b?.temperature)} unit="°C" />
      </div>
    </Panel>
  )
}
