import { appConfig } from "../../app/appConfig";
import { useTelemetryStore } from "../../features/telemetry/store/telemetryStore";
import { StatusBadge } from "./StatusBadge";
import { GnssClockSyncButton } from "../../features/gnss/components/GnssClockSyncButton";
import { useGnssStore } from "../../features/gnss/store/gnssStore";

function formatGnssTime(value?: string) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("tr-TR", {
    hour12: false,
  });
}

export function TopBar() {
  const telemetry = useTelemetryStore((state) => state.roketOzet);
  const operationMode = telemetry?.durumText ?? "MOD BEKLENİYOR";
  const shouldScrollMode = operationMode.length > 18;
  const gnss = useGnssStore((state) => state.gnssOzet);

  return (
    <header className="top-bar">
      <div className="top-bar__primary">
        <div className="top-bar__identity">
          <span className="rocket-logo" aria-hidden="true">
            <i />
          </span>
          <div>
            <h1>{appConfig.appName}</h1>
            <p>MISSION CONTROL SYSTEM</p>
          </div>
        </div>
        <div className="mission-clock">
          <span>Görev Zamanı</span>
          <strong>T- 00:00:10</strong>
        </div>
        <div className="quick-telemetry">
          <div>
            <span>Sistem Saati</span>
            <strong>{telemetry?.sistemSaati ?? "--"}</strong>
          </div>

          <div className="quick-telemetry__sync">
            <span>GNSS Saati</span>
            <strong>{formatGnssTime(gnss?.gnssSaati)}</strong>
            <GnssClockSyncButton />
          </div>

          <div>
            <span>Hız</span>
            <strong>
              {telemetry?.hiz ?? "--"} <small>m/s</small>
            </strong>
          </div>

          <div>
            <span>İrtifa</span>
            <strong>
              {telemetry?.irtifa ?? "--"} <small>m</small>
            </strong>
          </div>
        </div>
      </div>
      <div className="operation-strip">
        <div className="operation-mode" title={operationMode}>
          <span className={shouldScrollMode ? "is-scrolling" : undefined}>
            {operationMode}
          </span>
        </div>
        <span className="operation-strip__telemetry">
          <StatusBadge tone={telemetry ? "success" : "warning"}>
            {telemetry ? "ROKET VERİSİ VAR" : "VERİ BEKLENİYOR"}
          </StatusBadge>
        </span>
      </div>
    </header>
  );
}
