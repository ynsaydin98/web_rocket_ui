import { LabelValueTable } from "../../../shared/components/LabelValueTable";
import type { LabelValueRow } from "../../../shared/types/labelValueRow";
import { useGnssStore } from "../store/gnssStore";

export function GnssDataTable() {
  const gnss = useGnssStore((state) => state.gnssOzet);
  const lastUpdateId = useGnssStore((state) => state.lastUpdateId);

  const rows: LabelValueRow[] = [
    { label: "GNSS Saati", value: formatGnssTime(gnss?.gnssSaati) },
    { label: "Guncelleme", value: lastUpdateId?.toString() ?? "--" },
  ];

  return <LabelValueTable title="GNSS Modeli" rows={rows} />;
}

function formatGnssTime(value?: string) {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("tr-TR", { hour12: false });
}
