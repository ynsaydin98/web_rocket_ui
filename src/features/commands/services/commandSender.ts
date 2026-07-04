import type { CommandEnvelope } from "../../../contracts/commandEnvelope";
import { sendWebSocketMessage } from "../../../realtime/websocketClient";
import { useCommandStore } from "../store/commandStore";

export function sendCommand<TPayload>(
  command: CommandEnvelope<TPayload>,
): boolean {
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
