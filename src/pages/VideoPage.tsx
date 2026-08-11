import { RoketVideoPanel } from "../features/video/components/RoketVideoPanel";

export function VideoPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Görüntü Aktarımı</p>
          <h2>Roket Kamera Yayını</h2>
        </div>
      </header>
      <RoketVideoPanel />
    </div>
  );
}
