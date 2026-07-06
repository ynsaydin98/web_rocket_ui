import { Panel } from "../shared/components/Panel";
import { PtKutulari } from "../features/flightTermination/components/PtKutulari";
import { TcKutulari } from "../features/flightTermination/components/TcKutulari";
import { ZenitAzimutGostergesi } from "../features/flightTermination/components/ZenitAzimutGostergesi";

export function FlightTerminationPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Uçuş Güvenliği</p>
          <h2>Uçuş Sonlandırma</h2>
        </div>
      </header>

      <div className="ft-layout">
        <div className="ft-layout__sensorler">
          <Panel title="BASINÇ SENSÖRLERİ (PT)" eyebrow="Telemetri">
            <PtKutulari />
          </Panel>
          <Panel title="SICAKLIK SENSÖRLERİ (TC)" eyebrow="Telemetri">
            <TcKutulari />
          </Panel>
        </div>
        <Panel title="ZENİT / AZİMUT" eyebrow="Yönelim">
          <ZenitAzimutGostergesi />
        </Panel>
      </div>
    </div>
  );
}
