// Geliştirme için sahte telemetri kaynağı. SocketLike arayüzünü taklit eder,
// böylece gerçek bir backend olmadan UI uçtan uca denenebilir.
// Üretimde VITE_WS_URL tanımlanarak gerçek WebSocket kullanılır.

import type { SocketLike } from './websocket'
import type { CommandAck, OutgoingCommand, TelemetryPacket } from './types'

/** Basit bir dikey uçuş modeline göre telemetri üretir. */
export class MockSocket implements SocketLike {
  onopen: ((this: unknown, ev: unknown) => unknown) | null = null
  onclose: ((this: unknown, ev: unknown) => unknown) | null = null
  onmessage: ((this: unknown, ev: { data: unknown }) => unknown) | null = null
  onerror: ((this: unknown, ev: unknown) => unknown) | null = null

  private timer: ReturnType<typeof setInterval> | null = null
  private t = 0
  private armed = false

  constructor() {
    // Bağlantının açılmasını mikro-asenkron taklit et.
    setTimeout(() => {
      this.onopen?.call(this, {})
      this.timer = setInterval(() => this.tick(), 200)
    }, 150)
  }

  send(data: string): void {
    let cmd: OutgoingCommand
    try {
      cmd = JSON.parse(data) as OutgoingCommand
    } catch {
      return
    }
    if (cmd.type !== 'command') return

    this.armed = cmd.command === 'arm'
    const ack: CommandAck = {
      type: 'ack',
      commandId: cmd.commandId,
      command: cmd.command,
      status: 'ok',
    }
    // Sunucu gecikmesini taklit et (timeout mantığını da denemek için).
    setTimeout(() => this.emit(ack), 600)
  }

  close(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.onclose?.call(this, {})
  }

  private tick(): void {
    this.t += 0.2
    // arm öncesi rampada bekle; arm sonrası tırman.
    const climb = this.armed ? this.t : 0
    const altitude = Math.max(0, 0.5 * 9.5 * climb * climb)
    const velocity = 9.5 * climb
    const temperature = 15 + velocity * 0.08 + Math.sin(this.t) * 1.5

    const packet: TelemetryPacket = {
      type: 'telemetry',
      t: round(this.t, 2),
      altitude: round(altitude, 1),
      velocity: round(velocity, 1),
      temperature: round(temperature, 1),
    }
    this.emit(packet)
  }

  private emit(message: TelemetryPacket | CommandAck): void {
    this.onmessage?.call(this, { data: JSON.stringify(message) })
  }
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
