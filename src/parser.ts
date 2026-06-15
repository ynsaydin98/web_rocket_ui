// Saf (yan etkisiz) parse & doğrulama fonksiyonları.
// Buradaki hiçbir fonksiyon global state'e dokunmaz; bu sayede kolayca test edilebilir.

import type {
  CommandAck,
  CommandName,
  IncomingMessage,
  TelemetryPacket,
} from './types'

/** Başarılı/başarısız ayrımını taşıyan basit sonuç tipi. */
export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string }

/** `value`'nun düz bir JSON nesnesi olup olmadığını daraltır. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isCommandName(value: unknown): value is CommandName {
  return value === 'arm' || value === 'disarm'
}

/** Bir nesneyi TelemetryPacket'e daraltır. */
export function isTelemetryPacket(value: unknown): value is TelemetryPacket {
  return (
    isRecord(value) &&
    value.type === 'telemetry' &&
    isFiniteNumber(value.t) &&
    isFiniteNumber(value.altitude) &&
    isFiniteNumber(value.velocity) &&
    isFiniteNumber(value.temperature)
  )
}

/** Bir nesneyi CommandAck'e daraltır. */
export function isCommandAck(value: unknown): value is CommandAck {
  return (
    isRecord(value) &&
    value.type === 'ack' &&
    typeof value.commandId === 'string' &&
    isCommandName(value.command) &&
    (value.status === 'ok' || value.status === 'error') &&
    (value.message === undefined || typeof value.message === 'string')
  )
}

/**
 * Ham WebSocket string'ini tipli mesaja çevirir.
 * Hatalı JSON ya da tanınmayan şema durumunda `ok: false` döner — exception fırlatmaz.
 */
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
