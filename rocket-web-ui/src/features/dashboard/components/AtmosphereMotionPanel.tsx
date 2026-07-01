import { appConfig } from "../../../app/appConfig";
import { Panel } from "../../../shared/components/Panel";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useTelemetryStore } from "../../telemetry/store/telemetryStore";

const placeholder = "--";

export function AtmosphereMotionPanel() {
  const telemetry = useTelemetryStore((state) => state.roketOzet);
  const roll = telemetry?.roll ?? appConfig.testRoll;
  const pitch = telemetry?.pitch ?? appConfig.testPitch;
  const yaw = telemetry?.yaw ?? appConfig.testYaw;

  return (
    <Panel
      title="Atmosfer & Hareket"
      eyebrow="Sensörler"
      className="mission-panel"
    >
      <section className="subsystem-block">
        <h3>Barometre</h3>
        <div className="data-strip data-strip--three">
          <DataCell label="Basınç" value={placeholder} unit="hPa" />
          <DataCell
            label="Yükseklik"
            value={telemetry?.irtifa ?? placeholder}
            unit="m"
          />
          <DataCell label="Sıcaklık" value={placeholder} unit="°C" />
        </div>
      </section>
      <section className="subsystem-block">
        <h3>IMU</h3>
        <div className="data-strip data-strip--three">
          <DataCell label="İvme X" value={placeholder} unit="m/s²" />
          <DataCell label="İvme Y" value={placeholder} unit="m/s²" />
          <DataCell label="İvme Z" value={placeholder} unit="m/s²" />
          <DataCell label="Roll" value={roll ?? placeholder} unit="°" />
          <DataCell label="Pitch" value={pitch ?? placeholder} unit="°" />
          <DataCell label="Yaw" value={yaw ?? placeholder} unit="°" />
        </div>
      </section>
      <section className="subsystem-block battery-block">
        <h3>Güç Sistemi</h3>
        <div className="battery-reading">
          <span>Batarya</span>
          <strong>{telemetry?.batarya ?? placeholder} V</strong>
        </div>
        <div className="level-bar">
          <span
            style={{
              width: telemetry
                ? `${Math.min(100, Math.max(0, telemetry.batarya))}%`
                : "0%",
            }}
          />
        </div>
      </section>
      <section className="subsystem-block event-log">
        <h3>Alarm / Event Log</h3>
        <div className="event-log__head">
          <span>Zaman</span>
          <span>Seviye</span>
          <span>Kaynak</span>
          <span>Mesaj</span>
        </div>
        <div className="event-log__row">
          <span>--:--:--</span>
          <StatusBadge tone={telemetry ? "success" : "warning"}>
            {telemetry ? "veri var" : "bekleniyor"}
          </StatusBadge>
          <span>ROKET</span>
          <span>
            {telemetry ? "Telemetri verisi alındı" : "Telemetri verisi bekleniyor"}
          </span>
        </div>
      </section>
    </Panel>
  );
}

type DataCellProps = { label: string; value: string | number; unit: string };
function DataCell({ label, value, unit }: DataCellProps) {
  return (
    <div className="data-point">
      <span>{label}</span>
      <strong>
        {value} <small>{unit}</small>
      </strong>
    </div>
  );
}
