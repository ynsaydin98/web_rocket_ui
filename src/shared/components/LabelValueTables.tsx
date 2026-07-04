import type { CSSProperties } from "react";
import type { TableRowModels } from "../types/TableRowModel";
import { Panel } from "./Panel";

type LabelValueTableProps = {
  tabloBasligi: string;
  degerBasliklari: string[];
  rows: TableRowModels[];
};

export function LabelValueTables({
  tabloBasligi,
  degerBasliklari,
  rows,
}: LabelValueTableProps) {
  const columnCount = Math.max(degerBasliklari.length, 1);
  const tableStyle = {
    "--parameter-value-count": columnCount,
  } as CSSProperties;

  return (
    <Panel
      title={tabloBasligi}
      className="telemetry-table-panel parameter-table-panel"
    >
      <div
        className="telemetry-table telemetry-table--parameter"
        role="table"
        style={tableStyle}
      >
        <div className="telemetry-table__head" role="row">
          <span role="columnheader">Parametre</span>
          {degerBasliklari.map((baslik) => (
            <span role="columnheader" key={baslik}>
              {baslik}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div className="telemetry-table__row" role="row" key={row.baslik}>
            <strong role="cell">{row.baslik}</strong>
            {degerBasliklari.map((baslik, indeks) => (
              <span role="cell" key={`${row.baslik}-${baslik}`}>
                {row.degerler[indeks] ?? "-"}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Panel>
  );
}
