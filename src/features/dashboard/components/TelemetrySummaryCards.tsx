import { MetricCard } from "../../../shared/components/MetricCard";
import { Panel } from "../../../shared/components/Panel";
import { StatusBadge } from "../../../shared/components/StatusBadge";

export function TelemetrySummaryCards() {
  return (
    <Panel
      title="Telemetri Özeti"
      eyebrow="Canlı Akış"
      action={<StatusBadge tone={"danger"}>{"NOMİNAL"}</StatusBadge>}
    >
      <div className="metric-grid">
        <MetricCard label="İrtifa" value={"--"} unit="m" />
        <MetricCard label="Hız" value={"--"} unit="m/s" />
        <MetricCard label="Batarya" value={"--"} unit="V" tone={"success"} />
        <MetricCard
          label="Uçuş Durumu"
          value={"--"}
          detail={`Guncelleme: ${"-"}`}
          tone={"info"}
        />
      </div>
    </Panel>
  );
}
