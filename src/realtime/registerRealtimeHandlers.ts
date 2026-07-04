import { registerMKUItkiDiagnostikPaketHandler } from "./handlers/mku/mkuItkiDiagnostikPaketHandler";
import { registerMKUVersiyonPaketHandler } from "./handlers/mku/mkuVersiyonPaketHandler";
import { registerMKUYoklamaPaketHandler } from "./handlers/mku/mkuYoklamaPaketHandler";

let registered = false;

export function registerRealtimeHandlers() {
  if (registered) return;

  //#region MKU
  registerMKUItkiDiagnostikPaketHandler();
  registerMKUVersiyonPaketHandler();
  registerMKUYoklamaPaketHandler();
  //#endregion

  registered = true;
}
