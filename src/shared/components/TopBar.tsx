import { appConfig } from "../../app/appConfig";
import { StatusBadge } from "./StatusBadge";

export function TopBar() {
  const operationMode = "MOD BEKLENİYOR";
  const shouldScrollMode = operationMode.length > 18;

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
          <div className="operation-mode" title={operationMode}>
            <span className={shouldScrollMode ? "is-scrolling" : undefined}>
              {operationMode}
            </span>
          </div>
        </div>
        <div className="quick-telemetry">
          <div>
            <span>Sistem Saati</span>
            <strong>{"--"}</strong>
          </div>

          <div className="quick-telemetry__sync">
            <span>GNSS Saati</span>
            <strong>{0}</strong>
          </div>

          <div>
            <span>Hız</span>
            <strong>
              {"--"} <small>m/s</small>
            </strong>
          </div>

          <div>
            <span>İrtifa</span>
            <strong>
              {"--"} <small>m</small>
            </strong>
          </div>

          <div className="quick-telemetry__status">
            <StatusBadge tone={"success"}>{"VERİ BEKLENİYOR"}</StatusBadge>
          </div>
        </div>
      </div>
    </header>
  );
}
