import { MetricCard } from "../../../shared/components/MetricCard";
import { useMKUItkiDiagnostikPaketStore } from "../../../store/mku/mkuItkiDiagnostikPaketStore";
import type { MKUItkiDiagnostikPaketUiModel } from "../../../ui-models/mku/mkuItkiDiagnostikPaketUiModel";
import { formatDeger } from "../../../shared/utils/formatDeger";

const PT_ALANLARI: { alan: keyof MKUItkiDiagnostikPaketUiModel; etiket: string }[] = [
  { alan: "PT1", etiket: "PT1" },
  { alan: "PT2", etiket: "PT2" },
  { alan: "PT3", etiket: "PT3" },
  { alan: "PT4", etiket: "PT4" },
  { alan: "PT5", etiket: "PT5" },
];

/** PT (basınç) değerlerini büyük metrik kutularında gösterir. */
export function PtKutulari() {
  const ozet = useMKUItkiDiagnostikPaketStore((state) => state.ozet);

  return (
    <div className="ft-pt-grid">
      {PT_ALANLARI.map(({ alan, etiket }) => (
        <MetricCard
          key={alan}
          label={etiket}
          value={ozet ? formatDeger(ozet[alan], 1, 1).trim() : "--"}
          detail="basınç"
        />
      ))}
    </div>
  );
}
