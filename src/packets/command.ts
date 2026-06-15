// Paketler / Komut paketleri: giden komut isteği (serialize) ve
// gelen onay/ACK (deserialize).

/** Gönderilebilir komutlar. */
export type CommandName = 'arm' | 'disarm' | 'ignite' | 'abort'

/** İstemci → sunucu komut paketi. */
export interface CommandRequest {
  type: 'command'
  commandId: string
  command: CommandName
}

/** Sunucu → istemci onayı (ACK). */
export interface CommandAck {
  type: 'ack'
  commandId: string
  command: CommandName
  status: 'ok' | 'error'
  message?: string
}

let counter = 0

/** Yeni, benzersiz bir komut kimliği üretir. */
export function nextCommandId(): string {
  counter += 1
  return `cmd-${Date.now()}-${counter}`
}

/** Bir komut adından gönderilecek komut paketini oluşturur. */
export function buildCommand(command: CommandName): CommandRequest {
  return { type: 'command', commandId: nextCommandId(), command }
}

/** Komut paketini ağa gönderilecek JSON string'ine çevirir. */
export function serializeCommand(request: CommandRequest): string {
  return JSON.stringify(request)
}

// --- Doğrulama ---

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Çözümlenmiş bir nesneyi CommandAck'e daraltır. */
export function isCommandAck(v: unknown): v is CommandAck {
  return (
    isRecord(v) &&
    v.type === 'ack' &&
    typeof v.commandId === 'string' &&
    typeof v.command === 'string' &&
    (v.status === 'ok' || v.status === 'error') &&
    (v.message === undefined || typeof v.message === 'string')
  )
}
