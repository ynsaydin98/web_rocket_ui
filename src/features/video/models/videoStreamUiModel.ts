/** Video kanalinin baglanti durumu. */
export type VideoConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

/** Tarayici WebCodecs H.264 cozucusunun durumu. */
export type VideoDecoderStatus =
  | "idle"
  | "unsupported"
  | "waiting-stream-info"
  | "waiting-key-frame"
  | "decoding"
  | "error";

/** Arayuzde gosterilen video akis ozeti. */
export type VideoStreamUiModel = {
  connectionStatus: VideoConnectionStatus;
  decoderStatus: VideoDecoderStatus;

  /** Sunucu UDP portundan veri aliyor mu. */
  receiving: boolean;

  codec?: string;
  width?: number;
  height?: number;

  /** Saniyede cozulen kare sayisi. */
  fps: number;
  /** Alinan video verisinin bit hizi (kbit/s). */
  kilobitsPerSecond: number;

  receivedFrameCount: number;
  decodedFrameCount: number;
  keyFrameCount: number;
  /** Bozuk baslik veya cozme hatasi nedeniyle atilan kare sayisi. */
  droppedFrameCount: number;

  /** Son kareden bu yana gecen sure (ms). Hic kare gelmediyse tanimsiz. */
  lastFrameAgeMs?: number;

  errorMessage?: string;
  statusMessage?: string;
};

export const BOS_VIDEO_STREAM_UI_MODEL: VideoStreamUiModel = {
  connectionStatus: "idle",
  decoderStatus: "idle",
  receiving: false,
  fps: 0,
  kilobitsPerSecond: 0,
  receivedFrameCount: 0,
  decodedFrameCount: 0,
  keyFrameCount: 0,
  droppedFrameCount: 0,
};
