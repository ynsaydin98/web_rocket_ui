import { appConfig } from "../app/appConfig";
import type { RealtimeMessageEnvelope } from "../contracts/realtimeMessageEnvelope";
import { ingestDebugRawMessage } from "../features/debug/services/debugMessagePublisher";
import { useConnectionStore } from "./connectionStore";
import { dispatchRealtimeMessage } from "./realtimeDispatcher";

let socket: WebSocket | null = null;
let reconnectTimer: number | undefined;
let shouldReconnect = false;

function clearReconnectTimer() {
  if (reconnectTimer === undefined) return;

  window.clearTimeout(reconnectTimer);
  reconnectTimer = undefined;
}

function scheduleReconnect(url: string) {
  if (!shouldReconnect) return;
  if (reconnectTimer !== undefined) return;

  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = undefined;
    connectWebSocket(url);
  }, appConfig.websocketReconnectDelayMs);
}

export function connectWebSocket(url = appConfig.websocketUrl) {
  shouldReconnect = true;

  if (
    socket?.readyState === WebSocket.OPEN ||
    socket?.readyState === WebSocket.CONNECTING ||
    socket?.readyState === WebSocket.CLOSING
  ) {
    return;
  }

  clearReconnectTimer();

  useConnectionStore.getState().setStatus("connecting");

  const nextSocket = new WebSocket(url);
  socket = nextSocket;

  nextSocket.onopen = () => {
    if (socket !== nextSocket) return;

    clearReconnectTimer();
    useConnectionStore.getState().setStatus("connected");
    console.log("WebSocket bağlantısı açıldı:", url);
  };

  nextSocket.onmessage = (event) => {
    if (socket !== nextSocket) return;

    const rawMessage = String(event.data);

    ingestDebugRawMessage(rawMessage);

    try {
      const message = JSON.parse(rawMessage) as RealtimeMessageEnvelope;
      dispatchRealtimeMessage(message);
    } catch (error) {
      console.error("WebSocket mesajı JSON olarak parse edilemedi:", error);
    }
  };

  nextSocket.onclose = () => {
    if (socket !== nextSocket) return;

    socket = null;
    useConnectionStore.getState().setStatus("disconnected");

    if (!shouldReconnect) {
      console.log("WebSocket bağlantısı bilinçli olarak kapatıldı.");
      return;
    }

    console.warn("WebSocket bağlantısı kapandı. Tekrar bağlanılacak.");
    scheduleReconnect(url);
  };

  nextSocket.onerror = () => {
    if (socket !== nextSocket) return;

    useConnectionStore.getState().setError("WebSocket bağlantı hatası oluştu.");
  };
}

export function disconnectWebSocket() {
  shouldReconnect = false;
  clearReconnectTimer();

  const activeSocket = socket;
  socket = null;

  if (
    activeSocket?.readyState === WebSocket.OPEN ||
    activeSocket?.readyState === WebSocket.CONNECTING
  ) {
    activeSocket.close();
  }

  useConnectionStore.getState().setStatus("disconnected");
}

export function getWebSocket() {
  return socket;
}

export function sendWebSocketMessage(message: unknown): boolean {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  socket.send(JSON.stringify(message));
  return true;
}
