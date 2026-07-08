import { registerMKUItkiDiagnostikPaketHandler } from "./handlers/mku/mkuItkiDiagnostikPaketHandler";
import { registerMKUItkiKomutaPaketHandler } from "./handlers/mku/mkuItkiKomutaPaketHandler";
import { registerMKUVersiyonPaketHandler } from "./handlers/mku/mkuVersiyonPaketHandler";
import { registerMKUYoklamaPaketHandler } from "./handlers/mku/mkuYoklamaPaketHandler";

let registered = false;

export function registerRealtimeHandlers() {
  if (registered) return;

  //#region MKU
  registerMKUItkiDiagnostikPaketHandler();
  registerMKUVersiyonPaketHandler();
  registerMKUYoklamaPaketHandler();
  registerMKUItkiKomutaPaketHandler();
  //#endregion

  registered = true;
}
