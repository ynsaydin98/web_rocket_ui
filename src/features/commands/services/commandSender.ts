import type { CommandEnvelope } from "../../../contracts/commandEnvelope";
import { useAdminSessionStore } from "../../debug/store/adminSessionStore";
import { sendWebSocketMessage } from "../../../realtime/websocketClient";
import { useCommandStore } from "../store/commandStore";

export function sendCommand<TPayload>(
  command: CommandEnvelope<TPayload>,
): boolean {
  if (!useAdminSessionStore.getState().isAdmin) {
    useCommandStore
      .getState()
      .setCommandError("Admin yetkisi olmadigi icin komut gonderilemedi.");

    return false;
  }

  const sent = sendWebSocketMessage(command);

  if (!sent) {
    useCommandStore
      .getState()
      .setCommandError(
        "WebSocket bağlantısı açık olmadığı için komut gönderilemedi.",
      );

    return false;
  }

  useCommandStore.getState().setCommandSent(command);

  return true;
}
