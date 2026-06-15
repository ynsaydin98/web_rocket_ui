// Komut ve bağlantı tipleri.

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'

/** Gönderilebilir komutlar. */
export type CommandName = 'arm' | 'disarm' | 'ignite' | 'abort'

/** İstemci → sunucu komut mesajı. */
export interface OutgoingCommand {
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
