import { MetricCard } from "../../../shared/components/MetricCard";
import { useMKUItkiDiagnostikPaketStore } from "../../../store/mku/mkuItkiDiagnostikPaketStore";
import type { MKUItkiDiagnostikPaketUiModel } from "../../../ui-models/mku/mkuItkiDiagnostikPaketUiModel";
import { formatDeger } from "../../../shared/utils/formatDeger";

const TC_ALANLARI: { alan: keyof MKUItkiDiagnostikPaketUiModel; etiket: string }[] = [
  { alan: "TC1", etiket: "TC1" },
  { alan: "TC2", etiket: "TC2" },
];

/** TC (sıcaklık) değerlerini metrik kutularında gösterir. */
export function TcKutulari() {
  const ozet = useMKUItkiDiagnostikPaketStore((state) => state.ozet);

  return (
    <div className="ft-tc-grid">
      {TC_ALANLARI.map(({ alan, etiket }) => (
        <MetricCard
          key={alan}
          label={etiket}
          value={ozet ? formatDeger(ozet[alan], 1, 1).trim() : "--"}
          detail="sıcaklık"
        />
      ))}
    </div>
  );
}
