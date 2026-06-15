// Ortak tip tanımları. Hem ağ katmanı (parser/websocket) hem de UI bu tipleri kullanır.

/** Komut isimleri. */
export type CommandName = 'arm' | 'disarm'

/** Bağlantı durumu göstergesi için kullanılan durumlar. */
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'

/**
 * Sunucudan gelen anlık telemetri paketi.
 * `t` görev başlangıcından itibaren geçen süre (saniye) — grafik X eksenidir.
 */
export interface TelemetryPacket {
  type: 'telemetry'
  /** Mission Elapsed Time, saniye. */
  t: number
  /** İrtifa, metre. */
  altitude: number
  /** Hız, m/s. */
  velocity: number
  /** Sıcaklık, °C. */
  temperature: number
}

/** Gönderilen bir komuta karşılık sunucudan dönen onay (ACK). */
export interface CommandAck {
  type: 'ack'
  /** Hangi komuta ait olduğunu eşlemek için kullanılan kimlik. */
  commandId: string
  command: CommandName
  status: 'ok' | 'error'
  message?: string
}

/** Sunucudan gelebilecek tüm mesaj tipleri. */
export type IncomingMessage = TelemetryPacket | CommandAck

/** İstemciden sunucuya gönderilen komut mesajı. */
export interface OutgoingCommand {
  type: 'command'
  commandId: string
  command: CommandName
}
