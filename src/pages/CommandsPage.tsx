import { CommandPanel } from "../features/commands/components/CommandPanel";
export function CommandsPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Operasyon</p>
          <h2>Komut & Sekans</h2>
        </div>
      </header>
      <CommandPanel />
    </div>
  );
}
