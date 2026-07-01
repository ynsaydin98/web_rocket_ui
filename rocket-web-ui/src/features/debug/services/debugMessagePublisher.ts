import { useDebugStore } from "../store/debugStore";

type DebugMessagePublisherOptions = {
  intervalMs?: number;
  rawMessageLimit?: number;
};

let pendingRawMessages: string[] = [];
let timerId: number | undefined;
let messageLimit = 100;

export function ingestDebugRawMessage(message: string) {
  pendingRawMessages.unshift(message);

  if (pendingRawMessages.length > messageLimit) {
    pendingRawMessages.length = messageLimit;
  }
}

export function startDebugMessagePublisher(
  options: DebugMessagePublisherOptions = {},
) {
  if (timerId !== undefined) return;

  const intervalMs =
    Number.isFinite(options.intervalMs) && options.intervalMs! > 0
      ? options.intervalMs!
      : 500;

  messageLimit =
    Number.isFinite(options.rawMessageLimit) && options.rawMessageLimit! > 0
      ? options.rawMessageLimit!
      : 100;

  timerId = window.setInterval(() => {
    if (pendingRawMessages.length === 0) return;

    const messagesToPublish = pendingRawMessages;
    pendingRawMessages = [];

    useDebugStore.getState().addRawMessages(messagesToPublish, messageLimit);
  }, intervalMs);
}

export function stopDebugMessagePublisher() {
  if (timerId === undefined) return;

  window.clearInterval(timerId);
  timerId = undefined;
}

export function clearDebugMessages() {
  pendingRawMessages = [];
  useDebugStore.getState().clearRawMessages();
}
