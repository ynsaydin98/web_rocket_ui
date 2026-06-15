// Telemetri ve komut alan adı tipleri.

/** Roket operasyon modları (üst bar). */
export type OperationMode = 'GUVENLI' | 'HAZIRLIK' | 'ATESLEME' | 'SEYIR'

export const OPERATION_MODES: readonly OperationMode[] = [
  'GUVENLI',
  'HAZIRLIK',
  'ATESLEME',
  'SEYIR',
]

/** GNSS / konum verileri. */
export interface GnssData {
  /** Görülen uydu sayısı. */
  satellites: number
  latitude: number
  longitude: number
  /** Yükseklik, metre. */
  altitude: number
  /** Yer hızı, m/s. */
  speed: number
  /** Yönelim / rota, derece (0–360). */
  heading: number
  /** UTC zamanı, ISO 8601. */
  utc: string
}

/** Barometre verileri. */
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

/** IMU verileri (ivme, açısal hız ve tutum). */
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
