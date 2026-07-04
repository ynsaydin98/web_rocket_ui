import { create } from "zustand";
import { persist } from "zustand/middleware";
import { appConfig } from "../../../app/appConfig";

export type ModelOffsetEkseni = "pitch" | "roll" | "yaw";

type ModelOffsetStore = {
  /** 3D roket modelinin duruş düzeltmesi (derece). IMU değerleri bu offsetlerin üzerine eklenir. */
  pitchOffset: number;
  rollOffset: number;
  yawOffset: number;
  setOffset: (eksen: ModelOffsetEkseni, deger: number) => void;
};

/**
 * Kullanıcının panelden girdiği model duruş offsetleri. localStorage'da
 * saklanır; ilk açılışta .env'deki VITE_MODEL_*_OFFSET değerleri
 * varsayılan olarak kullanılır.
 */
export const useModelOffsetStore = create<ModelOffsetStore>()(
  persist(
    (set) => ({
      pitchOffset: appConfig.modelPitchOffset ?? 0,
      rollOffset: appConfig.modelRollOffset ?? 0,
      yawOffset: appConfig.modelYawOffset ?? 0,

      setOffset: (eksen, deger) =>
        set(() => {
          const guvenliDeger = Number.isFinite(deger) ? deger : 0;
          if (eksen === "pitch") return { pitchOffset: guvenliDeger };
          if (eksen === "roll") return { rollOffset: guvenliDeger };
          return { yawOffset: guvenliDeger };
        }),
    }),
    { name: "model-offsetleri" },
  ),
);
