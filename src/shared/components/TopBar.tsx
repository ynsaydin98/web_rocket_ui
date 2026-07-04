import { appConfig } from "../../app/appConfig";
import {
  formatGeriSayim,
  mapItkiOpDurumlariToOpMod,
} from "../../features/missionControl/mappers/itkiOpModMapper";
import { useMKUItkiDiagnostikPaketStore } from "../../store/mku/mkuItkiDiagnostikPaketStore";
import { StatusBadge } from "./StatusBadge";

export function TopBar() {
  const itkiOzet = useMKUItkiDiagnostikPaketStore((s) => s.ozet);

  const geriSayimText = itkiOzet
    ? `T- ${formatGeriSayim(itkiOzet.itkiBaslatmaGeriSayim_sn)}`
    : "T- --:--";
  const operationMode = itkiOzet
    ? mapItkiOpDurumlariToOpMod(itkiOzet.itkiOpDurumlari)
    : "MOD BEKLENİYOR";
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
        <div className="top-bar__mission">
          <div className="mission-box" aria-label="Geri sayım">
            <span>Geri Sayım</span>
            <strong>{geriSayimText}</strong>
          </div>
          <div className="mission-box" aria-label="Operasyon modu">
            <span>Operasyon Modu</span>
            <div className="operation-mode" title={operationMode}>
              <span className={shouldScrollMode ? "is-scrolling" : undefined}>
                {operationMode}
              </span>
            </div>
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
