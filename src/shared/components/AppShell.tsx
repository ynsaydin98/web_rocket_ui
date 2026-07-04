import { Outlet } from "react-router-dom";
import { appVersion } from "../../app/appVersion";
import { PageTabs } from "./PageTabs";
import { TopBar } from "./TopBar";

export function AppShell() {
  return (
    <div className="app-shell">
      <TopBar />
      <PageTabs />
      <main className="app-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>ROKET YER İSTASYONU // OPERASYON KONSOLU</span>
        <span>Arayüz v{appVersion.version}</span>
      </footer>
    </div>
  );
}
