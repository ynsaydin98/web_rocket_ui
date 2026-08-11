import type {
  VideoStreamFrame,
  VideoStreamInfoMessage,
} from "../protocol/videoStreamProtocol";
import {
  ingestVideoDecoderStatus,
  ingestVideoFrameDecoded,
  ingestVideoFrameDropped,
} from "./videoStreamUiPublisher";

/**
 * Sunucudan gelen Annex-B H.264 erisim birimlerini tarayicinin WebCodecs
 * `VideoDecoder` API'si ile cozer ve canvas'a cizer.
 *
 * Neden WebCodecs: MPEG-TS/H.264 akisi `<video>` etiketiyle dogrudan
 * oynatilamaz; MSE icin fMP4'e sarmalamak gerekir ve bu ek gecikme yaratir.
 * WebCodecs Annex-B veriyi dogrudan kabul eder, bu da yer istasyonu icin
 * en dusuk gecikmeli yoldur.
 *
 * Tum imperatif cizim mantigi burada tutulur; React bileseni yalnizca canvas
 * elemanini baglar.
 */

/**
 * Cozucu kuyrugu bu degeri asarsa gecikme birikiyor demektir; kuyruk
 * bosaltilip bir sonraki anahtar kareden devam edilir.
 */
const MAX_DECODE_QUEUE_SIZE = 12;

let decoder: VideoDecoder | null = null;
let streamInfo: VideoStreamInfoMessage | null = null;

let canvasElement: HTMLCanvasElement | null = null;
let canvasContext: CanvasRenderingContext2D | null = null;

let pendingFrame: VideoFrame | null = null;
let animationFrameId = 0;

let waitingForKeyFrame = true;

export function isVideoDecodingSupported() {
  return typeof window !== "undefined" && "VideoDecoder" in window;
}

/** Canvas React tarafindan monte edildiginde baglanir. */
export function attachVideoCanvas(element: HTMLCanvasElement) {
  canvasElement = element;
  canvasContext = element.getContext("2d");
}

export function detachVideoCanvas() {
  cancelScheduledDraw();
  closePendingFrame();

  canvasElement = null;
  canvasContext = null;
}

/**
 * `video-stream-info` mesaji geldiginde cozucuyu yapilandirir. Ayni akis
 * tanimi tekrar gelirse cozucu yeniden kurulmaz.
 */
export function configureVideoDecoder(info: VideoStreamInfoMessage) {
  if (!isVideoDecodingSupported()) {
    ingestVideoDecoderStatus(
      "unsupported",
      "Tarayici WebCodecs (VideoDecoder) desteklemiyor. Chrome/Edge 94+ gerekir.",
    );
    return;
  }

  const isSameStream =
    streamInfo?.codec === info.codec &&
    streamInfo?.width === info.width &&
    streamInfo?.height === info.height;

  if (isSameStream && decoder?.state === "configured") return;

  streamInfo = info;

  closeDecoder();

  try {
    const nextDecoder = new VideoDecoder({
      output: handleDecodedFrame,
      error: handleDecoderError,
    });

    // Annex-B akista `description` verilmez; SPS/PPS veri icinde tasinir.
    nextDecoder.configure({
      codec: info.codec,
      optimizeForLatency: true,
    });

    decoder = nextDecoder;
    waitingForKeyFrame = true;

    ingestVideoDecoderStatus("waiting-key-frame");
  } catch (error) {
    decoder = null;
    ingestVideoDecoderStatus(
      "error",
      `Video cozucu yapilandirilamadi: ${describeError(error)}`,
    );
  }
}

/** Ikili kanaldan gelen her erisim birimi icin cagrilir. */
export function submitVideoFrame(frame: VideoStreamFrame) {
  if (!isVideoDecodingSupported()) return;

  if (decoder === null) {
    // Cozucu hata sonrasi kapandiysa ilk anahtar karede kendini toparlar.
    if (streamInfo === null) {
      ingestVideoDecoderStatus("waiting-stream-info");
      return;
    }

    if (!frame.isKeyFrame) return;

    configureVideoDecoder(streamInfo);

    if (decoder === null) return;
  }

  const activeDecoder = decoder;

  if (activeDecoder.state !== "configured") return;

  if (waitingForKeyFrame) {
    if (!frame.isKeyFrame) {
      ingestVideoFrameDropped();
      return;
    }

    waitingForKeyFrame = false;
  }

  // Kuyruk buyuduyse gecikme birikiyor demektir; guncel goruntu eskisinden
  // daha degerli oldugu icin bir sonraki anahtar kareye atlanir.
  if (activeDecoder.decodeQueueSize > MAX_DECODE_QUEUE_SIZE) {
    waitingForKeyFrame = true;
    ingestVideoFrameDropped();
    return;
  }

  try {
    activeDecoder.decode(
      new EncodedVideoChunk({
        type: frame.isKeyFrame ? "key" : "delta",
        timestamp: frame.timestampMicroseconds,
        data: frame.data,
      }),
    );
  } catch (error) {
    ingestVideoFrameDropped();
    handleDecoderError(error);
  }
}

/** Baglanti koptugunda veya sayfa kapandiginda cagrilir. */
export function resetVideoDecoder() {
  cancelScheduledDraw();
  closePendingFrame();
  closeDecoder();

  streamInfo = null;
  waitingForKeyFrame = true;

  ingestVideoDecoderStatus("idle");
}

/** Akis kesildiginde cozucuyu bir sonraki anahtar kareye senkronlar. */
export function requireKeyFrame() {
  waitingForKeyFrame = true;
}

function handleDecodedFrame(frame: VideoFrame) {
  ingestVideoFrameDecoded();
  ingestVideoDecoderStatus("decoding");

  if (canvasContext === null) {
    frame.close();
    return;
  }

  // En guncel kare kazanir: rAF arasinda birden fazla kare cozulurse
  // eskisi atilir, boylece gecikme birikmez.
  closePendingFrame();
  pendingFrame = frame;

  scheduleDraw();
}

function handleDecoderError(error: unknown) {
  closeDecoder();
  waitingForKeyFrame = true;

  ingestVideoDecoderStatus(
    "error",
    `Video cozme hatasi: ${describeError(error)}`,
  );
}

function scheduleDraw() {
  if (animationFrameId !== 0) return;

  animationFrameId = window.requestAnimationFrame(drawPendingFrame);
}

function cancelScheduledDraw() {
  if (animationFrameId === 0) return;

  window.cancelAnimationFrame(animationFrameId);
  animationFrameId = 0;
}

function drawPendingFrame() {
  animationFrameId = 0;

  const frame = pendingFrame;
  pendingFrame = null;

  if (frame === null) return;

  if (canvasElement !== null && canvasContext !== null) {
    if (canvasElement.width !== frame.displayWidth) {
      canvasElement.width = frame.displayWidth;
    }

    if (canvasElement.height !== frame.displayHeight) {
      canvasElement.height = frame.displayHeight;
    }

    canvasContext.drawImage(frame, 0, 0);
  }

  frame.close();
}

function closePendingFrame() {
  if (pendingFrame === null) return;

  pendingFrame.close();
  pendingFrame = null;
}

function closeDecoder() {
  if (decoder === null) return;

  try {
    if (decoder.state !== "closed") {
      decoder.close();
    }
  } catch {
    // Hataya dusmus cozucunun kapatilmasi da hata verebilir; yok sayilir.
  }

  decoder = null;
}

function describeError(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
