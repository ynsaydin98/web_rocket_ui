import { NavLink } from "react-router-dom";
const tabs = [
  { to: "/", label: "Ana Sayfa", end: true },
  { to: "/grafik", label: "Grafikler", end: false },
  { to: "/tables", label: "Tablolar", end: false },
  { to: "/commands", label: "Komut & Sekans", end: false },
  { to: "/gostergeler", label: "Göstergeler", end: false },
  { to: "/flight-termination", label: "Uçuş Sonlandırma", end: false },
  { to: "/debug", label: "Hata Ayıklama", end: false },
];
export function PageTabs() {
  return (
    <nav className="page-tabs" aria-label="Ana navigasyon">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `page-tabs__link${isActive ? " is-active" : ""}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
