// Paketler / Telemetri paketi tanımı ve deserialize (doğrulama).
// Ağdan gelen JSON bu modülde tipli TelemetryPacket'e çevrilir.

/** Roket operasyon modları. */
export type OperationMode = 'GUVENLI' | 'HAZIRLIK' | 'ATESLEME' | 'SEYIR'

export const OPERATION_MODES: readonly OperationMode[] = [
  'GUVENLI',
  'HAZIRLIK',
  'ATESLEME',
  'SEYIR',
]

export interface GnssData {
  satellites: number
  latitude: number
  longitude: number
  /** Yükseklik, metre. */
  altitude: number
  /** Yer hızı, m/s. */
  speed: number
  /** Yönelim / rota, derece. */
  heading: number
  /** UTC zamanı, ISO 8601. */
  utc: string
}

export interface BarometerData {
  /** Basınç, hPa. */
  pressure: number
  /** Barometrik yükseklik, metre. */
  altitude: number
  /** Sıcaklık, °C. */
  temperature: number
}

interface Vec3 {
  x: number
  y: number
  z: number
}

export interface ImuData {
  /** İvme, m/s². */
  accel: Vec3
  /** Açısal hız, °/s. */
  gyro: Vec3
  roll: number
  pitch: number
  yaw: number
}

/** Tek bir telemetri paketi. */
export interface TelemetryPacket {
  type: 'telemetry'
  /** Görev başından itibaren geçen süre, saniye. */
  t: number
  mode: OperationMode
  gnss: GnssData
  barometer: BarometerData
  imu: ImuData
}

// --- Saf doğrulama (type guard) yardımcıları ---

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function num(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

function isMode(v: unknown): v is OperationMode {
  return typeof v === 'string' && (OPERATION_MODES as readonly string[]).includes(v)
}

function isVec3(v: unknown): v is Vec3 {
  return isRecord(v) && num(v.x) && num(v.y) && num(v.z)
}

function isGnss(v: unknown): v is GnssData {
  return (
    isRecord(v) &&
    num(v.satellites) &&
    num(v.latitude) &&
    num(v.longitude) &&
    num(v.altitude) &&
    num(v.speed) &&
    num(v.heading) &&
    typeof v.utc === 'string'
  )
}

function isBarometer(v: unknown): v is BarometerData {
  return isRecord(v) && num(v.pressure) && num(v.altitude) && num(v.temperature)
}

function isImu(v: unknown): v is ImuData {
  return (
    isRecord(v) &&
    isVec3(v.accel) &&
    isVec3(v.gyro) &&
    num(v.roll) &&
    num(v.pitch) &&
    num(v.yaw)
  )
}

/** Çözümlenmiş bir nesneyi TelemetryPacket'e daraltır. */
export function isTelemetryPacket(v: unknown): v is TelemetryPacket {
  return (
    isRecord(v) &&
    v.type === 'telemetry' &&
    num(v.t) &&
    isMode(v.mode) &&
    isGnss(v.gnss) &&
    isBarometer(v.barometer) &&
    isImu(v.imu)
  )
}
