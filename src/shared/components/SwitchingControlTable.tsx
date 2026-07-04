import { useState } from "react";
import type { SwitchingAction } from "../../features/switching/commands/switchingCommandFactory";
import { Panel } from "./Panel";

export type SwitchingLedState = "green" | "red";

export type SwitchingControlRow = {
  id: string;
  status: SwitchingLedState;
  command: SwitchingLedState;
  mode: SwitchingLedState;
  info: string;
};

type SwitchingControlTableProps = {
  title: string;
  eyebrow?: string;
  rows: SwitchingControlRow[];
  onCommand?: (
    row: SwitchingControlRow,
    action: SwitchingAction,
    force: boolean,
  ) => void;
};

const actionButtons: Array<{
  action: SwitchingAction;
  label: string;
  title: string;
}> = [
  { action: "close", label: "K", title: "Kapat" },
  { action: "reset", label: "R", title: "Reset" },
  { action: "open", label: "A", title: "Ac" },
];

export function SwitchingControlTable({
  title,
  eyebrow = "Anahtarlama",
  rows,
  onCommand,
}: SwitchingControlTableProps) {
  const [forceByRowId, setForceByRowId] = useState<Record<string, boolean>>({});

  function isForced(rowId: string) {
    return forceByRowId[rowId] ?? false;
  }

  return (
    <Panel
      title={title}
      eyebrow={eyebrow}
      className="telemetry-table-panel switching-table-panel"
    >
      <div className="switching-table" role="table">
        <div className="switching-table__head" role="row">
          <span role="columnheader">Durum</span>
          <span role="columnheader">Komut</span>
          <span role="columnheader">Mod</span>
          <span role="columnheader">Bilgi</span>
          <span role="columnheader">K/R/A</span>
          <span role="columnheader">Zorla</span>
        </div>

        {rows.map((row) => {
          const forced = isForced(row.id);

          return (
            <div className="switching-table__row" role="row" key={row.id}>
              <span role="cell">
                <Led state={row.status} label={`${row.info} durum`} />
              </span>
              <span role="cell">
                <Led state={row.command} label={`${row.info} komut`} />
              </span>
              <span role="cell">
                <Led state={row.mode} label={`${row.info} mod`} />
              </span>
              <strong role="cell">{row.info}</strong>
              <div className="switching-table__actions" role="cell">
                {actionButtons.map((button) => (
                  <button
                    className={`switching-table__button switching-table__button--${button.action}`}
                    type="button"
                    title={button.title}
                    aria-label={`${row.info} ${button.title}`}
                    key={button.action}
                    onClick={() => onCommand?.(row, button.action, forced)}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
              <label className="switching-table__force" role="cell">
                <input
                  type="checkbox"
                  checked={forced}
                  onChange={(event) =>
                    setForceByRowId((current) => ({
                      ...current,
                      [row.id]: event.target.checked,
                    }))
                  }
                />
                <span>Zorla</span>
              </label>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Led({ state, label }: { state: SwitchingLedState; label: string }) {
  return (
    <span
      className={`switching-led switching-led--${state}`}
      aria-label={`${label}: ${state === "green" ? "yesil" : "kirmizi"}`}
      role="img"
    />
  );
}
