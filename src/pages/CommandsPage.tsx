import { ManuelKomutPanel } from "../features/missionControl/components/ManuelKomutPanel";
import { MissionControlSchematic } from "../features/missionControl/components/MissionControlSchematic";
import { MissionControlGraph } from "../features/missionControl/components/MissionControlGraph";
import { MissionControlSequencePanel } from "../features/missionControl/components/MissionControlSequencePanel";
import { SekansSecimPanel } from "../features/missionControl/components/SekansSecimPanel";
import { buildMissionControlView } from "../features/missionControl/mappers/missionControlViewMapper";
import "../features/missionControl/missionControl.css";
import { useMissionControlStore } from "../features/missionControl/store/missionControlStore";
import { useMKUItkiDiagnostikPaketStore } from "../store/mku/mkuItkiDiagnostikPaketStore";

/** Komut & Sekans: manuel komut + sekans seçimi sütunu, P&ID şeması, canlı grafik ve sekans kontrol paneli. */
export function CommandsPage() {
  const ozet = useMKUItkiDiagnostikPaketStore((s) => s.ozet);
  const localState = useMissionControlStore((s) => s);
  const view = buildMissionControlView(ozet, localState);

  return (
    <div className="mc-page">
      <main className="mc-main">
        <aside className="mc-komut">
          <ManuelKomutPanel view={view} />
          <SekansSecimPanel />
        </aside>
        <section className="mc-center">
          <MissionControlSchematic view={view} />
          <MissionControlGraph view={view} />
        </section>
        <aside className="mc-sequence">
          <MissionControlSequencePanel view={view} />
        </aside>
      </main>
    </div>
  );
}
