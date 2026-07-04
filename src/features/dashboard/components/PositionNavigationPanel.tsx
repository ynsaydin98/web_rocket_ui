import { appConfig } from "../../../app/appConfig";
import { Panel } from "../../../shared/components/Panel";
import { RocketLocationMap } from "./RocketLocationMap";
import { AttitudeInstruments } from "./AttitudeInstruments";

const placeholder = "--";

export function PositionNavigationPanel() {
  // Gerçek GNSS telemetri paketi tanımlanana kadar geliştirme test
  // koordinatları kullanılır; canlı veri geldiğinde buradan beslenmelidir.
  const latitude = appConfig.testLatitude;
  const longitude = appConfig.testLongitude;

  return (
    <Panel title="KONUM & YÖNELİM" eyebrow="GNSS" className="mission-panel">
      <div className="data-strip data-strip--five">
        <DataPoint label="Uydu Sayısı" value={placeholder} />
        <DataPoint label="Enlem" value={formatCoordinate(latitude)} />
        <DataPoint label="Boylam" value={formatCoordinate(longitude)} />
        <DataPoint label="Yükseklik" value={placeholder} unit="m" />
        <DataPoint label="Hız" value={placeholder} unit="m/s" />
      </div>

      <section className="subsystem-block">
        <h3>Harita / Konum</h3>
        <RocketLocationMap latitude={latitude} longitude={longitude} />
        <div className="map-meta">
          <span>Lat: {formatCoordinate(latitude)}</span>
          <span>Lng: {formatCoordinate(longitude)}</span>
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
