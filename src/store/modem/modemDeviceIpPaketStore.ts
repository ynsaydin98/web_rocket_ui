import { create } from "zustand";
import { mapModemDeviceIpPaketToUiModel } from "../../mapper/modem/modemDeviceIpPaketMapper";
import type { ModemDeviceIpPaketUiModel } from "../../ui-models/modem/modemDeviceIpPaketUiModel";

/**
 * Hic paket gelmeden once kullanilacak model. device_ip bos oldugu icin
 * mapper eksik baytlari 0 ile tamamlar ve device_ip_ui "0.0.0.0" olur;
 * arayuz bu sayede bos deger yerine gecerli bir IP formati gosterir.
 * Veri gelip gelmedigini anlamak icin ozet degil lastUpdateId kontrol edilir.
 */
export const BOS_MODEM_DEVICE_IP_UI_MODEL: ModemDeviceIpPaketUiModel =
  mapModemDeviceIpPaketToUiModel({ device_ip: [] });

type ModemDeviceIpPaketStore = {
  ozet: ModemDeviceIpPaketUiModel;
  lastUpdateId?: number;
  setOzet: (updateId: number, model: ModemDeviceIpPaketUiModel) => void;
};

export const useModemDeviceIpPaketStore = create<ModemDeviceIpPaketStore>(
  (set) => ({
    ozet: BOS_MODEM_DEVICE_IP_UI_MODEL,
    lastUpdateId: undefined,

    setOzet: (updateId, model) =>
      set({
        ozet: model,
        lastUpdateId: updateId,
      }),
  }),
);
