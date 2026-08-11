import { appConfig } from "../../../app/appConfig";
import {
  decodeVideoFrame,
  decodeVideoTextMessage,
  VideoStreamMessageTypes,
} from "../protocol/videoStreamProtocol";
import {
  configureVideoDecoder,
  isVideoDecodingSupported,
  requireKeyFrame,
  resetVideoDecoder,
  submitVideoFrame,
} from "./videoDecoderService";
import {
  ingestVideoConnectionStatus,
  ingestVideoDecoderStatus,
  ingestVideoFrameReceived,
  ingestVideoStreamInfo,
  ingestVideoStreamStatus,
} from "./videoStreamUiPublisher";

/**
 * Video akisi icin ayri WebSocket istemcisi.
 *
 * Telemetri soketi (`src/realtime/websocketClient.ts`) JSON metin mesajlari
 * tasir ve degistirilmez. Video ~3 Mbit/s ikili veri oldugundan kendi
 * baglantisini kullanir; boylece yuksek hacimli video kareleri telemetri ve
 * komut mesajlarini geciktirmez.
 */

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
    connectVideoWebSocket(url);
  }, appConfig.websocketReconnectDelayMs);
}

export function connectVideoWebSocket(url = appConfig.videoWebsocketUrl) {
  shouldReconnect = true;

  if (
    socket?.readyState === WebSocket.OPEN ||
    socket?.readyState === WebSocket.CONNECTING ||
    socket?.readyState === WebSocket.CLOSING
  ) {
    return;
  }

  clearReconnectTimer();

  if (!isVideoDecodingSupported()) {
    ingestVideoDecoderStatus(
      "unsupported",
      "Tarayici WebCodecs (VideoDecoder) desteklemiyor. Chrome/Edge 94+ gerekir.",
    );
  }

  ingestVideoConnectionStatus("connecting");

  const nextSocket = new WebSocket(url);
  nextSocket.binaryType = "arraybuffer";
  socket = nextSocket;

  nextSocket.onopen = () => {
    if (socket !== nextSocket) return;

    clearReconnectTimer();
    ingestVideoConnectionStatus("connected");
    ingestVideoDecoderStatus("waiting-stream-info");
    console.log("Video WebSocket bağlantısı açıldı:", url);
  };

  nextSocket.onmessage = (event) => {
    if (socket !== nextSocket) return;

    if (typeof event.data === "string") {
      handleTextMessage(event.data);
      return;
    }

    handleBinaryMessage(event.data as ArrayBuffer);
  };

  nextSocket.onclose = () => {
    if (socket !== nextSocket) return;

    socket = null;
    resetVideoDecoder();
    ingestVideoConnectionStatus("disconnected");

    if (!shouldReconnect) {
      console.log("Video WebSocket bağlantısı bilinçli olarak kapatıldı.");
      return;
    }

    console.warn("Video WebSocket bağlantısı kapandı. Tekrar bağlanılacak.");
    scheduleReconnect(url);
  };

  nextSocket.onerror = () => {
    if (socket !== nextSocket) return;

    ingestVideoConnectionStatus("error", "Video WebSocket bağlantı hatası oluştu.");
  };
}

export function disconnectVideoWebSocket() {
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

  resetVideoDecoder();
  ingestVideoConnectionStatus("disconnected");
}

function handleTextMessage(rawMessage: string) {
  const message = decodeVideoTextMessage(rawMessage);

  if (message === null) return;

  if (message.type === VideoStreamMessageTypes.StreamInfo) {
    ingestVideoStreamInfo(message);
    configureVideoDecoder(message);
    return;
  }

  ingestVideoStreamStatus(message.receiving, message.message);

  if (!message.receiving) {
    // Akis kesildi; yeniden basladiginda ilk anahtar kareden devam edilir.
    requireKeyFrame();
  }
}

function handleBinaryMessage(buffer: ArrayBuffer) {
  const frame = decodeVideoFrame(buffer);

  if (frame === null) {
    console.warn("Geçersiz video karesi başlığı, kare atlandı.");
    return;
  }

  ingestVideoFrameReceived(frame.data.byteLength, frame.isKeyFrame);
  submitVideoFrame(frame);
}
