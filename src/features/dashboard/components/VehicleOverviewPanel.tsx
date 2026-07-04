import { lazy, Suspense } from "react";
import { Panel } from "../../../shared/components/Panel";

const InteractiveRocketScene = lazy(() =>
  import("./InteractiveRocketScene").then((module) => ({
    default: module.InteractiveRocketScene,
  })),
);

export function VehicleOverviewPanel() {
  return (
    <Panel
      title="3D GÖRÜNÜM & UÇUŞ İZİ"
      eyebrow="Araç"
      className="mission-panel vehicle-panel"
    >
      <div className="vehicle-stage">
        <div className="vehicle-stage__halo" />
        <div className="vehicle-stage__grid" />
        <div className="vehicle-callout vehicle-callout--alt">
          <span>İRTİFA</span>
          <strong>{"--"} m</strong>
        </div>
        <div className="vehicle-callout vehicle-callout--speed">
          <span>HIZ</span>
          <strong>{"--"} m/s</strong>
        </div>
        <Suspense
          fallback={
            <div className="vehicle-stage__loading">3D sahne hazırlanıyor</div>
          }
        >
          <InteractiveRocketScene />
        </Suspense>
        <span className="vehicle-stage__hint">
          Sürükle: döndür · Tekerlek: yakınlaştır
        </span>
      </div>
    </Panel>
  );
}
