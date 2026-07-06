import { GostergeKarti } from "../features/gostergeler/components/GostergeKarti";
import {
  GOSTERGE_GRUPLARI,
  GOSTERGE_TANIMLARI,
} from "../features/gostergeler/config/gostergeTanimlari";
import { useGostergeLimitStore } from "../features/gostergeler/store/gostergeLimitStore";

export function GostergelerPage() {
  const limitler = useGostergeLimitStore((s) => s.limitler);
  const setLimit = useGostergeLimitStore((s) => s.setLimit);
  const clearLimit = useGostergeLimitStore((s) => s.clearLimit);

  return (
    <div className="page-stack">
      {GOSTERGE_GRUPLARI.map((grup) => (
        <section key={grup} className="gosterge-grup">
          <h3 className="gosterge-grup__baslik">{grup}</h3>
          <div className="gosterge-grid">
            {GOSTERGE_TANIMLARI.filter((tanim) => tanim.grup === grup).map(
              (tanim) => (
                <GostergeKarti
                  key={tanim.id}
                  tanim={tanim}
                  limit={limitler[tanim.id]}
                  onLimitKaydet={(limit) => setLimit(tanim.id, limit)}
                  onLimitTemizle={() => clearLimit(tanim.id)}
                />
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
