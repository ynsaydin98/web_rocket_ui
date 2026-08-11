import type {
  VideoConnectionStatus,
  VideoDecoderStatus,
  VideoStreamUiModel,
} from "../models/videoStreamUiModel";
import type { VideoStreamInfoMessage } from "../protocol/videoStreamProtocol";
import { useVideoStreamStore } from "../store/videoStreamStore";

/**
 * Video kareleri saniyede ~30 adet gelir; her kare icin React render
 * tetiklenmemesi gerekir. Bu servis sayaclari bellekte biriktirir ve store'u
 * yalnizca sabit araliklarla gunceller.
 */

type MutableState = {
  connectionStatus: VideoConnectionStatus;
  decoderStatus: VideoDecoderStatus;
  receiving: boolean;
  codec?: string;
  width?: number;
  height?: number;
  receivedFrameCount: number;
  decodedFrameCount: number;
  keyFrameCount: number;
  droppedFrameCount: number;
  errorMessage?: string;
  statusMessage?: string;
};

function createInitialState(): MutableState {
  return {
    connectionStatus: "idle",
    decoderStatus: "idle",
    receiving: false,
    receivedFrameCount: 0,
    decodedFrameCount: 0,
    keyFrameCount: 0,
    droppedFrameCount: 0,
  };
}

let state = createInitialState();

/** Yayin penceresi icinde biriken degerler; her yayindan sonra sifirlanir. */
let windowDecodedFrameCount = 0;
let windowByteCount = 0;
let windowStartedAtMs = 0;

let lastFrameAtMs: number | undefined;
let lastPublishedFps = 0;

let dirty = true;
let publishedVersion = 0;
let timerId: number | undefined;

function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

export function ingestVideoConnectionStatus(
  connectionStatus: VideoConnectionStatus,
  errorMessage?: string,
) {
  state.connectionStatus = connectionStatus;
  state.errorMessage = errorMessage;

  if (connectionStatus !== "connected") {
    state.receiving = false;
  }

  dirty = true;
}

export function ingestVideoDecoderStatus(
  decoderStatus: VideoDecoderStatus,
  errorMessage?: string,
) {
  state.decoderStatus = decoderStatus;

  if (errorMessage !== undefined) {
    state.errorMessage = errorMessage;
  }

  dirty = true;
}

export function ingestVideoStreamInfo(info: VideoStreamInfoMessage) {
  state.codec = info.codec;
  state.width = info.width;
  state.height = info.height;
  dirty = true;
}

export function ingestVideoStreamStatus(receiving: boolean, message: string) {
  state.receiving = receiving;
  state.statusMessage = message;
  dirty = true;
}

export function ingestVideoFrameReceived(byteLength: number, isKeyFrame: boolean) {
  state.receivedFrameCount += 1;

  if (isKeyFrame) {
    state.keyFrameCount += 1;
  }

  windowByteCount += byteLength;
  lastFrameAtMs = now();
}

export function ingestVideoFrameDecoded() {
  state.decodedFrameCount += 1;
  windowDecodedFrameCount += 1;
}

export function ingestVideoFrameDropped() {
  state.droppedFrameCount += 1;
}

export function startVideoStreamUiPublisher(intervalMs = 1000) {
  if (timerId !== undefined) return;

  const safeIntervalMs =
    Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 1000;

  windowStartedAtMs = now();

  timerId = window.setInterval(() => {
    const elapsedMs = Math.max(now() - windowStartedAtMs, 1);

    const fps = (windowDecodedFrameCount * 1000) / elapsedMs;
    const kilobitsPerSecond = (windowByteCount * 8) / elapsedMs;

    const hasActivity = windowDecodedFrameCount > 0 || windowByteCount > 0;

    windowDecodedFrameCount = 0;
    windowByteCount = 0;
    windowStartedAtMs = now();

    // Akis dururken de fps'in bir kez sifirlanmasi gerekir; onun disinda
    // degisiklik yoksa store'a dokunulmaz.
    if (!dirty && !hasActivity && lastPublishedFps === 0) return;

    dirty = false;
    lastPublishedFps = fps;
    publishedVersion += 1;

    useVideoStreamStore
      .getState()
      .setOzet(publishedVersion, createUiModel(fps, kilobitsPerSecond));
  }, safeIntervalMs);
}

export function stopVideoStreamUiPublisher() {
  if (timerId === undefined) return;

  window.clearInterval(timerId);
  timerId = undefined;
}

export function resetVideoStreamStats() {
  state = createInitialState();
  windowDecodedFrameCount = 0;
  windowByteCount = 0;
  windowStartedAtMs = now();
  lastFrameAtMs = undefined;
  lastPublishedFps = 0;
  dirty = true;
  publishedVersion = 0;

  useVideoStreamStore.getState().reset();
}

function createUiModel(
  fps: number,
  kilobitsPerSecond: number,
): VideoStreamUiModel {
  return {
    connectionStatus: state.connectionStatus,
    decoderStatus: state.decoderStatus,
    receiving: state.receiving,
    codec: state.codec,
    width: state.width,
    height: state.height,
    fps: Math.round(fps * 10) / 10,
    kilobitsPerSecond: Math.round(kilobitsPerSecond),
    receivedFrameCount: state.receivedFrameCount,
    decodedFrameCount: state.decodedFrameCount,
    keyFrameCount: state.keyFrameCount,
    droppedFrameCount: state.droppedFrameCount,
    lastFrameAgeMs:
      lastFrameAtMs === undefined ? undefined : Math.round(now() - lastFrameAtMs),
    errorMessage: state.errorMessage,
    statusMessage: state.statusMessage,
  };
}
