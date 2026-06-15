// Servisleri (store + bağlantı + denetleyiciler) tek seferde kurar ve
// React ağacına context ile sağlar. Composition root burasıdır.

import {
  createContext,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { CommandController } from '../lib/commands'
import { MockSocket } from '../lib/mockServer'
import { SequenceController } from '../lib/sequence'
import {
  appendSample,
  createInitialState,
  Store,
  type AppState,
} from '../lib/store'
import { TelemetryConnection, type SocketFactory } from '../lib/websocket'

export interface Services {
  store: Store<AppState>
  connection: TelemetryConnection
  commands: CommandController
  sequence: SequenceController
}

function createServices(): Services {
  const store = new Store<AppState>(createInitialState())

  const wsUrl = import.meta.env.VITE_WS_URL ?? ''
  const factory: SocketFactory | undefined =
    wsUrl === '' ? () => new MockSocket() : undefined

  let commands!: CommandController

  const connection = new TelemetryConnection({
    url: wsUrl || 'ws://localhost:8080',
    ...(factory ? { factory } : {}),
    onStatus: (status) => store.setState({ connection: status }),
    onMessage: (message) => {
      if (message.type === 'telemetry') {
        store.setState((s) => ({
          latest: message,
          mode: message.mode,
          history: appendSample(s.history, message),
        }))
      } else {
        commands.handleAck(message)
      }
    },
  })

  commands = new CommandController(store, (cmd) => connection.send(cmd))
  const sequence = new SequenceController(store, commands)

  connection.connect()
  return { store, connection, commands, sequence }
}

const ServicesContext = createContext<Services | null>(null)

export function ServicesProvider({ children }: { children: ReactNode }) {
  // StrictMode çift-mount'una karşı tek örnek garanti et.
  const ref = useRef<Services | null>(null)
  if (ref.current === null) ref.current = createServices()
  return (
    <ServicesContext.Provider value={ref.current}>
      {children}
    </ServicesContext.Provider>
  )
}

export function useServices(): Services {
  const ctx = useContext(ServicesContext)
  if (ctx === null) throw new Error('useServices ServicesProvider içinde kullanılmalı')
  return ctx
}

/** Store'a abone olan ve seçilen dilimi döndüren hook. */
export function useStoreSelector<T>(selector: (state: AppState) => T): T {
  const { store } = useServices()
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  )
}
