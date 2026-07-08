import { create } from "zustand";
import type { MKUItkiKomutaPaketUiModel } from "../../ui-models/mku/mkuItkiKomutaPaketUiModel";

type MKUItkiKomutaPaketStore = {
  ozet?: MKUItkiKomutaPaketUiModel;
  lastUpdateId?: number;
  setOzet: (updateId: number, model: MKUItkiKomutaPaketUiModel) => void;
};

export const useMKUItkiKomutaPaketStore = create<MKUItkiKomutaPaketStore>(
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
