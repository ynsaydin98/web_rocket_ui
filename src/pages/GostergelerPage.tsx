import { DurusGostergeleri } from "../features/flightTermination/components/DurusGostergeleri";
import { GostergeKarti } from "../features/gostergeler/components/GostergeKarti";
import {
  GOSTERGE_GRUPLARI,
  GOSTERGE_TANIMLARI,
} from "../features/gostergeler/config/gostergeTanimlari";
import { Panel } from "../shared/components/Panel";

export function GostergelerPage() {
  return (
    <div className="page-stack">
      {GOSTERGE_GRUPLARI.map((grup) => (
        <section key={grup} className="gosterge-grup">
          <h3 className="gosterge-grup__baslik">{grup}</h3>
          <div className="gosterge-grid">
            {GOSTERGE_TANIMLARI.filter((tanim) => tanim.grup === grup).map(
              (tanim) => (
                <GostergeKarti key={tanim.id} tanim={tanim} />
              ),
            )}
          </div>
        </section>
      ))}

      <Panel title="DURUŞ GÖSTERGELERİ" eyebrow="Yönelim">
        <DurusGostergeleri />
      </Panel>
    </div>
  );
}
