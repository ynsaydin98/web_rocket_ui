import { JsonViewer } from "../../../shared/components/JsonViewer";
import { Panel } from "../../../shared/components/Panel";
import {
  StatusBadge,
  type StatusTone,
} from "../../../shared/components/StatusBadge";
import { useCommandStore } from "../store/commandStore";

const statusLabels = {
  idle: "BEKLEMEDE",
  sent: "GÖNDERİLDİ",
  error: "HATA",
} as const;
const statusTones: Record<keyof typeof statusLabels, StatusTone> = {
  idle: "neutral",
  sent: "success",
  error: "danger",
};
export function CommandPanel() {
  const status = useCommandStore((state) => state.status);
  const errorMessage = useCommandStore((state) => state.errorMessage);
  const lastCommand = useCommandStore((state) => state.lastCommand);
  return (
    <div className="command-layout">
      <Panel
        title="Son Komut"
        eyebrow="Gönderim Kaydı"
        action={
          <StatusBadge tone={statusTones[status]}>
            {statusLabels[status]}
          </StatusBadge>
        }
      >
        {lastCommand && (
          <p className="command-meta">
            {lastCommand.messageType} / {lastCommand.commandType} / ID:{" "}
            {lastCommand.id}
          </p>
        )}
        <JsonViewer value={lastCommand} emptyText="Henüz komut gönderilmedi." />
        {errorMessage && <p className="error-copy">Hata: {errorMessage}</p>}
      </Panel>
    </div>
  );
}
