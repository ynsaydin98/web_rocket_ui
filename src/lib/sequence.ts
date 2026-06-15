// Fırlatma sekansı + geri sayım denetleyicisi.
// Geri sayım T-0'a ulaştığında 'ignite' komutunu gönderir.

import type { CommandController } from './commands'
import type { AppState, Store } from './store'

export interface SequenceStep {
  /** Adımın etkinleştiği T-eksi değeri (saniye). */
  tMinus: number
  label: string
}

/** Fırlatma sekansı adımları (büyükten küçüğe). */
export const SEQUENCE: readonly SequenceStep[] = [
  { tMinus: 10, label: 'Kol kontrol / telemetri kilidi' },
  { tMinus: 8, label: 'Tank basınçlandırma' },
  { tMinus: 5, label: 'İç güce geçiş' },
  { tMinus: 3, label: 'Motor ön yakım' },
  { tMinus: 0, label: 'Ateşleme' },
]

export const COUNTDOWN_START = 10

/** Verili T değerinde tamamlanmış adım sayısı (saf). */
export function activeStepCount(countdown: number): number {
  return SEQUENCE.filter((s) => countdown <= s.tMinus).length
}

export class SequenceController {
  private timer: ReturnType<typeof setInterval> | null = null
  private ignited = false

  constructor(
    private readonly store: Store<AppState>,
    private readonly commands: CommandController,
  ) {}

  /** Geri sayımı başlatır (yalnızca arm edilmişse). */
  start(): void {
    const { command } = this.store.getState()
    if (!command.armed || command.countdown !== null) return
    this.ignited = false
    this.store.setState((s) => ({
      command: { ...s.command, countdown: COUNTDOWN_START },
    }))
    this.timer = setInterval(() => this.tick(), 100)
  }

  /** Geri sayımı durdurur ve sıfırlar. */
  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.store.setState((s) => ({ command: { ...s.command, countdown: null } }))
  }

  private tick(): void {
    const current = this.store.getState().command.countdown
    if (current === null) return

    const next = Math.max(0, Math.round((current - 0.1) * 10) / 10)
    this.store.setState((s) => ({ command: { ...s.command, countdown: next } }))

    if (next <= 0 && !this.ignited) {
      this.ignited = true
      this.commands.issue('ignite')
      if (this.timer !== null) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
}
