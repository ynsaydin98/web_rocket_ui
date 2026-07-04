import { useConnectionStore } from "../../../realtime/connectionStore";
import { Panel } from "../../../shared/components/Panel";
import {
  StatusBadge,
  type StatusTone,
} from "../../../shared/components/StatusBadge";
const tones = {
  idle: "neutral",
  connecting: "warning",
  connected: "success",
  disconnected: "danger",
  error: "danger",
} satisfies Record<string, StatusTone>;
export function ConnectionStatus() {
  const status = useConnectionStore((state) => state.status);
  const errorMessage = useConnectionStore((state) => state.errorMessage);
  return (
    <Panel
      title="WebSocket Bağlantısı"
      eyebrow="Transport"
      action={
        <StatusBadge tone={tones[status]}>{status.toUpperCase()}</StatusBadge>
      }
    >
      <div className="connection-details">
        <span>Durum</span>
        <strong>{status}</strong>
      </div>
      {errorMessage && <p className="error-copy">Hata: {errorMessage}</p>}
    </Panel>
  );
}
