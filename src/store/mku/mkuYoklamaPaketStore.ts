import { create } from "zustand";
import type { MKUYoklamaPaketUiModel } from "../../ui-models/mku/mkuYoklamaPaketUiModel";

type MKUYoklamaPaketStore = {
  ozet?: MKUYoklamaPaketUiModel;
  lastUpdateId?: number;
  setOzet: (updateId: number, model: MKUYoklamaPaketUiModel) => void;
};

export const useMKUYoklamaPaketStore = create<MKUYoklamaPaketStore>((set) => ({
  ozet: undefined,
  lastUpdateId: undefined,

  setOzet: (updateId, model) =>
    set({
      ozet: model,
      lastUpdateId: updateId,
    }),
}));
