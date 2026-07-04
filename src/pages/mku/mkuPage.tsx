import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { YoklamaVersiyon } from "../../shared/components/YoklamaVersiyon";
import { sendCommand } from "../../features/commands/services/commandSender";
import { MessageTypes } from "../../contracts/messageTypes";
import { createResetKomut } from "../../commands/resetKomut/resetKomutFactory";
import { createYoklamaKomut } from "../../commands/yoklamaKomut/yoklamaKomutFactory";
import { useMKUVersiyonPaketStore } from "../../store/mku/mkuVersiyonPaketStore";
import { useMKUYoklamaPaketStore } from "../../store/mku/mkuYoklamaPaketStore";
import { createVersiyonKomut } from "../../commands/versiyonKomut/versiyonKomutFactory";
import { MKUItkiDiagnostikDataTable } from "../../features/dashboard/components/mku/mkuItkiDiagnostikDataTable";

const tableGridStyle = {
  "--tables-column-count": 4,
  "--tables-column-count-lg": 1,
  "--tables-column-count-md": 1,
  "--tables-column-count-sm": 1,
} as CSSProperties;

type TableSection = "sistem-bilgisi";

const tableSections: Array<{ id: TableSection; label: string; to: string }> = [
  {
    id: "sistem-bilgisi",
    label: "Sistem Bilgisi",
    to: "/tables/mku/sistem-bilgisi",
  },
];

function getTableSection(section: string | undefined): TableSection | null {
  if (!section) return "sistem-bilgisi";
  if (section === "sistem-bilgisi") {
    return section;
  }
  return null;
}

export function MKUPage() {
  const { section } = useParams();
  const activeSection = getTableSection(section);

  const [yoklamaDurumu, setYoklamaDurumu] = useState<0 | 1>(0);
  const lastYoklamaUpdateId = useMKUYoklamaPaketStore(
    (state) => state.lastUpdateId,
  );
  const yoklamaBaselineUpdateId = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (yoklamaDurumu !== 0) return;
    if (lastYoklamaUpdateId === undefined) return;
    if (lastYoklamaUpdateId === yoklamaBaselineUpdateId.current) return;
    setYoklamaDurumu(1);
  }, [lastYoklamaUpdateId, yoklamaDurumu]);

  const [versiyonCevabi, setVersiyonCevabi] = useState("Cevap bekleniyor...");
  const versiyonData = useMKUVersiyonPaketStore((state) => state.ozet);
  const lastVersiyonUpdateId = useMKUVersiyonPaketStore(
    (state) => state.lastUpdateId,
  );
  const versiyonBaselineUpdateId = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (versiyonCevabi !== "Cevap bekleniyor...") {
      return;
    }
    if (lastVersiyonUpdateId === undefined || !versiyonData) {
      return;
    }
    if (lastVersiyonUpdateId === versiyonBaselineUpdateId.current) {
      return;
    }
    setVersiyonCevabi(`${versiyonData.versiyonText}`);
  }, [lastVersiyonUpdateId, versiyonData, versiyonCevabi]);

  function yoklamaSorguGonder() {
    yoklamaBaselineUpdateId.current = lastYoklamaUpdateId;
    setYoklamaDurumu(0);
    sendCommand(createYoklamaKomut("1", MessageTypes.MKUYoklamaPaket));
  }

  function versiyonSorguGonder() {
    versiyonBaselineUpdateId.current = lastVersiyonUpdateId;
    setVersiyonCevabi("Cevap bekleniyor...");
    sendCommand(createVersiyonKomut("1", MessageTypes.MKUVersiyonPaket));
  }

  function resetGonder() {
    sendCommand(createResetKomut("1", MessageTypes.MKUResetPaket));
  }

  if (!activeSection) {
    return <Navigate to="/tables/mku/sistem-bilgisi" replace />;
  }

  return (
    <div className="unit-tables-page">
      <nav className="table-section-tabs" aria-label="MKU tablo grubu">
        {tableSections.map((section) => (
          <NavLink
            key={section.id}
            to={section.to}
            end={section.id === "sistem-bilgisi"}
            className={({ isActive }) =>
              `table-section-tabs__button${isActive ? " is-active" : ""}`
            }
          >
            {section.label}
          </NavLink>
        ))}
      </nav>

      {activeSection === "sistem-bilgisi" && (
        <div className="table-grid" style={tableGridStyle}>
          <div className="table-grid__column">
            <MKUItkiDiagnostikDataTable />
          </div>
          <div className="table-grid__column">
            <YoklamaVersiyon
              uniteAdi="MKU"
              yoklamaDurumu={yoklamaDurumu}
              versiyonCevabi={versiyonCevabi}
              onYoklamaClick={yoklamaSorguGonder}
              onVersiyonClick={versiyonSorguGonder}
            />
            <button
              className="unit-command-header__version"
              type="button"
              onClick={resetGonder}
            >
              RESET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
