import { MetricCard } from "../../../shared/components/MetricCard";
import { Panel } from "../../../shared/components/Panel";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useTelemetryStore } from "../../telemetry/store/telemetryStore";

export function TelemetrySummaryCards() {
  const roketOzet = useTelemetryStore((state) => state.roketOzet);
  const lastUpdateId = useTelemetryStore((state) => state.lastUpdateId);
  if (!roketOzet)
    return (
      <Panel
        title="Telemetri Özeti"
        eyebrow="Canlı Akış"
        action={<StatusBadge>VERİ BEKLENİYOR</StatusBadge>}
      >
        <p className="empty-state">Henüz telemetri mesajı alınmadı.</p>
      </Panel>
    );
  return (
    <Panel
      title="Telemetri Özeti"
      eyebrow="Canlı Akış"
      action={
        <StatusBadge tone={roketOzet.kritikMi ? "danger" : "success"}>
          {roketOzet.kritikMi ? "KRİTİK" : "NOMİNAL"}
        </StatusBadge>
      }
    >
      <div className="metric-grid">
        <MetricCard label="İrtifa" value={roketOzet.irtifa} unit="m" />
        <MetricCard label="Hız" value={roketOzet.hiz} unit="m/s" />
        <MetricCard
          label="Batarya"
          value={roketOzet.batarya}
          unit="V"
          tone={roketOzet.kritikMi ? "danger" : "success"}
        />
        <MetricCard
          label="Uçuş Durumu"
          value={roketOzet.durumText}
          detail={`Guncelleme: ${lastUpdateId ?? "-"}`}
          tone={roketOzet.kritikMi ? "danger" : "info"}
        />
      </div>
    </Panel>
  );
}
