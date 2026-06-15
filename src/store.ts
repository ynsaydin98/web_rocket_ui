// Minimal pub/sub state store. Framework yok, global yok.
// Tüketiciler `subscribe` ile dinler; `setState` çağrısı tüm dinleyicileri tetikler.

import type {
  CommandAck,
  CommandName,
  ConnectionStatus,
  TelemetryPacket,
} from './types'

/** Bellekte tutulacak maksimum telemetri örneği sayısı (ring buffer kapasitesi). */
export const MAX_SAMPLES = 500

export type Tab = 'telemetry' | 'command'

/** Bekleyen komutun UI'da gösterilebilir durumu. */
export interface CommandState {
  /** Şu an ACK beklenen komut; yoksa null. */
  pending: { commandId: string; command: CommandName } | null
  /** Son alınan ACK. */
  lastAck: CommandAck | null
  /** Son komut zaman aşımına mı uğradı? */
  timedOut: boolean
  /** Bilinen en son arm durumu (başarılı ACK'lere göre). */
  armed: boolean
}

export interface AppState {
  connection: ConnectionStatus
  activeTab: Tab
  latest: TelemetryPacket | null
  /** En eski → en yeni sırada, en fazla MAX_SAMPLES örnek. */
  history: readonly TelemetryPacket[]
  command: CommandState
}

export type Listener<S> = (state: S) => void

/** Tipli, jenerik pub/sub store. */
export class Store<S> {
  private state: S
  private readonly listeners = new Set<Listener<S>>()

  constructor(initial: S) {
    this.state = initial
  }

  getState(): S {
    return this.state
  }

  /**
   * State'i kısmi bir yama veya (mevcut state → yama) fonksiyonu ile günceller.
   * Referans değişirse dinleyicileri çağırır.
   */
  setState(patch: Partial<S> | ((state: S) => Partial<S>)): void {
    const delta = typeof patch === 'function' ? patch(this.state) : patch
    this.state = { ...this.state, ...delta }
    for (const listener of this.listeners) listener(this.state)
  }

  /** Dinleyici ekler ve aboneliği iptal eden fonksiyonu döner. */
  subscribe(listener: Listener<S>): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

/** Uygulama için başlangıç state'ini üretir (test edilebilirlik için saf fabrika). */
export function createInitialState(): AppState {
  return {
    connection: 'disconnected',
    activeTab: 'telemetry',
    latest: null,
    history: [],
    command: { pending: null, lastAck: null, timedOut: false, armed: false },
  }
}

/**
 * Geçmişe yeni bir örnek ekleyip MAX_SAMPLES sınırına kırpar (saf fonksiyon).
 */
export function appendSample(
  history: readonly TelemetryPacket[],
  sample: TelemetryPacket,
): readonly TelemetryPacket[] {
  const next = [...history, sample]
  return next.length > MAX_SAMPLES ? next.slice(next.length - MAX_SAMPLES) : next
}
