// Geliştirme için sahte telemetri kaynağı. SocketLike arayüzünü taklit eder,
// böylece gerçek backend olmadan UI uçtan uca denenebilir.
// Üretimde VITE_WS_URL tanımlanarak gerçek WebSocket kullanılır.

import type { SocketLike } from './websocket'
import type {
  CommandAck,
  OperationMode,
  OutgoingCommand,
  TelemetryPacket,
} from '../types'

const round = (v: number, d: number): number => {
  const f = 10 ** d
  return Math.round(v * f) / f
}

const BASE_LAT = 41.015
const BASE_LON = 28.979

export class MockSocket implements SocketLike {
  onopen: ((ev: unknown) => unknown) | null = null
  onclose: ((ev: unknown) => unknown) | null = null
  onmessage: ((ev: { data: unknown }) => unknown) | null = null
  onerror: ((ev: unknown) => unknown) | null = null

  private timer: ReturnType<typeof setInterval> | null = null
  private t = 0
  private mode: OperationMode = 'GUVENLI'
  private flightStart = 0

  constructor() {
    setTimeout(() => {
      this.onopen?.({})
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

    switch (cmd.command) {
      case 'arm':
        this.mode = 'HAZIRLIK'
        break
      case 'disarm':
      case 'abort':
        this.mode = 'GUVENLI'
        this.flightStart = 0
        break
      case 'ignite':
        this.mode = 'ATESLEME'
        this.flightStart = this.t
        break
    }

    const ack: CommandAck = {
      type: 'ack',
      commandId: cmd.commandId,
      command: cmd.command,
      status: 'ok',
    }
    setTimeout(() => this.emit(ack), 500)
  }

  close(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.onclose?.({})
  }

  private tick(): void {
    this.t += 0.2

    // ATESLEME birkaç saniye sonra SEYIR'e geçer.
    const flightT = this.flightStart > 0 ? this.t - this.flightStart : 0
    if (this.mode === 'ATESLEME' && flightT > 4) this.mode = 'SEYIR'

    const flying = this.mode === 'ATESLEME' || this.mode === 'SEYIR'
    const altitude = flying ? 0.5 * 22 * flightT * flightT : 0
    const speed = flying ? 22 * flightT : 0
    const heading = (90 + flightT * 1.5) % 360

    const temperature = 15 - altitude * 0.0065 + Math.sin(this.t) * 0.6
    const pressure = 1013.25 * Math.exp(-altitude / 8400)

    const packet: TelemetryPacket = {
      type: 'telemetry',
      t: round(this.t, 2),
      mode: this.mode,
      gnss: {
        satellites: flying ? 11 + (Math.floor(this.t) % 3) : 8,
        latitude: round(BASE_LAT + altitude * 1e-6, 6),
        longitude: round(BASE_LON + altitude * 5e-7, 6),
        altitude: round(altitude, 1),
        speed: round(speed, 1),
        heading: round(heading, 1),
        utc: new Date().toISOString(),
      },
      barometer: {
        pressure: round(pressure, 2),
        altitude: round(altitude + Math.sin(this.t * 1.3) * 1.2, 1),
        temperature: round(temperature, 1),
      },
      imu: {
        accel: {
          x: round(Math.sin(this.t) * 0.3, 2),
          y: round((flying ? 22 : 0) + Math.cos(this.t) * 0.3, 2),
          z: round(9.81 + Math.sin(this.t * 0.7) * 0.2, 2),
        },
        gyro: {
          x: round(Math.sin(this.t * 1.1) * 4, 2),
          y: round(Math.cos(this.t * 0.9) * 4, 2),
          z: round(Math.sin(this.t * 1.4) * 2, 2),
        },
        roll: round(Math.sin(this.t * 0.5) * 6, 1),
        pitch: round(flying ? 80 + Math.sin(this.t * 0.4) * 3 : Math.sin(this.t) * 2, 1),
        yaw: round(heading, 1),
      },
    }
    this.emit(packet)
  }

  private emit(message: TelemetryPacket | CommandAck): void {
    this.onmessage?.({ data: JSON.stringify(message) })
  }
}
