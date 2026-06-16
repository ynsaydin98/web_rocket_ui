// Fırlatma sekansı + geri sayım denetleyicisi.
// Geri sayım T-0'a ulaştığında 'ignite' komutunu gönderir; sonra T+'ya devam eder.
// Store'a bağlı değildir; durum okuma/yazma React'ten enjekte edilir.

import type { CommandController, GetCommand, SetCommand } from './commands'

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

export interface SequenceDeps {
  commands: CommandController
  getCommand: GetCommand
  setCommand: SetCommand
}

export class SequenceController {
  private timer: ReturnType<typeof setInterval> | null = null
  private ignited = false
  private readonly commands: CommandController
  private readonly getCommand: GetCommand
  private readonly setCommand: SetCommand

  constructor(deps: SequenceDeps) {
    this.commands = deps.commands
    this.getCommand = deps.getCommand
    this.setCommand = deps.setCommand
  }

  /** Geri sayımı başlatır (yalnızca arm edilmişse). */
  start(): void {
    const command = this.getCommand()
    if (!command.armed || command.countdown !== null) return
    this.ignited = false
    this.setCommand((c) => ({ ...c, countdown: COUNTDOWN_START }))
    this.timer = setInterval(() => this.tick(), 100)
  }

  /** Geri sayımı durdurur ve sıfırlar. */
  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.setCommand((c) => ({ ...c, countdown: null }))
  }

  private tick(): void {
    const current = this.getCommand().countdown
    if (current === null) return

    // T-0'dan sonra sayaç negatife (T+) geçerek yükselmeye devam eder.
    const next = Math.round((current - 0.1) * 10) / 10
    this.setCommand((c) => ({ ...c, countdown: next }))

    if (next <= 0 && !this.ignited) {
      this.ignited = true
      this.commands.issue('ignite')
    }
  }
}
