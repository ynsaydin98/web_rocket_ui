import { useEffect, useState } from "react";
import { appConfig } from "../../app/appConfig";
import {
  formatGeriSayim,
  mapItkiOpDurumlariToOpMod,
} from "../../features/missionControl/mappers/itkiOpModMapper";
import { useConnectionStore } from "../../realtime/connectionStore";
import { useMKUItkiDiagnostikPaketStore } from "../../store/mku/mkuItkiDiagnostikPaketStore";

function formatLokalSaat() {
  return new Date().toLocaleTimeString("tr-TR", { hour12: false });
}

export function TopBar() {
  const itkiOzet = useMKUItkiDiagnostikPaketStore((s) => s.ozet);
  const dataLive = useConnectionStore((s) => s.dataLive);

  const [lokalSaat, setLokalSaat] = useState(formatLokalSaat);
  useEffect(() => {
    const timerId = window.setInterval(
      () => setLokalSaat(formatLokalSaat()),
      1000,
    );
    return () => window.clearInterval(timerId);
  }, []);

  const geriSayim = itkiOzet?.itkiBaslatmaGeriSayim_sn;
  const geriSayimPozitif = geriSayim !== undefined && geriSayim >= 0;
  const geriSayimText =
    geriSayim !== undefined
      ? `T${geriSayimPozitif ? "+" : "-"} ${formatGeriSayim(Math.abs(geriSayim))}`
      : "T- --:--";
  const geriSayimClassName =
    geriSayim === undefined
      ? "mission-box__countdown"
      : `mission-box__countdown mission-box__countdown--${geriSayimPozitif ? "positive" : "negative"}`;
  const operationMode = itkiOzet
    ? mapItkiOpDurumlariToOpMod(itkiOzet.itkiOpDurumlari)
    : "MOD BEKLENİYOR";
  const shouldScrollMode = operationMode.length > 18;

  return (
    <header className="top-bar">
      <div className="top-bar__primary">
        <div className="top-bar__identity">
          <img
            className="top-bar__brand-logo"
            src={appConfig.brandLogoPath}
            alt={appConfig.appName}
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
        </div>
        <div className="top-bar__mission">
          <div className="mission-box" aria-label="Geri sayım">
            <strong className={geriSayimClassName}>{geriSayimText}</strong>
          </div>
          <div className="mission-box" aria-label="Operasyon modu">
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
            <span>Lokal Saat</span>
            <strong>{lokalSaat}</strong>
          </div>

          <div
            className="quick-telemetry__status"
            title={dataLive ? "Veri akışı aktif" : "Veri bekleniyor"}
          >
            <span
              className={`data-led${dataLive ? " data-led--live" : ""}`}
              role="status"
              aria-label={dataLive ? "Veri akışı aktif" : "Veri bekleniyor"}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
