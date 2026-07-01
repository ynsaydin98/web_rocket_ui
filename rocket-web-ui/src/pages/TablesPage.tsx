import { NavLink, Outlet } from "react-router-dom";

const unitTabs = [
  { to: "unit-1", label: "UNITE-1" },
  { to: "unit-2", label: "UNITE-2" },
];

export function TablesPage() {
  return (
    <div className="page-stack">
      <div className="tables-layout">
        <aside className="unit-sidebar">
          <nav className="unit-tabs" aria-label="Ünite seçimi">
            {unitTabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `unit-tabs__link${isActive ? " is-active" : ""}`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="tables-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
