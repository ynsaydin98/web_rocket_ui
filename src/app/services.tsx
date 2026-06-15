// Servisleri (store + bağlantı + denetleyiciler) tek seferde kurar ve
// React ağacına context ile sağlar. Composition root burasıdır.

import {
  createContext,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { WS_URL } from '../config'
import { CommandController } from '../lib/commands'
import { SequenceController } from '../lib/sequence'
import {
  appendSample,
  createInitialState,
  Store,
  type AppState,
} from '../lib/store'
import { TelemetryConnection } from '../lib/websocket'

export interface Services {
  store: Store<AppState>
  connection: TelemetryConnection
  commands: CommandController
  sequence: SequenceController
}

function createServices(): Services {
  const store = new Store<AppState>(createInitialState())

  let commands!: CommandController

  // Veriler gerçek WebSocket sunucusundan (WS_URL) JSON olarak gelir.
  const connection = new TelemetryConnection({
    url: WS_URL,
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
