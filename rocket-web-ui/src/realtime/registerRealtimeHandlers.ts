import { registerGnssHandler } from "./handlers/gnssHandler";
import { registerRoketTelemetriHandler } from "./handlers/roketTelemetriHandler";
import { registerVersionHandler } from "./handlers/versionHandler";

let registered = false;

export function registerRealtimeHandlers() {
  if (registered) return;

  registerRoketTelemetriHandler();
  registerGnssHandler();
  registerVersionHandler();

  registered = true;
}
