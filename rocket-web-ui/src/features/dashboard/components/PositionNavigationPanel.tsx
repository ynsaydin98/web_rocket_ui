import { appConfig } from "../../../app/appConfig";
import { Panel } from "../../../shared/components/Panel";
import { useTelemetryStore } from "../../telemetry/store/telemetryStore";
import { RocketLocationMap } from "./RocketLocationMap";
import { AttitudeInstruments } from "./AttitudeInstruments";

const placeholder = "--";

export function PositionNavigationPanel() {
  const telemetry = useTelemetryStore((state) => state.roketOzet);
  const lastUpdateId = useTelemetryStore((state) => state.lastUpdateId);
  const latitude = telemetry?.enlem ?? appConfig.testLatitude;
  const longitude = telemetry?.boylam ?? appConfig.testLongitude;
  const roll = telemetry?.roll ?? appConfig.testRoll;
  const pitch = telemetry?.pitch ?? appConfig.testPitch;
  const yaw = telemetry?.yaw ?? appConfig.testYaw;

  return (
    <Panel title="KONUM & YÖNELİM" eyebrow="GNSS" className="mission-panel">
      <div className="data-strip data-strip--five">
        <DataPoint label="Uydu Sayısı" value={placeholder} />
        <DataPoint label="Enlem" value={formatCoordinate(latitude)} />
        <DataPoint label="Boylam" value={formatCoordinate(longitude)} />
        <DataPoint
          label="Yükseklik"
          value={telemetry?.irtifa ?? placeholder}
          unit="m"
        />
        <DataPoint
          label="Hız"
          value={telemetry?.hiz ?? placeholder}
          unit="m/s"
        />
      </div>

      <section className="subsystem-block">
        <h3>Harita / Konum</h3>
        <RocketLocationMap
          latitude={latitude}
          longitude={longitude}
        />
        <div className="map-meta">
          <span>Lat: {formatCoordinate(latitude)}</span>
          <span>Lng: {formatCoordinate(longitude)}</span>
          <span>Guncelleme: {lastUpdateId ?? placeholder}</span>
        </div>
      </section>

      <AttitudeInstruments
        roll={roll}
        pitch={pitch}
        yaw={yaw}
      />
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
