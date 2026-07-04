import { GrafikOlusturucu } from "../features/grafik/components/GrafikOlusturucu";
import { GrafikPanel } from "../features/grafik/components/GrafikPanel";
import { useGrafikTanimStore } from "../features/grafik/store/grafikTanimStore";

export function GrafikPage() {
  const grafikler = useGrafikTanimStore((s) => s.grafikler);
  const removeGrafik = useGrafikTanimStore((s) => s.removeGrafik);

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Canlı Veri</p>
          <h2>Grafikler</h2>
        </div>
      </header>
      <div className="grafik-grid">
        {grafikler.map((grafik) => (
          <GrafikPanel
            key={grafik.id}
            tanim={grafik}
            onRemove={() => removeGrafik(grafik.id)}
          />
        ))}
        <GrafikOlusturucu />
      </div>
    </div>
  );
}
