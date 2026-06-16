// Komut akışı denetleyicisi: komut üretir, ACK bekler, zaman aşımını yönetir.
// Store'a bağlı değildir; güncel durumu okuma/yazma React'ten enjekte edilir.

import { buildCommand } from '../packets'
import type { CommandAck, CommandName, CommandRequest } from '../types'

/** Komut alt sisteminin durumu (UI'da gösterilir). */
export interface CommandState {
  pending: { commandId: string; command: CommandName } | null
  lastAck: CommandAck | null
  timedOut: boolean
  armed: boolean
  /** Geri sayım T değeri (saniye). null ise sayım kapalı. */
  countdown: number | null
}

export const INITIAL_COMMAND: CommandState = {
  pending: null,
  lastAck: null,
  timedOut: false,
  armed: false,
  countdown: null,
}

export type SendFn = (command: CommandRequest) => boolean
export type GetCommand = () => CommandState
export type SetCommand = (updater: (c: CommandState) => CommandState) => void

export interface CommandDeps {
  send: SendFn
  getCommand: GetCommand
  setCommand: SetCommand
  timeoutMs?: number
}

export class CommandController {
  private timer: ReturnType<typeof setTimeout> | null = null
  private readonly send: SendFn
  private readonly getCommand: GetCommand
  private readonly setCommand: SetCommand
  private readonly timeoutMs: number

  constructor(deps: CommandDeps) {
    this.send = deps.send
    this.getCommand = deps.getCommand
    this.setCommand = deps.setCommand
    this.timeoutMs = deps.timeoutMs ?? 3000
  }

  issue(command: CommandName): void {
    if (this.getCommand().pending !== null) return

    const message = buildCommand(command)

    if (!this.send(message)) {
      this.setCommand((c) => ({
        ...c,
        pending: null,
        timedOut: false,
        lastAck: {
          type: 'ack',
          commandId: message.commandId,
          command,
          status: 'error',
          message: 'Bağlantı yok — komut gönderilemedi',
        },
      }))
      return
    }

    this.setCommand((c) => ({
      ...c,
      pending: { commandId: message.commandId, command },
      timedOut: false,
    }))

    this.clearTimer()
    this.timer = setTimeout(() => this.handleTimeout(message.commandId), this.timeoutMs)
  }

  handleAck(ack: CommandAck): void {
    const { pending } = this.getCommand()
    if (pending === null || pending.commandId !== ack.commandId) return

    this.clearTimer()
    this.setCommand((c) => ({
      ...c,
      pending: null,
      lastAck: ack,
      timedOut: false,
      armed:
        ack.status !== 'ok'
          ? c.armed
          : ack.command === 'arm'
            ? true
            : ack.command === 'disarm' || ack.command === 'abort'
              ? false
              : c.armed,
    }))
  }

  private handleTimeout(commandId: string): void {
    const { pending } = this.getCommand()
    if (pending === null || pending.commandId !== commandId) return
    this.setCommand((c) => ({ ...c, pending: null, timedOut: true }))
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
}
