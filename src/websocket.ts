// WebSocket bağlantı yönetimi: otomatik yeniden bağlanma (exponential backoff),
// durum bildirimi ve mesaj gönderimi. Parse işi parser.ts'e delege edilir.

import { parseMessage } from './parser'
import type { ConnectionStatus, IncomingMessage, OutgoingCommand } from './types'

/**
 * Test ve mock için yeterli olan minimal WebSocket arayüzü.
 * Gerçek tarayıcı `WebSocket` bu sözleşmeyi karşılar.
 */
export interface SocketLike {
  send(data: string): void
  close(): void
  onopen: ((this: unknown, ev: unknown) => unknown) | null
  onclose: ((this: unknown, ev: unknown) => unknown) | null
  onmessage: ((this: unknown, ev: { data: unknown }) => unknown) | null
  onerror: ((this: unknown, ev: unknown) => unknown) | null
}

export type SocketFactory = (url: string) => SocketLike

export interface ConnectionOptions {
  url: string
  /** İlk yeniden deneme gecikmesi (ms). */
  baseDelayMs?: number
  /** Üst sınır gecikme (ms). */
  maxDelayMs?: number
  /** Test/mock için soket fabrikası; verilmezse gerçek WebSocket kullanılır. */
  factory?: SocketFactory
  onStatus(status: ConnectionStatus): void
  onMessage(message: IncomingMessage): void
}

const defaultFactory: SocketFactory = (url) =>
  new WebSocket(url) as unknown as SocketLike

/** Yeniden bağlanan WebSocket istemcisi. */
export class TelemetryConnection {
  private socket: SocketLike | null = null
  private attempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private closedByUser = false

  private readonly url: string
  private readonly baseDelayMs: number
  private readonly maxDelayMs: number
  private readonly factory: SocketFactory
  private readonly onStatus: (s: ConnectionStatus) => void
  private readonly onMessage: (m: IncomingMessage) => void

  constructor(opts: ConnectionOptions) {
    this.url = opts.url
    this.baseDelayMs = opts.baseDelayMs ?? 1000
    this.maxDelayMs = opts.maxDelayMs ?? 15000
    this.factory = opts.factory ?? defaultFactory
    this.onStatus = opts.onStatus
    this.onMessage = opts.onMessage
  }

  /** Bağlantıyı başlatır. */
  connect(): void {
    this.closedByUser = false
    this.open()
  }

  /** Bağlantıyı kapatır ve yeniden denemeyi durdurur. */
  disconnect(): void {
    this.closedByUser = true
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.socket?.close()
    this.socket = null
    this.onStatus('disconnected')
  }

  /** Komutu JSON olarak gönderir. Soket açık değilse false döner. */
  send(command: OutgoingCommand): boolean {
    if (this.socket === null) return false
    try {
      this.socket.send(JSON.stringify(command))
      return true
    } catch {
      return false
    }
  }

  private open(): void {
    this.onStatus(this.attempt === 0 ? 'disconnected' : 'reconnecting')

    const socket = this.factory(this.url)
    this.socket = socket

    socket.onopen = () => {
      this.attempt = 0
      this.onStatus('connected')
    }

    socket.onmessage = (ev) => {
      if (typeof ev.data !== 'string') return
      const result = parseMessage(ev.data)
      if (result.ok) this.onMessage(result.value)
      // Hatalı paketler sessizce yok sayılır; istenirse burada loglanabilir.
    }

    socket.onerror = () => {
      // Hata ardından genelde onclose tetiklenir; backoff orada yönetilir.
    }

    socket.onclose = () => {
      this.socket = null
      if (this.closedByUser) return
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect(): void {
    const delay = Math.min(
      this.maxDelayMs,
      this.baseDelayMs * 2 ** this.attempt,
    )
    this.attempt += 1
    this.onStatus('reconnecting')
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.open()
    }, delay)
  }
}
