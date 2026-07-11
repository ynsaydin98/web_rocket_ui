import { create } from "zustand";
import type { MKUEepromPaketUiModel } from "../../ui-models/mku/mkuEepromPaketUiModel";

type MKUEepromPaketStore = {
  ozet?: MKUEepromPaketUiModel;
  lastUpdateId?: number;
  setOzet: (updateId: number, model: MKUEepromPaketUiModel) => void;
};

export const useMKUEepromPaketStore = create<MKUEepromPaketStore>((set) => ({
  ozet: undefined,
  lastUpdateId: undefined,

  setOzet: (updateId, model) =>
    set({
      ozet: model,
      lastUpdateId: updateId,
    }),
}));
