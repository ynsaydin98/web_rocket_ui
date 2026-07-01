import { Panel } from "../shared/components/Panel";
import { Navigate, NavLink, useParams } from "react-router-dom";

const tableSections = [
  { id: "all", label: "TÜM TABLOLAR", to: "/tables/unit-2" },
  { id: "telemetry", label: "TELEMETRİ", to: "/tables/unit-2/telemetry" },
  { id: "gnss", label: "GNSS", to: "/tables/unit-2/gnss" },
];

export function Unit2TablesPage() {
  const { section } = useParams();

  if (section && section !== "telemetry" && section !== "gnss") {
    return <Navigate to="/tables/unit-2" replace />;
  }

  return (
    <div className="unit-tables-page">
      <nav className="table-section-tabs" aria-label="UNITE-2 tablo grubu">
        {tableSections.map((section) => (
          <NavLink
            key={section.id}
            to={section.to}
            end={section.id === "all"}
            className={({ isActive }) =>
              `table-section-tabs__button${isActive ? " is-active" : ""}`
            }
          >
            {section.label}
          </NavLink>
        ))}
      </nav>

      <Panel title="UNITE-2" eyebrow="Model Tabloları">
        <p className="empty-state">Bu üniteye henüz tablo atanmadı.</p>
      </Panel>
    </div>
  );
}
