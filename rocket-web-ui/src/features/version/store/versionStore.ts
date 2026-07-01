import { create } from "zustand";
import type { VersiyonBilgisiUiModel } from "../models/versiyonBilgisiUiModel";

type VersionStore = {
  versiyonBilgisi?: VersiyonBilgisiUiModel;
  lastUpdateId?: number;
  setVersiyonBilgisi: (
    updateId: number,
    model: VersiyonBilgisiUiModel,
  ) => void;
};

export const useVersionStore = create<VersionStore>((set) => ({
  versiyonBilgisi: undefined,
  lastUpdateId: undefined,

  setVersiyonBilgisi: (updateId, model) =>
    set({
      versiyonBilgisi: model,
      lastUpdateId: updateId,
    }),
}));
