// Paketler — barrel ve mesaj yönlendirme.
// Ağdan gelen ham JSON burada deserialize edilip tipli mesaja çevrilir;
// giden komutlar burada serialize edilir.

export * from './telemetry'
export * from './command'

import { isTelemetryPacket, type TelemetryPacket } from './telemetry'
import { isCommandAck, type CommandAck } from './command'

/** Sunucudan gelebilecek tüm mesaj tipleri. */
export type IncomingMessage = TelemetryPacket | CommandAck

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string }

/**
 * Ağdan gelen ham JSON string'ini tipli mesaja deserialize eder.
 * Hatalı JSON ya da tanınmayan şemada `ok: false` döner — exception fırlatmaz.
 */
export function deserialize(raw: string): ParseResult<IncomingMessage> {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'Geçersiz JSON' }
  }
  if (isTelemetryPacket(data)) return { ok: true, value: data }
  if (isCommandAck(data)) return { ok: true, value: data }
  return { ok: false, error: 'Tanınmayan paket şeması' }
}
