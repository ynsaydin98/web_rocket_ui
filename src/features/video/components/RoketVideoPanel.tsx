import { useEffect, useRef } from "react";
import { Panel } from "../../../shared/components/Panel";
import {
  StatusBadge,
  type StatusTone,
} from "../../../shared/components/StatusBadge";
import type {
  VideoConnectionStatus,
  VideoDecoderStatus,
} from "../models/videoStreamUiModel";
import {
  attachVideoCanvas,
  detachVideoCanvas,
} from "../services/videoDecoderService";
import {
  connectVideoWebSocket,
  disconnectVideoWebSocket,
} from "../services/videoWebSocketClient";
import { useVideoStreamStore } from "../store/videoStreamStore";

const connectionTones = {
  idle: "neutral",
  connecting: "warning",
  connected: "success",
  disconnected: "danger",
  error: "danger",
} satisfies Record<VideoConnectionStatus, StatusTone>;

const connectionLabels = {
  idle: "BEKLEMEDE",
  connecting: "BAĞLANIYOR",
  connected: "BAĞLI",
  disconnected: "KOPUK",
  error: "HATA",
} satisfies Record<VideoConnectionStatus, string>;

const decoderTones = {
  idle: "neutral",
  unsupported: "danger",
  "waiting-stream-info": "warning",
  "waiting-key-frame": "warning",
  decoding: "success",
  error: "danger",
} satisfies Record<VideoDecoderStatus, StatusTone>;

const decoderLabels = {
  idle: "ÇÖZÜCÜ HAZIR DEĞİL",
  unsupported: "TARAYICI DESTEKLEMİYOR",
  "waiting-stream-info": "AKIŞ TANIMI BEKLENİYOR",
  "waiting-key-frame": "ANAHTAR KARE BEKLENİYOR",
  decoding: "GÖRÜNTÜ ÇÖZÜLÜYOR",
  error: "ÇÖZME HATASI",
} satisfies Record<VideoDecoderStatus, string>;

function formatResolution(width?: number, height?: number) {
  if (!width || !height) return "—";
  return `${width}x${height}`;
}

/**
 * Roket kamerasinin canli goruntusu. Cizim WebCodecs cozucusu tarafindan
 * dogrudan canvas'a yapilir; bilesen yalnizca canvas'i baglar ve store'daki
 * hazir ozet degerleri gosterir.
 */
export function RoketVideoPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ozet = useVideoStreamStore((state) => state.ozet);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) return;

    attachVideoCanvas(canvas);

    return () => {
      detachVideoCanvas();
    };
  }, []);

  const hasPicture = ozet.decoderStatus === "decoding" && ozet.receiving;

  // Yayin kapaliyken cozucu calismaz; operator gerek duymadiginda islemci
  // yukunu ve bant genisligini birakabilir.
  const isStreamStopped =
    ozet.connectionStatus === "idle" || ozet.connectionStatus === "disconnected";

  return (
    <Panel
      title="Roket Kamera Yayını"
      eyebrow="S-Band Video"
      action={
        <div className="video-panel__badges">
          <StatusBadge tone={connectionTones[ozet.connectionStatus]}>
            {connectionLabels[ozet.connectionStatus]}
          </StatusBadge>
          <StatusBadge tone={decoderTones[ozet.decoderStatus]}>
            {decoderLabels[ozet.decoderStatus]}
          </StatusBadge>
          <button
            type="button"
            className={`button${isStreamStopped ? "" : " button--quiet"}`}
            onClick={() =>
              isStreamStopped
                ? connectVideoWebSocket()
                : disconnectVideoWebSocket()
            }
          >
            {isStreamStopped ? "Yayını Başlat" : "Yayını Durdur"}
          </button>
        </div>
      }
    >
      <div className="video-stage">
        <canvas
          ref={canvasRef}
          className={`video-stage__canvas${hasPicture ? " is-live" : ""}`}
        />
        {!hasPicture && (
          <div className="video-stage__overlay">
            <span className="video-stage__overlay-title">GÖRÜNTÜ YOK</span>
            <span className="video-stage__overlay-detail">
              {ozet.errorMessage ??
                ozet.statusMessage ??
                decoderLabels[ozet.decoderStatus]}
            </span>
          </div>
        )}
      </div>

      <div className="data-strip data-strip--five video-stage__stats">
        <div className="data-point">
          <span>ÇÖZÜNÜRLÜK</span>
          <strong>{formatResolution(ozet.width, ozet.height)}</strong>
          <small>{ozet.codec ?? "codec bilinmiyor"}</small>
        </div>
        <div className="data-point">
          <span>KARE HIZI</span>
          <strong>{ozet.fps.toFixed(1)}</strong>
          <small>fps</small>
        </div>
        <div className="data-point">
          <span>BİT HIZI</span>
          <strong>{ozet.kilobitsPerSecond}</strong>
          <small>kbit/s</small>
        </div>
        <div className="data-point">
          <span>ALINAN KARE</span>
          <strong>{ozet.receivedFrameCount}</strong>
          <small>{ozet.keyFrameCount} anahtar kare</small>
        </div>
        <div className="data-point">
          <span>ATILAN KARE</span>
          <strong>{ozet.droppedFrameCount}</strong>
          <small>
            {ozet.lastFrameAgeMs === undefined
              ? "kare yok"
              : `son kare ${ozet.lastFrameAgeMs} ms`}
          </small>
        </div>
      </div>

      {ozet.errorMessage && <p className="error-copy">{ozet.errorMessage}</p>}
    </Panel>
  );
}
