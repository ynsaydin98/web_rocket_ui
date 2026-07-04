import { Panel } from "../../../shared/components/Panel";
import { RocketLocationMap } from "./RocketLocationMap";
import { AttitudeInstruments } from "./AttitudeInstruments";

const placeholder = "--";

export function PositionNavigationPanel() {
  return (
    <Panel title="KONUM & YÖNELİM" eyebrow="GNSS" className="mission-panel">
      <div className="data-strip data-strip--five">
        <DataPoint label="Uydu Sayısı" value={placeholder} />
        <DataPoint label="Enlem" value={formatCoordinate(0)} />
        <DataPoint label="Boylam" value={formatCoordinate(0)} />
        <DataPoint label="Yükseklik" value={placeholder} unit="m" />
        <DataPoint label="Hız" value={placeholder} unit="m/s" />
      </div>

      <section className="subsystem-block">
        <h3>Harita / Konum</h3>
        <RocketLocationMap latitude={0} longitude={0} />
        <div className="map-meta">
          <span>Lat: {formatCoordinate(0)}</span>
          <span>Lng: {formatCoordinate(0)}</span>
          <span>Guncelleme: {placeholder}</span>
        </div>
      </section>

      <AttitudeInstruments roll={0} pitch={0} yaw={0} />
    </Panel>
  );
}

function formatCoordinate(value?: number) {
  return Number.isFinite(value) ? value!.toFixed(6) : placeholder;
}

type DataPointProps = { label: string; value: string | number; unit?: string };
function DataPoint({ label, value, unit }: DataPointProps) {
  return (
    <div className="data-point">
      <span>{label}</span>
      <strong>
        {value} {unit && <small>{unit}</small>}
      </strong>
    </div>
  );
}
