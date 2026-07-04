import { MissionControlHeader } from "../features/missionControl/components/MissionControlHeader";
import { MissionControlSchematic } from "../features/missionControl/components/MissionControlSchematic";
import { MissionControlGraph } from "../features/missionControl/components/MissionControlGraph";
import { MissionControlSequencePanel } from "../features/missionControl/components/MissionControlSequencePanel";
import { buildMissionControlView } from "../features/missionControl/mappers/missionControlViewMapper";
import "../features/missionControl/missionControl.css";
import { useMissionControlStore } from "../features/missionControl/store/missionControlStore";

export function MissionControlPage() {
  const state = useMissionControlStore((s) => s);
  const view = buildMissionControlView(state);

  return (
    <div className="mc-page">
      <MissionControlHeader view={view} />
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
