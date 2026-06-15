// Minimal, framework-bağımsız pub/sub store + uygulama state'i.

import type {
  CommandAck,
  CommandName,
  ConnectionStatus,
  OperationMode,
  TelemetryPacket,
} from '../types'

/** Bellekte tutulacak maksimum telemetri örneği (ring buffer). */
export const MAX_SAMPLES = 500

export interface CommandState {
  pending: { commandId: string; command: CommandName } | null
  lastAck: CommandAck | null
  timedOut: boolean
  armed: boolean
  /** Geri sayım T değeri (saniye). null ise sayım kapalı. */
  countdown: number | null
}

export interface AppState {
  connection: ConnectionStatus
  mode: OperationMode
  latest: TelemetryPacket | null
  history: readonly TelemetryPacket[]
  command: CommandState
}

export type Listener<S> = (state: S) => void

export class Store<S> {
  private state: S
  private readonly listeners = new Set<Listener<S>>()

  constructor(initial: S) {
    this.state = initial
  }

  getState = (): S => this.state

  setState(patch: Partial<S> | ((state: S) => Partial<S>)): void {
    const delta = typeof patch === 'function' ? patch(this.state) : patch
    this.state = { ...this.state, ...delta }
    for (const listener of this.listeners) listener(this.state)
  }

  subscribe = (listener: Listener<S>): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

export function createInitialState(): AppState {
  return {
    connection: 'disconnected',
    mode: 'GUVENLI',
    latest: null,
    history: [],
    command: {
      pending: null,
      lastAck: null,
      timedOut: false,
      armed: false,
      countdown: null,
    },
  }
}

/** Geçmişe yeni örnek ekleyip MAX_SAMPLES'a kırpar (saf). */
export function appendSample(
  history: readonly TelemetryPacket[],
  sample: TelemetryPacket,
): readonly TelemetryPacket[] {
  const next = [...history, sample]
  return next.length > MAX_SAMPLES ? next.slice(next.length - MAX_SAMPLES) : next
}
