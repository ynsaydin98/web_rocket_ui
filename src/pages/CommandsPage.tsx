import { MissionControlSchematic } from "../features/missionControl/components/MissionControlSchematic";
import { MissionControlGraph } from "../features/missionControl/components/MissionControlGraph";
import { MissionControlSequencePanel } from "../features/missionControl/components/MissionControlSequencePanel";
import { buildMissionControlView } from "../features/missionControl/mappers/missionControlViewMapper";
import "../features/missionControl/missionControl.css";
import { useMissionControlStore } from "../features/missionControl/store/missionControlStore";
import { useMKUItkiDiagnostikPaketStore } from "../store/mku/mkuItkiDiagnostikPaketStore";

/** Komut & Sekans: itki test standının P&ID şeması, canlı telemetri grafiği ve sekans kontrol paneli. */
export function CommandsPage() {
  const ozet = useMKUItkiDiagnostikPaketStore((s) => s.ozet);
  const localState = useMissionControlStore((s) => s);
  const view = buildMissionControlView(ozet, localState);

  return (
    <div className="mc-page">
      <main className="mc-main">
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
