import type { CSSProperties } from "react";
import type { ParameterValueRow } from "../types/parameterValueRow";
import { Panel } from "./Panel";

type ParameterValueTableProps = {
  title: string;
  eyebrow?: string;
  rows: ParameterValueRow[];
  valueLabels: string[];
};

export function ParameterValueTable({
  title,
  eyebrow = "Parametre / Degerler",
  rows,
  valueLabels,
}: ParameterValueTableProps) {
  const columnCount = Math.max(valueLabels.length, 1);
  const tableStyle = {
    "--parameter-value-count": columnCount,
  } as CSSProperties;

  return (
    <Panel
      title={title}
      eyebrow={eyebrow}
      className="telemetry-table-panel parameter-table-panel"
    >
      <div
        className="telemetry-table telemetry-table--parameter"
        role="table"
        style={tableStyle}
      >
        <div className="telemetry-table__head" role="row">
          <span role="columnheader">Parametre</span>
          {valueLabels.map((label) => (
            <span role="columnheader" key={label}>
              {label}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div
            className="telemetry-table__row"
            role="row"
            key={row.parameter}
          >
            <strong role="cell">{row.parameter}</strong>
            {valueLabels.map((label, index) => (
              <span role="cell" key={`${row.parameter}-${label}`}>
                {row.values[index] ?? "--"}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Panel>
  );
}
