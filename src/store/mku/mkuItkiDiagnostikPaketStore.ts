import { create } from "zustand";
import type { MKUItkiDiagnostikPaketUiModel } from "../../ui-models/mku/mkuItkiDiagnostikPaketUiModel";

type MKUItkiDiagnostikPaketStore = {
  ozet?: MKUItkiDiagnostikPaketUiModel;
  lastUpdateId?: number;
  setOzet: (updateId: number, model: MKUItkiDiagnostikPaketUiModel) => void;
};

export const useMKUItkiDiagnostikPaketStore =
  create<MKUItkiDiagnostikPaketStore>((set) => ({
    ozet: undefined,
    lastUpdateId: undefined,

    setOzet: (updateId, model) =>
      set({
        ozet: model,
        lastUpdateId: updateId,
      }),
  }));
