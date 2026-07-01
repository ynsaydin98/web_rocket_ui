import type { LabelValueRow } from "../types/labelValueRow";
import { Panel } from "./Panel";

type LabelValueTableProps = {
  title: string;
  eyebrow?: string;
  rows: LabelValueRow[];
};

export function LabelValueTable({
  title,
  eyebrow = "Label / Değer",
  rows,
}: LabelValueTableProps) {
  return (
    <Panel
      title={title}
      eyebrow={eyebrow}
      className="telemetry-table-panel"
    >
      <div className="telemetry-table telemetry-table--model" role="table">
        <div className="telemetry-table__head" role="row">
          <span role="columnheader">Label</span>
          <span role="columnheader">Değer</span>
        </div>
        {rows.map((row) => (
          <div className="telemetry-table__row" role="row" key={row.label}>
            <strong role="cell">{row.label}</strong>
            <span role="cell">{row.value}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
