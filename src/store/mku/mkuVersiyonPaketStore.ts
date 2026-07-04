import { create } from "zustand";
import type { MKUVersiyonPaketUiModel } from "../../ui-models/mku/mkuVersiyonPaketUiModel";

type MKUVersiyonPaketStore = {
  ozet?: MKUVersiyonPaketUiModel;
  lastUpdateId?: number;
  setOzet: (updateId: number, model: MKUVersiyonPaketUiModel) => void;
};

export const useMKUVersiyonPaketStore = create<MKUVersiyonPaketStore>(
  (set) => ({
    ozet: undefined,
    lastUpdateId: undefined,

    setOzet: (updateId, model) =>
      set({
        ozet: model,
        lastUpdateId: updateId,
      }),
  }),
);
