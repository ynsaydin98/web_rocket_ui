/**
 * Video WebSocket kanalinin sozlesmesi.
 *
 * Telemetri kanalindaki `RealtimeMessageEnvelope` JSON zarfi degismez; video
 * yuksek bant genisligi gerektirdigi icin ayri bir soket ve base64 icermeyen
 * ikili format kullanir.
 *
 * Sunucu tarafi FERGANI_HAM2VERI_SERVIS icindeki video alt sistemidir; bu
 * dosyadaki baslik duzeni oradaki `VideoStreamProtocol` sinifi ile birebir
 * ayni olmalidir. Cozumleme (MPEG-TS demux, kare siniflandirma, SPS cozme)
 * tamamen serviste yapilir; arayuz yalnizca cizer.
 */

/** Ikili kare basligi: 20 bayt, little-endian. */
export const VIDEO_FRAME_HEADER_SIZE = 20;

/** "RVS1" = Roket Video Stream v1. */
const VIDEO_FRAME_MAGIC = [0x52, 0x56, 0x53, 0x31] as const;

const FRAME_TYPE_KEY = 1;
const FLAG_PARAMETER_SETS = 0b0000_0001;

/** Sunucudan gelen JSON metin mesaj tipleri. */
export const VideoStreamMessageTypes = {
  StreamInfo: "video-stream-info",
  StreamStatus: "video-stream-status",
} as const;

export type VideoStreamInfoMessage = {
  type: typeof VideoStreamMessageTypes.StreamInfo;
  /** WebCodecs codec dizgisi, ornek: "avc1.42E01E". */
  codec: string;
  width: number;
  height: number;
  /** Annex-B akista decoder `description` alani olmadan yapilandirilir. */
  annexB: boolean;
};

export type VideoStreamStatusMessage = {
  type: typeof VideoStreamMessageTypes.StreamStatus;
  receiving: boolean;
  message: string;
};

export type VideoStreamTextMessage =
  | VideoStreamInfoMessage
  | VideoStreamStatusMessage;

/** Cozulmus ikili video karesi. */
export type VideoStreamFrame = {
  /** Annex-B H.264 erisim birimi. */
  data: Uint8Array;
  /** WebCodecs `EncodedVideoChunk` icin mikrosaniye cinsinden PTS. */
  timestampMicroseconds: number;
  isKeyFrame: boolean;
  containsParameterSets: boolean;
};

/**
 * Ikili WebSocket cercevesini cozer. Baslik gecersizse `null` doner; bozuk
 * cerceve akisi durdurmamalidir.
 */
export function decodeVideoFrame(buffer: ArrayBuffer): VideoStreamFrame | null {
  if (buffer.byteLength < VIDEO_FRAME_HEADER_SIZE) return null;

  const view = new DataView(buffer);

  for (let index = 0; index < VIDEO_FRAME_MAGIC.length; index += 1) {
    if (view.getUint8(index) !== VIDEO_FRAME_MAGIC[index]) return null;
  }

  const frameType = view.getUint8(4);
  const flags = view.getUint8(5);

  // PTS mikrosaniye olarak int64 gelir; Number.MAX_SAFE_INTEGER'a kadar olan
  // degerler kayipsiz temsil edilir (yaklasik 285 yil).
  const timestampMicroseconds = Number(view.getBigInt64(8, true));
  const payloadLength = view.getInt32(16, true);

  if (
    payloadLength <= 0 ||
    VIDEO_FRAME_HEADER_SIZE + payloadLength > buffer.byteLength
  ) {
    return null;
  }

  return {
    data: new Uint8Array(buffer, VIDEO_FRAME_HEADER_SIZE, payloadLength),
    timestampMicroseconds,
    isKeyFrame: frameType === FRAME_TYPE_KEY,
    containsParameterSets: (flags & FLAG_PARAMETER_SETS) !== 0,
  };
}

/** Metin mesajini cozer; taninmayan mesaj tipleri yok sayilir. */
export function decodeVideoTextMessage(
  rawMessage: string,
): VideoStreamTextMessage | null {
  try {
    const parsed = JSON.parse(rawMessage) as { type?: string };

    if (
      parsed.type === VideoStreamMessageTypes.StreamInfo ||
      parsed.type === VideoStreamMessageTypes.StreamStatus
    ) {
      return parsed as VideoStreamTextMessage;
    }

    return null;
  } catch {
    return null;
  }
}
