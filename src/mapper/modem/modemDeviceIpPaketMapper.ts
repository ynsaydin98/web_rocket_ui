import type { ModemDeviceIpPaket } from "../../paketler/modem/modemDeviceIpPaket";
import type { ModemDeviceIpPaketUiModel } from "../../ui-models/modem/modemDeviceIpPaketUiModel";

export function mapModemDeviceIpPaketToUiModel(
  paket: ModemDeviceIpPaket,
): ModemDeviceIpPaketUiModel {
  return {
    device_ip: paket.device_ip,

    device_ip_ui: [...paket.device_ip, 0, 0, 0, 0].slice(0, 4).join("."),
  };
}
