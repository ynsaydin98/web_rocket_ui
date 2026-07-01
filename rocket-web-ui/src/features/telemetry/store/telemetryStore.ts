import { create } from "zustand";
import type { RoketOzetUiModel } from "../models/roketOzetUiModel";

type TelemetryStore = {
  roketOzet?: RoketOzetUiModel;
  lastUpdateId?: number;
  setRoketOzet: (updateId: number, model: RoketOzetUiModel) => void;
};

export const useTelemetryStore = create<TelemetryStore>((set) => ({
  roketOzet: undefined,
  lastUpdateId: undefined,

  setRoketOzet: (updateId, model) =>
    set({
      roketOzet: model,
      lastUpdateId: updateId,
    }),
}));
