// Komut akışı denetleyicisi: komut üretir, ACK bekler, zaman aşımını yönetir
// ve sonucu store'a yansıtır. Ağ katmanından bağımsızdır (send enjekte edilir).

import type { AppState, Store } from './store'
import type { CommandAck, CommandName, OutgoingCommand } from '../types'

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

  issue(command: CommandName): void {
    if (this.store.getState().command.pending !== null) return

    const message: OutgoingCommand = {
      type: 'command',
      commandId: nextCommandId(),
      command,
    }

    if (!this.send(message)) {
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
        armed:
          ack.status !== 'ok'
            ? s.command.armed
            : ack.command === 'arm'
              ? true
              : ack.command === 'disarm' || ack.command === 'abort'
                ? false
                : s.command.armed,
      },
    }))
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
