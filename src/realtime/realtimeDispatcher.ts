import type { RealtimeMessageEnvelope } from "../contracts/realtimeMessageEnvelope";

export type RealtimeMessageHandler = (message: RealtimeMessageEnvelope) => void;

const handlers = new Map<string, RealtimeMessageHandler>();

export function registerRealtimeHandler(
  messageType: string,
  handler: RealtimeMessageHandler,
) {
  handlers.set(messageType, handler);
}

export function dispatchRealtimeMessage(message: RealtimeMessageEnvelope) {
  const handler = handlers.get(message.messageType);

  if (!handler) {
    console.warn("Bilinmeyen messageType:", message.messageType);
    return;
  }

  handler(message);
}
