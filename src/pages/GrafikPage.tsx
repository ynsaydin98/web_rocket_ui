import { TelemetrySummaryCards } from "../features/dashboard/components/TelemetrySummaryCards";
import { Panel } from "../shared/components/Panel";

export function GrafikPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Canlı Veri</p>
          <h2>Grafikler & Telemetri</h2>
        </div>
      </header>
      <TelemetrySummaryCards />
      <Panel title="Telemetri Zaman Serisi" eyebrow="Grafik Alanı">
        <div className="chart-placeholder">
          <div className="chart-placeholder__grid" />
          <p>Grafik veri kaynağı bekleniyor</p>
        </div>
      </Panel>
    </div>
  );
}
