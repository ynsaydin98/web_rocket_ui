import { AdminLoginPanel } from "../features/debug/components/AdminLoginPanel";
import { ConnectionStatus } from "../features/debug/components/ConnectionStatus";
import { RawMessageViewer } from "../features/debug/components/RawMessageViewer";
import { SeriUdpKopruPanel } from "../features/debug/components/SeriUdpKopruPanel";
export function DebugPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Sistem İzleme</p>
          <h2>Hata Ayıklama Konsolu</h2>
        </div>
      </header>
      <AdminLoginPanel />
      <ConnectionStatus />
      <SeriUdpKopruPanel />
      <RawMessageViewer />
    </div>
  );
}
