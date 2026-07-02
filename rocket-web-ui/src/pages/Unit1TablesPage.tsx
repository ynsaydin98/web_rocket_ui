import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { TelemetryDataTable } from "../features/dashboard/components/TelemetryDataTable";
import { sendCommand } from "../features/commands/services/commandSender";
import { GnssDataTable } from "../features/gnss/components/GnssDataTable";
import { createSwitchingCommand } from "../features/switching/commands/switchingCommandFactory";
import { useTelemetryStore } from "../features/telemetry/store/telemetryStore";
import { createVersionQueryCommand } from "../features/version/commands/versionCommandFactory";
import { useVersionStore } from "../features/version/store/versionStore";
import {
  SwitchingControlTable,
  type SwitchingControlRow,
} from "../shared/components/SwitchingControlTable";
import { UnitCommandHeader } from "../shared/components/UnitCommandHeader";

const tableGridStyle = {
  "--tables-column-count": 4,
  "--tables-column-count-lg": 3,
  "--tables-column-count-md": 2,
  "--tables-column-count-sm": 1,
} as CSSProperties;

const switchingTableGridStyle = {
  "--tables-column-count": 3,
  "--tables-column-count-lg": 3,
  "--tables-column-count-md": 1,
  "--tables-column-count-sm": 1,
} as CSSProperties;

type PendingTelemetryCommand = "yoklama" | null;
type TableSection = "telemetry" | "gnss" | "switching";

const tableSections: Array<{ id: TableSection; label: string; to: string }> = [
  { id: "telemetry", label: "TELEMETRİ", to: "/tables/unit-1/telemetry" },
  { id: "gnss", label: "GNSS", to: "/tables/unit-1/gnss" },
  {
    id: "switching",
    label: "ANAHTARLAMA",
    to: "/tables/unit-1/switching",
  },
];

const switchingRows: SwitchingControlRow[] = [
  {
    id: "main-power",
    status: "green",
    command: "red",
    mode: "green",
    info: "Ana besleme anahtarlama hatti",
  },
  {
    id: "payload-power",
    status: "red",
    command: "red",
    mode: "green",
    info: "Faydali yuk guc anahtarlama hatti",
  },
  {
    id: "telemetry-power",
    status: "green",
    command: "green",
    mode: "red",
    info: "Telemetri guc anahtarlama hatti",
  },
];

export function Unit1TablesPage() {
  const { section } = useParams();
  const activeSection = getTableSection(section);
  const [yoklamaDurumu, setYoklamaDurumu] = useState<0 | 1 | null>(null);
  const [versiyonCevabi, setVersiyonCevabi] = useState("Cevap bekleniyor");
  const lastTelemetryUpdateId = useTelemetryStore(
    (state) => state.lastUpdateId,
  );
  const versiyonBilgisi = useVersionStore((state) => state.versiyonBilgisi);
  const lastVersionUpdateId = useVersionStore((state) => state.lastUpdateId);

  const pendingTelemetryCommand = useRef<PendingTelemetryCommand>(null);
  const pendingVersionRequest = useRef(false);
  const yoklamaBaselineUpdateId = useRef<number | undefined>(undefined);
  const versiyonBaselineUpdateId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (pendingTelemetryCommand.current !== "yoklama") return;
    if (yoklamaDurumu !== 0) return;
    if (lastTelemetryUpdateId === undefined) return;
    if (lastTelemetryUpdateId === yoklamaBaselineUpdateId.current) return;

    pendingTelemetryCommand.current = null;
    setYoklamaDurumu(1);
  }, [lastTelemetryUpdateId, yoklamaDurumu]);

  useEffect(() => {
    if (!pendingVersionRequest.current) return;
    if (versiyonCevabi !== "Cevap bekleniyor") return;
    if (lastVersionUpdateId === undefined || !versiyonBilgisi) return;
    if (lastVersionUpdateId === versiyonBaselineUpdateId.current) return;

    pendingVersionRequest.current = false;
    setVersiyonCevabi(formatVersiyonSorguCevabi(versiyonBilgisi));
  }, [lastVersionUpdateId, versiyonBilgisi, versiyonCevabi]);

  function yoklamaSorguGonder() {
    pendingTelemetryCommand.current = "yoklama";
    yoklamaBaselineUpdateId.current = lastTelemetryUpdateId;
    // Komut gonderimini burada doldurabilirsin.
  }

  function versiyonSorguGonder() {
    pendingVersionRequest.current = true;
    versiyonBaselineUpdateId.current = lastVersionUpdateId;
    sendCommand(createVersionQueryCommand());
  }

  if (!activeSection) {
    return <Navigate to="/tables/unit-1" replace />;
  }

  return (
    <div className="unit-tables-page">
      <UnitCommandHeader
        unitName="UNITE-1"
        actionState={yoklamaDurumu}
        responseText={versiyonCevabi}
        onActionClick={() => {
          setYoklamaDurumu(0);
          yoklamaSorguGonder();
        }}
        onVersionClick={() => {
          setVersiyonCevabi("Cevap bekleniyor");
          versiyonSorguGonder();
        }}
      />

      <nav className="table-section-tabs" aria-label="UNITE-1 tablo grubu">
        {tableSections.map((section) => (
          <NavLink
            key={section.id}
            to={section.to}
            end={section.id === "telemetry"}
            className={({ isActive }) =>
              `table-section-tabs__button${isActive ? " is-active" : ""}`
            }
          >
            {section.label}
          </NavLink>
        ))}
      </nav>

      {activeSection === "telemetry" && (
        <div className="tables-grid" style={tableGridStyle}>
          <div className="tables-grid__column">
            <TelemetryDataTable />
          </div>
        </div>
      )}

      {activeSection === "gnss" && (
        <div className="tables-grid" style={tableGridStyle}>
          <div className="tables-grid__column">
            <GnssDataTable />
            <GnssDataTable />
          </div>
          <div className="tables-grid__column">
            <GnssDataTable />
          </div>
          <div className="tables-grid__column">
            <GnssDataTable />
          </div>
        </div>
      )}

      {activeSection === "switching" && (
        <div className="tables-grid" style={switchingTableGridStyle}>
          <div className="tables-grid__column">
            <SwitchingControlTable
              title="Anahtarlama Arayuzu"
              rows={switchingRows}
              onCommand={(row, action, force) => {
                sendCommand(
                  createSwitchingCommand({
                    switchId: row.id,
                    action,
                    force,
                  }),
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function getTableSection(section: string | undefined): TableSection | null {
  if (!section) return "telemetry";
  if (
    section === "telemetry" ||
    section === "gnss" ||
    section === "switching"
  ) {
    return section;
  }
  return null;
}

function formatVersiyonSorguCevabi(versiyonBilgisi: {
  versiyon: string;
  buildBilgisi?: string;
}) {
  if (!versiyonBilgisi.buildBilgisi) {
    return versiyonBilgisi.versiyon;
  }

  return `${versiyonBilgisi.versiyon} (${versiyonBilgisi.buildBilgisi})`;
}
