// Saf (yan etkisiz) parse & doğrulama fonksiyonları — test edilebilir.

import type {
  BarometerData,
  CommandAck,
  GnssData,
  ImuData,
  IncomingMessage,
  OperationMode,
  TelemetryPacket,
} from '../types'
import { OPERATION_MODES } from '../types'

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function num(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isMode(value: unknown): value is OperationMode {
  return (
    typeof value === 'string' &&
    (OPERATION_MODES as readonly string[]).includes(value)
  )
}

function isVec3(value: unknown): value is { x: number; y: number; z: number } {
  return isRecord(value) && num(value.x) && num(value.y) && num(value.z)
}

function isGnss(value: unknown): value is GnssData {
  return (
    isRecord(value) &&
    num(value.satellites) &&
    num(value.latitude) &&
    num(value.longitude) &&
    num(value.altitude) &&
    num(value.speed) &&
    num(value.heading) &&
    typeof value.utc === 'string'
  )
}

function isBarometer(value: unknown): value is BarometerData {
  return (
    isRecord(value) &&
    num(value.pressure) &&
    num(value.altitude) &&
    num(value.temperature)
  )
}

function isImu(value: unknown): value is ImuData {
  return (
    isRecord(value) &&
    isVec3(value.accel) &&
    isVec3(value.gyro) &&
    num(value.roll) &&
    num(value.pitch) &&
    num(value.yaw)
  )
}

export function isTelemetryPacket(value: unknown): value is TelemetryPacket {
  return (
    isRecord(value) &&
    value.type === 'telemetry' &&
    num(value.t) &&
    isMode(value.mode) &&
    isGnss(value.gnss) &&
    isBarometer(value.barometer) &&
    isImu(value.imu)
  )
}

export function isCommandAck(value: unknown): value is CommandAck {
  return (
    isRecord(value) &&
    value.type === 'ack' &&
    typeof value.commandId === 'string' &&
    typeof value.command === 'string' &&
    (value.status === 'ok' || value.status === 'error') &&
    (value.message === undefined || typeof value.message === 'string')
  )
}

/** Ham JSON string'ini tipli mesaja çevirir; hata durumunda fırlatmaz. */
export function parseMessage(raw: string): ParseResult<IncomingMessage> {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'Geçersiz JSON' }
  }
  if (isTelemetryPacket(data)) return { ok: true, value: data }
  if (isCommandAck(data)) return { ok: true, value: data }
  return { ok: false, error: 'Tanınmayan mesaj şeması' }
}
