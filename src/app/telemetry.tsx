// Telemetri state katmanı — klasik React Context + useState (push) modeli.
// WebSocket'ten gelen anlık paket doğrudan state'e yazılır; geçmiş tutulmaz.
// Geçmiş gerektiren yerler (grafik, 3D iz) useTelemetryBuffer ile yerel,
// geçici bir tampon kullanır.

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { WS_URL } from '../config'
import {
  CommandController,
  INITIAL_COMMAND,
  type CommandState,
} from '../lib/commands'
import { SequenceController } from '../lib/sequence'
import { TelemetryConnection } from '../lib/websocket'
import type { ConnectionStatus, TelemetryPacket } from '../types'

interface TelemetryContextValue {
  connection: ConnectionStatus
  /** Son alınan telemetri paketi (mod dahil: telemetry.mode). */
  telemetry: TelemetryPacket | null
  command: CommandState
  commands: CommandController
  sequence: SequenceController
}

const Ctx = createContext<TelemetryContextValue | null>(null)

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<ConnectionStatus>('disconnected')
  const [telemetry, setTelemetry] = useState<TelemetryPacket | null>(null)
  const [command, setCommand] = useState<CommandState>(INITIAL_COMMAND)

  // Timer'ların (timeout/countdown) güncel komut durumunu okuyabilmesi için ayna.
  const commandRef = useRef(command)
  commandRef.current = command

  // Bağlantı + denetleyiciler bir kez kurulur (StrictMode'a karşı guard).
  const apiRef = useRef<{
    connection: TelemetryConnection
    commands: CommandController
    sequence: SequenceController
  } | null>(null)

  if (apiRef.current === null) {
    const conn = new TelemetryConnection({
      url: WS_URL,
      onStatus: setConnection,
      onMessage: (m) => {
        if (m.type === 'telemetry') setTelemetry(m)
        else commands.handleAck(m)
      },
    })
    const commands = new CommandController({
      send: (cmd) => conn.send(cmd),
      getCommand: () => commandRef.current,
      setCommand,
    })
    const sequence = new SequenceController({
      commands,
      getCommand: () => commandRef.current,
      setCommand,
    })
    apiRef.current = { connection: conn, commands, sequence }
  }

  useEffect(() => {
    const api = apiRef.current
    if (api === null) return
    api.connection.connect()
    return () => api.connection.disconnect()
  }, [])

  const api = apiRef.current
  const value: TelemetryContextValue = {
    connection,
    telemetry,
    command,
    commands: api.commands,
    sequence: api.sequence,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function useCtx(): TelemetryContextValue {
  const ctx = useContext(Ctx)
  if (ctx === null) throw new Error('TelemetryProvider içinde kullanılmalı')
  return ctx
}

/** Son telemetri paketi (anlık). */
export function useTelemetry(): TelemetryPacket | null {
  return useCtx().telemetry
}

/** Bağlantı durumu. */
export function useConnection(): ConnectionStatus {
  return useCtx().connection
}

/** Komut alt sistemi durumu. */
export function useCommand(): CommandState {
  return useCtx().command
}

/** Komut ve sekans denetleyicileri. */
export function useControllers(): {
  commands: CommandController
  sequence: SequenceController
} {
  const { commands, sequence } = useCtx()
  return { commands, sequence }
}

/**
 * Geçmiş gerektiren bileşenler (grafik, 3D iz) için yerel, geçici tampon.
 * Global geçmiş tutulmaz; bileşen unmount olunca tampon sıfırlanır.
 */
export function useTelemetryBuffer(max = 300): readonly TelemetryPacket[] {
  const telemetry = useTelemetry()
  const [buffer, setBuffer] = useState<readonly TelemetryPacket[]>([])

  useEffect(() => {
    if (telemetry === null) return
    setBuffer((b) => {
      const next = [...b, telemetry]
      return next.length > max ? next.slice(next.length - max) : next
    })
  }, [telemetry, max])

  return buffer
}
