// Komut akışı denetleyicisi: komut üretir, ACK bekler, zaman aşımını yönetir
// ve sonucu store üzerinden UI'a yansıtır. WebSocket'ten bağımsızdır (send enjekte edilir).

import type { Store, AppState } from './store'
import type { CommandAck, CommandName, OutgoingCommand } from './types'

/** Komut göndermek için kullanılan, ağ katmanından soyutlanmış arayüz. */
export type SendFn = (command: OutgoingCommand) => boolean

let counter = 0
function nextCommandId(): string {
  counter += 1
  return `cmd-${Date.now()}-${counter}`
}

export class CommandController {
  private timer: ReturnType<typeof setTimeout> | null = null

  constructor(
    private readonly store: Store<AppState>,
    private readonly send: SendFn,
    private readonly timeoutMs = 3000,
  ) {}

  arm(): void {
    this.issue('arm')
  }

  disarm(): void {
    this.issue('disarm')
  }

  /** Sunucudan ACK geldiğinde main.ts bunu çağırır. */
  handleAck(ack: CommandAck): void {
    const { pending } = this.store.getState().command
    if (pending === null || pending.commandId !== ack.commandId) return

    this.clearTimer()
    this.store.setState((s) => ({
      command: {
        ...s.command,
        pending: null,
        lastAck: ack,
        timedOut: false,
        armed: ack.status === 'ok' ? ack.command === 'arm' : s.command.armed,
      },
    }))
  }

  private issue(command: CommandName): void {
    // Zaten bekleyen bir komut varsa yenisini engelle.
    if (this.store.getState().command.pending !== null) return

    const message: OutgoingCommand = {
      type: 'command',
      commandId: nextCommandId(),
      command,
    }

    const sent = this.send(message)
    if (!sent) {
      this.store.setState((s) => ({
        command: {
          ...s.command,
          pending: null,
          timedOut: false,
          lastAck: {
            type: 'ack',
            commandId: message.commandId,
            command,
            status: 'error',
            message: 'Bağlantı yok — komut gönderilemedi',
          },
        },
      }))
      return
    }

    this.store.setState((s) => ({
      command: {
        ...s.command,
        pending: { commandId: message.commandId, command },
        timedOut: false,
      },
    }))

    this.clearTimer()
    this.timer = setTimeout(() => this.handleTimeout(message.commandId), this.timeoutMs)
  }

  private handleTimeout(commandId: string): void {
    const { pending } = this.store.getState().command
    if (pending === null || pending.commandId !== commandId) return
    this.store.setState((s) => ({
      command: { ...s.command, pending: null, timedOut: true },
    }))
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
}
