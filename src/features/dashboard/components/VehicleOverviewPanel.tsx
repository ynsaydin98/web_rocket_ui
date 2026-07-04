import { lazy, Suspense } from "react";
import { Panel } from "../../../shared/components/Panel";
import { useMKUItkiDiagnostikPaketStore } from "../../../store/mku/mkuItkiDiagnostikPaketStore";
import {
  useModelOffsetStore,
  type ModelOffsetEkseni,
} from "../store/modelOffsetStore";

const InteractiveRocketScene = lazy(() =>
  import("./InteractiveRocketScene").then((module) => ({
    default: module.InteractiveRocketScene,
  })),
);

const OFFSET_EKSENLERI: { eksen: ModelOffsetEkseni; etiket: string }[] = [
  { eksen: "pitch", etiket: "PITCH" },
  { eksen: "roll", etiket: "ROLL" },
  { eksen: "yaw", etiket: "YAW" },
];

export function VehicleOverviewPanel() {
  const ozet = useMKUItkiDiagnostikPaketStore((state) => state.ozet);
  const pitchOffset = useModelOffsetStore((state) => state.pitchOffset);
  const rollOffset = useModelOffsetStore((state) => state.rollOffset);
  const yawOffset = useModelOffsetStore((state) => state.yawOffset);
  const setOffset = useModelOffsetStore((state) => state.setOffset);

  const offsetDegerleri: Record<ModelOffsetEkseni, number> = {
    pitch: pitchOffset,
    roll: rollOffset,
    yaw: yawOffset,
  };

  return (
    <Panel
      title="3D GÖRÜNÜM & UÇUŞ İZİ"
      eyebrow="Araç"
      className="mission-panel vehicle-panel"
    >
      <div className="vehicle-stage">
        <div className="vehicle-stage__halo" />
        <Suspense
          fallback={
            <div className="vehicle-stage__loading">3D sahne hazırlanıyor</div>
          }
        >
          <InteractiveRocketScene
            pitch={ozet?.imu_pitch ?? 0}
            roll={ozet?.imu_roll ?? 0}
            yaw={ozet?.imu_yaw ?? 0}
            pitchOffset={pitchOffset}
            rollOffset={rollOffset}
            yawOffset={yawOffset}
          />
        </Suspense>
      </div>
      <div className="vehicle-offset-form">
        <span className="vehicle-offset-form__baslik">DURUŞ OFFSETİ (°)</span>
        {OFFSET_EKSENLERI.map(({ eksen, etiket }) => (
          <label key={eksen} className="vehicle-offset-form__alan">
            <span>{etiket}</span>
            <input
              type="number"
              step={1}
              value={offsetDegerleri[eksen]}
              onChange={(event) =>
                setOffset(eksen, event.target.valueAsNumber)
              }
            />
          </label>
        ))}
      </div>
    </Panel>
  );
}
