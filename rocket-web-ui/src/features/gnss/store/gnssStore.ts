import { create } from "zustand";
import type { GnssOzetUiModel } from "../models/gnssOzetUiModel";

type GnssStore = {
  gnssOzet?: GnssOzetUiModel;
  lastUpdateId?: number;
  setGnssOzet: (updateId: number, model: GnssOzetUiModel) => void;
};

export const useGnssStore = create<GnssStore>((set) => ({
  gnssOzet: undefined,
  lastUpdateId: undefined,

  setGnssOzet: (updateId, model) =>
    set({
      gnssOzet: model,
      lastUpdateId: updateId,
    }),
}));
