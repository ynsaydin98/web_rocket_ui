// Uygulama giriş noktası: modülleri birbirine bağlar (composition root).
// Burada global değişken yok; her şey yerel olarak kurulup enjekte edilir.

import './style.css'
import 'uplot/dist/uPlot.min.css'

import { CommandController } from './commands'
import { MockSocket } from './mockServer'
import {
  appendSample,
  createInitialState,
  Store,
  type AppState,
} from './store'
import { initUI } from './ui'
import { TelemetryConnection, type SocketFactory } from './websocket'

const root = document.querySelector<HTMLDivElement>('#app')
if (root === null) throw new Error('#app kök elemanı bulunamadı')

// VITE_WS_URL tanımlıysa gerçek WebSocket; değilse mock kaynak kullanılır.
const wsUrl = import.meta.env.VITE_WS_URL ?? ''
const useMock = wsUrl === ''
const factory: SocketFactory | undefined = useMock
  ? () => new MockSocket()
  : undefined

const store = new Store<AppState>(createInitialState())

const connection = new TelemetryConnection({
  url: wsUrl || 'ws://localhost:8080',
  ...(factory ? { factory } : {}),
  onStatus: (status) => store.setState({ connection: status }),
  onMessage: (message) => {
    if (message.type === 'telemetry') {
      store.setState((s) => ({
        latest: message,
        history: appendSample(s.history, message),
      }))
    } else {
      controller.handleAck(message)
    }
  },
})

const controller = new CommandController(store, (cmd) => connection.send(cmd))

initUI(root, store, controller)
connection.connect()
