/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Telemetri WebSocket adresi. Boşsa mock kaynak kullanılır. */
  readonly VITE_WS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
